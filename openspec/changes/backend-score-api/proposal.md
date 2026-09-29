# Proposal

## Why

The challenge asks for a secure MVP to query the financial risk score of a person or company by RUT, protected by JWT and role-based access. The backend is the core of the evaluation (Node.js Backend role), so it goes first; the React SPA will consume it in a later change.

## What Changes

- Move the current single-package setup into a `backend/` npm workspace (root keeps shared tooling: ESLint, Prettier, TypeScript, OpenSpec).
- Add a REST API with:
  - `POST /login`: authenticates against mock users (no persistence) and returns a signed JWT with `sub`, `role` and, for `user`, `rut`.
  - `GET /score/:rut`: returns a deterministic score (0–100) for a valid RUT with the query timestamp.
- Add authentication (JWT signature + expiration) and authorization (`user` → own RUT only, `admin` → any RUT) middlewares.
- Consistent JSON error responses and input validation (including RUT check digit).

## Capabilities

### New Capabilities

- `auth`: login with mock credentials and JWT-based authentication of requests.
- `credit-score`: deterministic score lookup by RUT with role-based access.

### Modified Capabilities

None.

## Impact

- New `backend/` workspace; root `package.json` becomes a workspaces root.
- New runtime dependencies: HTTP framework, JWT library, schema validation.
- New env var `JWT_SECRET` (with a documented dev default via `.env.example`).
