# Tasks

Each task is one Conventional Commit (planned subject in backticks).

## 1. Workspace setup

- [x] 1.1 Move `src/`, `tsconfig*.json` and `vitest.config.ts` into `backend/` with its own `package.json`; make the root a workspaces root whose `build`/`typecheck`/`test` delegate to workspaces; update ESLint paths. Verify lint, format:check, typecheck, test and build pass from the root — `refactor: move backend into an npm workspace`
- [x] 1.2 Move backend-only dev dependencies (`vitest`, `@vitest/coverage-v8`, `@types/node`) to `backend/package.json`. Verify `npm ci` and `npm test` pass — `build(backend): declare backend-only dev dependencies`
- [x] 1.3 Add Express app with `GET /health`, server entrypoint and `dev` script (tsx watch), plus supertest and the first test; remove `passWithNoTests`. Verify the `/health` supertest passes and `npm run dev` answers `200` — `feat(backend): add Express app with health check`
- [x] 1.4 Load `PORT` and `JWT_SECRET` from the environment with `.env.example`, failing fast when the secret is missing outside development. Verify startup with and without the variables — `feat(backend): load configuration from environment`

## 2. Domain helpers

- [x] 2.1 RUT normalize / check-digit validation / format with unit tests (dotted, plain, `K`, invalid digit). Verify `npm test` — `feat(backend): add RUT validation and formatting`
- [x] 2.2 Deterministic score function with unit tests (0–100, stable, format-independent). Verify `npm test` — `feat(backend): add deterministic score calculation`

## 3. Auth

- [x] 3.1 Typed app errors, error middleware and 404 handler producing `{ error: { code, message } }`. Verify with a supertest case for an unknown route — `feat(backend): add centralized error handling`
- [x] 3.2 Mock users and timing-safe credential check with unit tests. Verify `npm test` — `feat(backend): add mock users and credential check`
- [x] 3.3 `POST /login` with zod body validation returning a signed JWT. Verify with supertest: user payload with `rut`, admin payload without `rut`, `401`, `400` — `feat(backend): add POST /login endpoint`
- [x] 3.4 Authentication middleware (Bearer, signature, expiration, pinned algorithm). Verify `401` for missing, tampered and expired tokens — `feat(backend): add JWT authentication middleware`

## 4. Score

- [x] 4.1 Protected `GET /score/:rut` returning `{ rut, score, fecha }`, `400` on invalid RUT. Verify with supertest — `feat(backend): add GET /score/:rut endpoint`
- [x] 4.2 Role-based authorization: `user` own RUT only (`403` otherwise), `admin` any RUT. Verify with supertest — `feat(backend): restrict score access by role`
- [x] 4.3 Enable CORS for the SPA origin (`CORS_ORIGIN`, dev default). Verify preflight response headers — `feat(backend): enable CORS for the SPA origin`
- [x] 4.4 README backend section: run commands, env vars, mock credentials, RUT check-digit note. Verify the commands work from a clean `npm install` — `docs: document backend setup and usage`
