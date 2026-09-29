# Financial Risk Score – ProntoPaga technical test

MVP to query the credit score of a person or company by RUT, secured with JWT and role-based access (`admin` / `user`).

## Requirements

- Node.js 24 (see `.nvmrc`; run `nvm use` if you use nvm)
- npm

## Quick start

```bash
npm install && npm run dev
```

The API listens on `http://localhost:3000`. No configuration is needed for local development.

## Backend

### Environment variables

Optional in development. Copy `backend/.env.example` to `backend/.env` to override them.

| Variable      | Default                 | Notes                                                        |
| ------------- | ----------------------- | ------------------------------------------------------------ |
| `NODE_ENV`    | `development`           | `development`, `test` or `production`                        |
| `PORT`        | `3000`                  |                                                              |
| `JWT_SECRET`  | built-in dev secret     | **Required in production** (min 32 chars)                    |
| `CORS_ORIGIN` | `http://localhost:5173` | Only origin allowed to call the API from a browser (the SPA) |

### Mock users

There is no database: users are hard-coded and only their scrypt hashes are stored in the code.

| Username | Password   | Role    | RUT            |
| -------- | ---------- | ------- | -------------- |
| `admin`  | `admin123` | `admin` | –              |
| `user`   | `user123`  | `user`  | `12.345.678-5` |

### Endpoints

**`POST /login`**: returns a JWT (HS256, 1h) whose payload has `sub`, `role` and, for users, `rut`.

```bash
curl -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"user","password":"user123"}'
# {"token":"eyJ..."}
```

**`GET /score/:rut`**: requires `Authorization: Bearer <token>`. Admins can query any RUT; users can only query their own.

```bash
curl http://localhost:3000/score/12.345.678-5 -H "Authorization: Bearer $TOKEN"
# {"rut":"12.345.678-5","score":30,"fecha":"2026-09-29T23:22:28Z"}
```

The score (0–100) is deterministic: it is derived from a SHA-256 hash of the normalized RUT, so the same RUT always gets the same score.

Errors share the shape `{ "error": { "code", "message" } }`:

| Status | When                                                    |
| ------ | ------------------------------------------------------- |
| `400`  | Invalid body or invalid RUT                             |
| `401`  | Wrong credentials, or missing / invalid / expired token |
| `403`  | A `user` queries a RUT that is not their own            |
| `404`  | Unknown route                                           |

> **About RUTs:** RUTs are accepted in any notation (`12.345.678-5`, `123456785`) and their modulo 11 check digit is validated. The example in the challenge statement (`12.345.678-9`) has an invalid check digit (the correct one is `5`), so it returns `400`.

### Scripts

Run from the repository root:

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start the API in watch mode        |
| `npm test`          | Run the tests (Vitest + supertest) |
| `npm run lint`      | ESLint                             |
| `npm run typecheck` | TypeScript type check              |
| `npm run build`     | Compile to `backend/dist`          |

### Architecture

Express 5 + TypeScript in an npm workspace (`backend/`). It applies Clean Architecture principles in a lightweight form: a pure `domain/` (RUT, score, errors), thin routes that delegate to services, a single `UserRepository` port, and manual dependency injection in `createApp(config)`. Decisions and trade-offs are documented in [`openspec/changes/backend-score-api/design.md`](openspec/changes/backend-score-api/design.md).
