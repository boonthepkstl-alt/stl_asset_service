package main

// The PostgreSQL migration files are embedded into the binary rather than read from disk at run
// time, because the runtime image copies only the compiled binary -- see Dockerfile's second stage,
// which does `COPY --from=build /out/server ./server` and nothing else. A filesystem read would work
// on a developer's machine and fail in the container, which is the worst of both.
//
// go:embed is stdlib, so this adds no dependency. The pattern deliberately names the directory
// rather than listing files, so a future V7 is picked up by adding the .sql file alone.
//
// Only sql/pg is embedded. sql/mssql, sql/oracle and sql/tt exist for the company template's other
// dialects and are not part of RAISE's PostgreSQL schema (Open Finding F-16 covers PG only).

import "embed"

//go:embed sql/pg/*.sql
var pgMigrationFS embed.FS

// pgMigrationDir is the path within pgMigrationFS, which keeps the embedded directory structure.
const pgMigrationDir = "sql/pg"
