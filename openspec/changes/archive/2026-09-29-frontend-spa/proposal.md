# Proposal

## Why

The challenge requires a React + TypeScript SPA to log in and query the financial score by RUT, with clear feedback on authentication and authorization errors. The backend (`auth`, `credit-score`) is done; this change adds the client that consumes it.

## What Changes

- New `frontend/` npm workspace: Vite + React + TypeScript, plain responsive CSS (no UI library).
- Login view against `POST /login`; the token is kept in `sessionStorage` with a logout action.
- Score view against `GET /score/:rut`, prefilled with the user's own RUT for the `user` role.
- Clear messages for wrong credentials, invalid RUT (400), forbidden RUT (403) and expired/invalid session (401 → back to login).
- Root `npm run dev` starts backend and frontend in parallel.

## Capabilities

### New Capabilities

- `score-web-app`: browser UI to authenticate and look up scores by RUT with user-facing error handling.

### Modified Capabilities

None.

## Impact

- New `frontend/` workspace and dependencies (React, Vite, `concurrently` at the root).
- ESLint config extended for React/browser files.
- Backend untouched (CORS already allows `http://localhost:5173`).
- Frontend code is fully AI-generated; this is declared in `ai_interactions.md`.
