package main

// The -migrate entrypoint for Open Finding F-16's scoped-down first cut (2026-09-18).
//
// Usage:
//
//	./server -migrate                 apply every migration this database has not recorded
//	./server -migrate -baseline=6     adopt a database whose schema predates the runner:
//	                                  record V0..V6 as applied WITHOUT executing them
//
// In the composed stack: docker compose run --rm backend -migrate
// (the image's ENTRYPOINT is already ./server, so the flags are the whole command -- passing
// `./server -migrate` instead makes flag.Parse stop at the positional and start the server).
//
// Why a flag on the existing binary rather than a second command: the Dockerfile builds one target
// (`go build -o /out/server .`) and the runtime stage copies that one file. A cmd/migrate package
// would need a second build, a second COPY and a compose change -- more moving parts than this cut
// needs to close the finding.
//
// Why this prints with fmt instead of the shared logger: logger.GetLogger()'s Info level is
// suppressed in this environment -- verified, not assumed, by checking the running backend's own
// output, where even main.go's `-= Start Service =-` never appears while [ERRO] lines do. A
// migration tool whose success output is invisible is worse than useless, and changing the shared
// logger's configuration would be an unrelated app-wide change. Errors also go to the logger so
// they land wherever the app's errors already land.

import (
	"errors"
	"flag"
	"fmt"
	"os"
	"singer/go-template-new-2026-06/repository"

	"github.com/sirupsen/logrus"
)

var (
	migrateOnly     = flag.Bool("migrate", false, "apply pending PostgreSQL migrations, then exit without starting the server")
	migrateBaseline = flag.Int("baseline", -1, "with -migrate: record migrations up to and including this version as applied WITHOUT executing them, for a database whose schema predates the migration runner")
)

// runMigrationsAndExit never returns -- it exits 0 on success and 1 on failure, so a CI step or a
// `docker compose run` reports the real outcome instead of a server that silently started anyway.
func runMigrationsAndExit(log *logrus.Entry, baseline int) {
	db, err := repository.GetPGWriteDb()
	if err != nil {
		fmt.Fprintf(os.Stderr, "migrate: cannot reach PostgreSQL: %v\n", err)
		log.Errorf("-migrate: cannot reach PostgreSQL: %v", err)
		os.Exit(1)
	}

	result, err := repository.RunPGMigrations(db, pgMigrationFS, pgMigrationDir, repository.MigrateOptions{Baseline: baseline})
	if err != nil {
		// The refusal is a legitimate outcome, not a crash: the runner will not guess which
		// migrations an existing database has already received. Say what to do about it rather than
		// printing a bare error, because the answer is not obvious from the message alone.
		if errors.Is(err, repository.ErrBaselineRequired) {
			fmt.Fprintln(os.Stderr, "migrate: this database already has tables but no schema_migrations history.")
			fmt.Fprintln(os.Stderr, "migrate: the runner will not guess which migrations it has already received.")
			fmt.Fprintln(os.Stderr, "migrate: inspect the schema, then re-run naming the highest version it already has:")
			fmt.Fprintln(os.Stderr, "migrate:     docker compose run --rm backend -migrate -baseline=6")
			log.Error("-migrate: refused -- existing schema with no migration history, baseline required")
			os.Exit(1)
		}
		fmt.Fprintf(os.Stderr, "migrate: failed: %v\n", err)
		log.Errorf("-migrate: failed: %v", err)
		os.Exit(1)
	}

	for _, m := range result.Baselined {
		fmt.Printf("migrate: baselined V%d__%s (recorded, not executed)\n", m.Version, m.Name)
	}
	for _, m := range result.Applied {
		fmt.Printf("migrate: applied    V%d__%s\n", m.Version, m.Name)
	}
	if len(result.Baselined) == 0 && len(result.Applied) == 0 {
		fmt.Println("migrate: database already up to date, nothing to do")
	}
	fmt.Printf("migrate: done (%d baselined, %d applied)\n", len(result.Baselined), len(result.Applied))
	os.Exit(0)
}
