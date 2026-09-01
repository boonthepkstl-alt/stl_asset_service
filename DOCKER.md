# Docker — Local 3-Container Stack

Local development/demo infrastructure for RAISE: one container each for
`frontend/`, `go-template-main/`, and PostgreSQL, orchestrated by
`docker-compose.yml` at the repo root.

**Scope note:** this is local dev/demo tooling, not a production hosting
decision. `docs/project-management/OPEN-FINDINGS.md`'s **F-13** (hosting
target) and **F-14** (CI/CD pipeline) remain open — this stack makes the
app runnable in containers, it does not decide where those containers
would run in production, and no CI is wired up to build/push images.

## Quick Start

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Postgres: localhost:5432 (`raise` / `raise_dev_password` / db `raise` by default)

First run only: Postgres is empty, so the official image auto-applies
every `.sql` file in `go-template-main/sql/pg/` (V0 through V4, in
order) via its `docker-entrypoint-initdb.d` mechanism. This only
happens against a **fresh** data volume — see "Resetting the database"
below if you need to re-apply schema changes.

## Configuration

Copy `docker.env.example` to `.env` in the repo root to override any
default (DB credentials, host ports, the frontend's backend URL).
`docker compose` reads `.env` automatically.

## Services

| Service | Image / Build | Port (host) | Notes |
|---|---|---|---|
| `db` | `postgres:16-alpine` | 5432 | Auto-applies `sql/pg/*.sql` on first init only |
| `backend` | built from `go-template-main/Dockerfile` (Go 1.23, multi-stage) | 8080 | Reads `DB_PG_*` env vars (see `go-template-main/repository/dbManager.go`); waits for `db`'s healthcheck |
| `frontend` | built from `frontend/Dockerfile` (Node 20 → nginx, multi-stage) | 3000 | `VITE_*` vars are baked in at **build** time, not runtime — see below |

## Important: frontend env vars are build-time, not runtime

Vite inlines every `VITE_*` variable into the built JS bundle when
`npm run build` runs — changing an env var on an already-built container
does nothing. If you change `VITE_API_BASE_URL` (e.g. because you
changed `BACKEND_PORT`), you must rebuild the frontend image:

```bash
docker compose build frontend
docker compose up -d frontend
```

## Resetting the database

The `db` service's data lives in a named volume (`db_data`), so restarts
keep your data — and skip re-running the init SQL. To start from a
clean schema:

```bash
docker compose down -v   # -v also removes the db_data volume
docker compose up --build
```

## What this does not do

- **No migration tool.** Schema changes beyond the existing `V0`–`V4`
  files are not tracked or auto-applied — this mirrors the app's
  existing state (Open Finding **F-16**), not a new limitation
  introduced by Docker.
- **No production secrets management.** `docker.env.example`'s defaults
  are for local dev only; never reuse `raise_dev_password` anywhere real.
- **No CI/CD.** These Dockerfiles are not yet built/pushed by any
  pipeline (Open Finding **F-14**).
