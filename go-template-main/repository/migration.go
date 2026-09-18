package repository

// PostgreSQL migration runner -- Open Finding F-16's scoped-down first cut (2026-09-18).
//
// What F-16 actually describes, and what this closes: sql/pg/V*__*.sql were applied BY HAND, and
// nothing recorded which of them any given database had received. docker-compose.yml mounts that
// directory into /docker-entrypoint-initdb.d, which the official postgres image runs ONLY on first
// init against an empty volume -- so a migration added after a developer's volume already exists is
// silently skipped for them, with no way to notice. The 2026-09-16 validation had to confirm V6's
// indexes by querying pg_indexes directly, because there was no schema-version table to ask.
//
// Deliberately NOT a migration framework. No new dependency: the files are read from an fs.FS the
// caller supplies (main.go embeds them via go:embed, because the runtime image copies only the
// binary -- see Dockerfile), version order comes from the existing Flyway-style V<n>__<name>.sql
// naming, and state lives in one table. The existing V0-V6 files are NOT renamed and NOT edited;
// this adopts them as they are. Renaming would have broken every document that cites them by name,
// and annotating them in place (what goose requires) would have rewritten migrations already
// applied to real databases.
//
// Out of scope for this cut, each a separate decision rather than an oversight: running
// automatically at application startup (racy across multiple instances without more care than this
// has), down/rollback migrations, and CI integration (capped by F-13, no hosting target decided).

import (
	"database/sql"
	"errors"
	"fmt"
	"io/fs"
	"path"
	"regexp"
	"singer/go-template-new-2026-06/logger"
	"sort"
	"strconv"
)

// migrationFilePattern matches the existing Flyway-style naming, e.g. V6__Additional_Indexes.sql.
var migrationFilePattern = regexp.MustCompile(`^V(\d+)__(.+)\.sql$`)

// advisoryLockKey guards against two runners migrating the same database concurrently. The value is
// arbitrary but must stay stable -- changing it would defeat the lock against an older binary.
const advisoryLockKey int64 = 8163264

// ErrBaselineRequired is returned when the tracking table is absent but the database already has
// objects in it. The runner will NOT guess which migrations such a database has already received:
// assuming "all of them" would skip a genuinely pending migration, and assuming "none" would re-run
// CREATE TABLE against populated tables. The operator states the answer via MigrateOptions.Baseline.
var ErrBaselineRequired = errors.New("migration: existing schema with no migration history -- re-run with an explicit baseline version")

// Migration is one file on disk, identified by the version encoded in its name.
type Migration struct {
	Version int
	Name    string
	Path    string
}

// MigrateOptions controls one run.
type MigrateOptions struct {
	// Baseline, when >= 0, records every migration up to and including that version as applied
	// WITHOUT executing it, then applies anything above it normally. Used once, to adopt a
	// database whose schema predates this runner.
	Baseline int
}

// MigrateResult reports what a run actually did, so the caller can log it rather than guess.
type MigrateResult struct {
	Baselined []Migration
	Applied   []Migration
}

// ParseMigrations reads dir from fsys and returns its migrations in version order.
//
// Rejects rather than tolerates: a .sql file whose name does not match the V<n>__<name>.sql
// convention is an error, not a file to skip quietly, because skipping is how a migration goes
// missing without anyone noticing -- the exact failure F-16 is about. Duplicate versions are an
// error for the same reason.
func ParseMigrations(fsys fs.FS, dir string) ([]Migration, error) {
	entries, err := fs.ReadDir(fsys, dir)
	if err != nil {
		return nil, fmt.Errorf("migration: read %s: %w", dir, err)
	}

	var migrations []Migration
	seen := map[int]string{}
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		name := entry.Name()
		match := migrationFilePattern.FindStringSubmatch(name)
		if match == nil {
			return nil, fmt.Errorf("migration: %s does not match V<version>__<name>.sql", name)
		}
		version, err := strconv.Atoi(match[1])
		if err != nil {
			return nil, fmt.Errorf("migration: %s has an unparseable version: %w", name, err)
		}
		if prev, dup := seen[version]; dup {
			return nil, fmt.Errorf("migration: version %d appears twice (%s and %s)", version, prev, name)
		}
		seen[version] = name
		migrations = append(migrations, Migration{Version: version, Name: match[2], Path: path.Join(dir, name)})
	}

	sort.Slice(migrations, func(i, j int) bool { return migrations[i].Version < migrations[j].Version })
	return migrations, nil
}

// PendingMigrations returns those not present in applied, in version order.
//
// A gap is applied, not treated as an error: a version missing from the middle is exactly what a
// database baselined before that migration existed looks like, and refusing would strand it.
func PendingMigrations(available []Migration, applied map[int]bool) []Migration {
	var pending []Migration
	for _, m := range available {
		if !applied[m.Version] {
			pending = append(pending, m)
		}
	}
	return pending
}

// SplitAtBaseline divides available into those at or below baseline (to be recorded as applied
// without executing) and those above it (to be executed normally).
func SplitAtBaseline(available []Migration, baseline int) (record, apply []Migration) {
	for _, m := range available {
		if m.Version <= baseline {
			record = append(record, m)
		} else {
			apply = append(apply, m)
		}
	}
	return record, apply
}

const createSchemaMigrations = `
CREATE TABLE IF NOT EXISTS schema_migrations (
	version integer NOT NULL,
	name varchar(200) NOT NULL,
	applied_at timestamptz NOT NULL DEFAULT now(),
	baselined boolean NOT NULL DEFAULT false,
	CONSTRAINT schema_migrations_pk PRIMARY KEY (version)
)`

// RunPGMigrations brings db up to date with the migrations in fsys/dir.
//
// Behaviour, stated precisely because the wrong branch here damages a real database:
//   - tracking table present  -> apply every version it does not list.
//   - tracking table absent, schema empty -> create it and apply everything.
//   - tracking table absent, schema NOT empty -> refuse with ErrBaselineRequired, unless the caller
//     supplied an explicit Baseline, in which case record up to it and apply the rest.
func RunPGMigrations(db *sql.DB, fsys fs.FS, dir string, opts MigrateOptions) (MigrateResult, error) {
	var result MigrateResult

	available, err := ParseMigrations(fsys, dir)
	if err != nil {
		return result, err
	}
	if len(available) == 0 {
		return result, fmt.Errorf("migration: no migration files found in %s", dir)
	}

	if _, err := db.Exec(`SELECT pg_advisory_lock($1)`, advisoryLockKey); err != nil {
		return result, fmt.Errorf("migration: acquire advisory lock: %w", err)
	}
	defer func() {
		if _, unlockErr := db.Exec(`SELECT pg_advisory_unlock($1)`, advisoryLockKey); unlockErr != nil {
			logger.GetLogger().Errorf("migration: release advisory lock: %v", unlockErr)
		}
	}()

	tracked, err := tableExists(db, "schema_migrations")
	if err != nil {
		return result, err
	}

	toApply := available
	if tracked {
		applied, err := appliedVersions(db)
		if err != nil {
			return result, err
		}
		toApply = PendingMigrations(available, applied)
	} else {
		populated, err := schemaHasObjects(db)
		if err != nil {
			return result, err
		}
		switch {
		case opts.Baseline >= 0:
			record, apply := SplitAtBaseline(available, opts.Baseline)
			if err := createTracking(db); err != nil {
				return result, err
			}
			for _, m := range record {
				if err := recordMigration(db, m, true); err != nil {
					return result, err
				}
			}
			result.Baselined = record
			toApply = apply
		case populated:
			return result, ErrBaselineRequired
		default:
			if err := createTracking(db); err != nil {
				return result, err
			}
		}
	}

	for _, m := range toApply {
		if err := applyMigration(db, fsys, m); err != nil {
			return result, err
		}
		result.Applied = append(result.Applied, m)
	}
	return result, nil
}

func createTracking(db *sql.DB) error {
	if _, err := db.Exec(createSchemaMigrations); err != nil {
		return fmt.Errorf("migration: create schema_migrations: %w", err)
	}
	return nil
}

func tableExists(db *sql.DB, name string) (bool, error) {
	var exists bool
	err := db.QueryRow(`SELECT to_regclass('public.' || $1) IS NOT NULL`, name).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("migration: check for table %s: %w", name, err)
	}
	return exists, nil
}

// schemaHasObjects reports whether public holds any table at all -- the signal that a database
// predates this runner rather than being a fresh one.
func schemaHasObjects(db *sql.DB) (bool, error) {
	var count int
	err := db.QueryRow(`SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'`).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("migration: inspect public schema: %w", err)
	}
	return count > 0, nil
}

func appliedVersions(db *sql.DB) (map[int]bool, error) {
	rows, err := db.Query(`SELECT version FROM schema_migrations`)
	if err != nil {
		return nil, fmt.Errorf("migration: read schema_migrations: %w", err)
	}
	defer rows.Close()

	applied := map[int]bool{}
	for rows.Next() {
		var version int
		if err := rows.Scan(&version); err != nil {
			return nil, fmt.Errorf("migration: scan schema_migrations: %w", err)
		}
		applied[version] = true
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("migration: iterate schema_migrations: %w", err)
	}
	return applied, nil
}

func recordMigration(db *sql.DB, m Migration, baselined bool) error {
	_, err := db.Exec(
		`INSERT INTO schema_migrations (version, name, baselined) VALUES ($1, $2, $3)`,
		m.Version, m.Name, baselined,
	)
	if err != nil {
		return fmt.Errorf("migration: record V%d: %w", m.Version, err)
	}
	return nil
}

// applyMigration runs one file and records it in the SAME transaction, so a database can never end
// up with a migration's effects but no record of it (or the reverse).
func applyMigration(db *sql.DB, fsys fs.FS, m Migration) error {
	body, err := fs.ReadFile(fsys, m.Path)
	if err != nil {
		return fmt.Errorf("migration: read %s: %w", m.Path, err)
	}

	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("migration: begin V%d: %w", m.Version, err)
	}
	defer tx.Rollback()

	if _, err := tx.Exec(string(body)); err != nil {
		return fmt.Errorf("migration: apply V%d (%s): %w", m.Version, m.Name, err)
	}
	if _, err := tx.Exec(
		`INSERT INTO schema_migrations (version, name, baselined) VALUES ($1, $2, false)`,
		m.Version, m.Name,
	); err != nil {
		return fmt.Errorf("migration: record V%d: %w", m.Version, err)
	}
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("migration: commit V%d: %w", m.Version, err)
	}

	logger.GetLogger().Infof("migration: applied V%d__%s", m.Version, m.Name)
	return nil
}
