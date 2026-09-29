# Tasks

Each task is one Conventional Commit (planned subject in backticks).

## 1. Setup

- [ ] 1.1 Scaffold Vite + React + TS in `frontend/`, remove boilerplate, register the workspace. Verify `npm run build` and `npm run typecheck` pass from the root — `feat(frontend): scaffold Vite React app`
- [ ] 1.2 Extend ESLint for React (hooks, refresh) and browser globals in `frontend/`. Verify `npm run lint` passes — `chore(frontend): lint React code`
- [ ] 1.3 Run backend and frontend in parallel from the root `dev` script with `concurrently`. Verify both start with `npm run dev` — `build: run backend and frontend together in dev`

## 2. Features

- [ ] 2.1 Typed API client with `ApiError` and session storage helpers, plus one unit test for error mapping. Verify `npm test` — `feat(frontend): add API client and session storage`
- [ ] 2.2 Login view with error message on `401`. Verify login in the browser — `feat(frontend): add login view`
- [ ] 2.3 Score view (prefilled RUT for users, result card, `400`/`403` messages, `401` → back to login, logout). Verify each scenario in the browser — `feat(frontend): add score lookup view`
- [ ] 2.4 Responsive styles. Verify on a narrow viewport — `style(frontend): add responsive layout`

## 3. Docs

- [ ] 3.1 README frontend section (URL, env var, usage). Verify the documented commands — `docs: document frontend usage`
