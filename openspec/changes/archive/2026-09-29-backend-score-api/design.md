# Design

## Context

Repo currently has a single TypeScript package at the root (ESM, strict, ESLint, Prettier, Vitest) with an empty `src/index.ts`. A React SPA will be added later as a sibling workspace. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**

- Small, readable layered structure: routes → middlewares → services, with pure domain helpers (RUT, score) unit-tested.
- Consistent error handling: one error middleware producing `{ "error": { "code", "message" } }`.

**Non-Goals:**

- Persistence, refresh tokens, logout/revocation, user management, rate limiting, deployment/IaC.

## Decisions

- **Lightweight Clean Architecture**: full Clean Architecture (entities, use cases, ports/adapters everywhere, DI container) is overkill for two endpoints without persistence. Its principles are applied where they pay off:
  - Dependency rule: `domain/` (RUT, score, errors) is pure TypeScript with no Express/JWT imports; routes stay thin and delegate to services.
  - One port where it adds value: `UserRepository` interface with an in-memory mock implementation, so swapping mocks for a database does not touch login logic.
  - Manual dependency injection: `createApp(deps)` in `app.ts` wires config and repositories (no container); `server.ts` only listens. This also makes the app testable with supertest.

  ```
  backend/src/
  ├── domain/        rut.ts, score.ts, errors.ts
  ├── modules/
  │   ├── auth/      auth.routes.ts, auth.service.ts, user.repository.ts
  │   └── score/     score.routes.ts, score.service.ts
  ├── middlewares/   authenticate.ts, authorize.ts, error-handler.ts
  ├── config.ts
  ├── app.ts
  └── server.ts
  ```

- **npm workspaces (`backend/`, later `frontend/`)**: one `npm install` / `npm run dev` at the root as the statement asks. Shared lint/format config stays at the root.
- **Express 5**: widely known, minimal, native async error handling. Fastify was considered; Express keeps the MVP simpler to read.
- **`jsonwebtoken` with HS256**: symmetric secret is enough for a single service. Secret from `JWT_SECRET`, expiration `1h`; verification pins `algorithms: ['HS256']`.
- **`zod` for input validation**: typed parsing of the login body and the `:rut` param.
- **Mock users in code**: an `admin` and a `user` (with a valid RUT). Only scrypt hashes live in source (Node's built-in `node:crypto`, salted, memory-hard; preferred over bcrypt, which needs a native package and truncates at 72 bytes). Verification uses `timingSafeEqual`, and unknown usernames are checked against a dummy hash so they cannot be told apart by timing. Plain-text credentials only appear in the README.
- **RUT**: normalize (strip dots/dash, uppercase `K`), validate modulo 11 check digit, format as `12.345.678-5`. Authorization compares normalized RUTs.
- **Score**: `SHA-256(normalizedRut)` → first 4 bytes as uint32 → `% 101`. Deterministic, uniform enough, no state.
- **Status codes**: `400` validation, `401` authn (missing/invalid/expired token, bad credentials), `403` authz, `404` unknown route, `500` unexpected (no internals leaked).
- **CORS** enabled for the SPA origin (configurable via env, dev default).
- **Tooling**: `tsx watch` for dev; tests with Vitest + `supertest` against the Express app (no network listen).

## Risks / Trade-offs

- [Mock users hard-coded in source] → acceptable for an MVP with no persistence; only hashes are stored and the `UserRepository` port allows swapping in a database.
- [Hash `% 101` can collide] → spec only requires determinism and variation, not uniqueness.
- [Default dev `JWT_SECRET`] → `.env.example` + fail fast in non-dev if missing.
