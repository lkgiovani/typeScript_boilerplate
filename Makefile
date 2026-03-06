.PHONY: dev build start stop restart logs ps migrate health ready

# ── Dev ──────────────────────────────────────────────────────────────────────

dev:
	bun --hot src/index.ts

# ── Docker ───────────────────────────────────────────────────────────────────

build:
	docker compose build

start:
	docker compose up -d

stop:
	docker compose down

restart:
	docker compose down && docker compose up -d

logs:
	docker compose logs -f api

ps:
	docker compose ps

# ── Infra only (sem api) ──────────────────────────────────────────────────────

infra:
	docker compose up -d postgres redis otel-collector tempo loki prometheus grafana

infra-stop:
	docker compose stop postgres redis otel-collector tempo loki prometheus grafana

# ── Migrations ───────────────────────────────────────────────────────────────

migrate:
	bunx typeorm migration:run -d src/shared/infra/persistence/data-source.ts

migrate-create:
	bunx typeorm migration:create src/migrations/$(name)

migrate-revert:
	bunx typeorm migration:revert -d src/shared/infra/persistence/data-source.ts

# ── Health ────────────────────────────────────────────────────────────────────

health:
	curl -s http://localhost:3333/health | bun --print "JSON.stringify(JSON.parse(await Bun.stdin.text()), null, 2)"

ready:
	curl -s http://localhost:3333/ready | bun --print "JSON.stringify(JSON.parse(await Bun.stdin.text()), null, 2)"

# ── Tests ─────────────────────────────────────────────────────────────────────

test:
	bun test

test-watch:
	bun test --watch
