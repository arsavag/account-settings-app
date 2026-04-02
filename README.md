# Account Settings App

Full-stack demo for **managing per-account settings**: a **React** UI lists accounts, loads each account’s settings from an **Express + SQLite** API, and saves changes back to the server.

---

## What it does

- **Accounts** — Fetches accounts from the backend and lets the user pick one.
- **Settings form** — For the selected account, loads merged **defaults + stored overrides** and renders a **dynamic form** driven by `SETTINGS_CONFIG` (booleans, text, numbers, select, multiselect).
- **Persistence** — Settings are stored in SQLite (`account_settings`); the backend merges stored rows with `defaultSettings` so the API always returns a complete object for the UI.

---

## Architecture

| Part | Stack | Role |
|------|--------|------|
| **frontend/** | Vite, React 19, MUI, react-hook-form | SPA: account list + dynamic settings form; calls REST API via `fetch`. |
| **backend/** | Express 5, TypeScript, `sqlite` + `sqlite3` | REST API, CORS, JSON body; SQLite file on disk. |

The frontend **`apiConfig`** points at **`http://localhost:3000`** by default. **Vite** proxies **`/api/*`** to the same host in dev (see `frontend/vite.config.ts`), so you can later switch the UI to relative `/api` URLs if you align `apiConfig` with that pattern.

---

## Repository layout

```
account-settings-app/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express app, CORS, JSON, init DB, listen
│   │   ├── useRoutes.ts          # Mounts /api/accounts, /api/settings
│   │   ├── configs/
│   │   │   ├── database.ts       # SQLite connection + schema + seed accounts
│   │   │   └── defaultSettings.ts
│   │   └── api/
│   │       ├── accounts/         # GET list
│   │       └── settings/         # GET/PUT per accountId
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── config/
│   │   │   ├── apiConfig.ts      # API base URL + route paths
│   │   │   └── settingsConfig.ts # Form field definitions (must match backend keys)
│   │   ├── services/api.ts       # getAccounts, getSettings, saveSettings
│   │   ├── types/settings.ts
│   │   ├── components/           # AccountList, DynamicForm
│   │   └── pages/AccountSettings/
│   ├── vite.config.ts            # dev proxy /api → localhost:3000
│   └── package.json
└── README.md
```

---

## Backend API

Base URL: **`http://localhost:3000`** (override with env **`PORT`**).

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/accounts` | JSON array of `{ id, name }`. |
| `GET` | `/api/settings/:accountId` | Merged default + stored settings for that account. |
| `PUT` | `/api/settings/:accountId` | Body: JSON object of settings; upserts rows in `account_settings`. |

---

## Database

- **File:** `database.sqlite` in the **current working directory** when you start the backend (typically `backend/`).
- **Tables:** `accounts`, `account_settings` (created in `initDb()`).
- **Seed:** If `accounts` is empty, three sample accounts are inserted (`1`, `2`, `3`).

The backend **`.gitignore`** ignores `*.sqlite` so local DB files are not committed.

---

## Prerequisites

- **Node.js** (use a current LTS; Vite 8 prefers **20.19+** or **22.12+** per its warning).
- **npm** (or use your usual package manager with equivalent commands).

---

## How to run the project

You need **two terminals**: one for the API, one for the UI.

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

- Runs with **nodemon** + **ts-node** (see `package.json`).
- Listens on **`http://localhost:3000`** unless you set **`PORT`**.

One-off start without nodemon:

```bash
cd backend
npm start
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

- Opens the Vite dev server (default **http://localhost:5173**).
- Ensure **`frontend/src/config/apiConfig.ts`** matches your API origin (`http://localhost:3000` is the default used in this repo).

Open the printed URL in a browser, pick an account, edit settings, and save.

---

## Other commands

**Frontend**

```bash
cd frontend
npm run build    # TypeScript check + production bundle to dist/
npm run preview  # Serve the production build locally
npm run lint     # ESLint
```

**Backend**

```bash
cd backend
npx tsc          # Emit JavaScript to dist/ (if you add a build script)
```

---

## Configuration notes

- **`frontend/src/config/apiConfig.ts`** — Set the backend base URL so `fetch` targets the correct host in dev and deployment.
- **`frontend/vite.config.ts`** — `server.proxy` forwards **`/api`** to **`http://localhost:3000`**; useful if you change the client to call relative `/api/...` instead of an absolute base URL.
- **`backend/src/configs/defaultSettings.ts`** and **`frontend/src/config/settingsConfig.ts`** should stay **aligned** (same setting keys and compatible types) so the form and API agree.

---

## Troubleshooting

- **CORS / network errors** — Confirm the backend is running and that `apiConfig` matches its URL and port.
- **Empty accounts** — Check DB seeding and that `database.sqlite` is writable under `backend/`.
- **Form fields vs API** — If keys differ between frontend config and backend defaults, merge behavior may look wrong until both sides match.
