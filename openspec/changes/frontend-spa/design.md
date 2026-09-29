# Design

## Context

The backend runs on `http://localhost:3000` with CORS allowing `http://localhost:5173` (Vite's default). The repo is an npm workspaces monorepo; root `npm run dev` currently runs workspaces serially, which would block on the backend watcher. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**

- Minimal, readable SPA: two views, a typed API client, explicit error mapping.

**Non-Goals:**

- Router library, global state library, UI kit, refresh tokens, i18n, component/E2E test suite.

## Decisions

- **Vite + React + TS** scaffold in `frontend/`, trimmed of boilerplate. Two views switched by session state instead of a router (only two screens).
- **API client** (`src/api.ts`): `fetch` wrapper with base URL from `VITE_API_URL` (default `http://localhost:3000`) that turns `{ error: { code, message } }` responses into a typed `ApiError` with the HTTP status, so views map statuses to messages in one place.
- **Session**: token in `sessionStorage` (cleared when the tab closes; smaller exposure than `localStorage`). The payload is decoded client-side only to read `role`/`rut` for display and prefill; the server remains the authority.
- **Styling**: one plain CSS file, mobile-first, no dependencies.
- **Parallel dev**: `concurrently` at the root runs both workspaces' `dev` scripts with prefixed output.
- **Lint**: extend the root flat config with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`, browser globals for `frontend/`.

## Risks / Trade-offs

- [Token readable by JS in `sessionStorage`] → acceptable for the MVP; an httpOnly cookie would need backend changes and CSRF handling.
- [No frontend tests] → UI is thin; logic worth testing (error mapping) is small and covered by one unit test.
