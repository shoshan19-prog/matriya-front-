# CLAUDE.md — matriya-front-

Guidance for Claude Code (and any AI agent) working in this repository. Read this before making changes.

## What this project is

**matriya-front-** is the web frontend for Matriya (a RAG system): a single-page app with tabs for Upload, Search, Ask Matriya, Admin, and Management Lab.

- **Framework:** React 18 built with **Create React App** (`react-scripts` 5).
- **Language:** plain JavaScript / JSX. **No TypeScript** — do not add it.
- **HTTP:** Axios, via a shared instance in `src/utils/api.js` with an auth interceptor.
- **State:** React hooks only (`useState`/`useEffect`). No Redux/Zustand/Context library — don't add one for routine work.
- **Styling:** plain CSS, one `.css` file per component. No Tailwind, no CSS modules, no SCSS.
- **UI language:** bilingual — English in code/headers, Hebrew (RTL) in user-facing UI strings.

## Project structure

```
src/
  App.js                 # top-level tab switcher / router
  index.js               # React entry
  components/
    UploadTab.js, SearchTab.js, AskMatriyaTab.js,
    AdminTab.js (large), LoginTab.js, ManagementLabTab.js, ...
    + a matching .css per component
  utils/
    api.js               # axios instance + auth (Bearer token) interceptor
    managementApi.js, managementConfig.js, formatBold.js, ...
```

Some components are large (`AdminTab.js` ~57KB, `SearchTab.js` ~41KB). Prefer editing the relevant section in place over rewriting these files wholesale.

## How to run, build, and verify

```bash
npm start        # or npm run dev — dev server at http://localhost:3000
npm run build    # production build to build/
npm test         # CRA/Jest test runner — but NO test files exist yet
```

Linting runs through CRA's `react-app` ESLint config at build time; there's no standalone `npm run lint`. Since there are no test files, don't claim "tests pass" — instead verify by running `npm start` (or `npm run build`) and confirming the change behaves correctly.

## Backend / configuration

- API base URL: `REACT_APP_API_BASE_URL` (local `http://localhost:8000`; prod defaults to `https://matriya-back.vercel.app`).
- Optional management integration: `REACT_APP_MANAGEMENT_API_URL`, `REACT_APP_MANAGEMENT_FRONT_URL`.
- Auth: JWT in `localStorage`; the axios interceptor adds `Authorization: Bearer <token>`.
- **CRA env rule:** browser-exposed vars must be prefixed `REACT_APP_`, and they're baked in at **build time** (not runtime). See `.env.example` / `ENV_SETUP.md`. Never commit `.env`; never put secrets in frontend env (anything shipped to the browser is public).

## Working agreement (the important part)

1. **Don't over-engineer.** This is a hooks-based CRA app with per-component CSS. Solve the task with the smallest change that fits — no new state libraries, no TypeScript, no component frameworks, no dependencies unless the task truly requires it and you've said why.
2. **Follow instructions and conventions.** Functional components + hooks, plain CSS files, Axios through `src/utils/api.js` (don't create ad-hoc axios calls or hardcode URLs — use the configured base + env vars). Keep Hebrew UI strings consistent with the existing style.
3. **Don't claim done until it's verified.** "Done" means you ran `npm start`/`npm run build` and confirmed the UI/behavior, not just that the file compiles in your head. If you couldn't run it, say so explicitly — never report success on unverified UI changes.
4. **Don't invent APIs.** Use only React/Axios methods and backend endpoints you've confirmed. Before calling a backend route, check `src/utils/api.js` (and the matriya-back routes) for the real path and payload shape. Don't guess endpoint names, response fields, or props that a component doesn't actually accept.
5. **Surface uncertainty.** If a request is ambiguous, would require touching a large monolith component broadly, or depends on a backend endpoint you can't confirm, ask or flag rather than guessing.

## Git

- Develop on branch `claude/new-session-ydal7p`.
- Clear, descriptive commit messages. Do not open a PR unless explicitly asked.
- Never commit secrets or `.env`.
