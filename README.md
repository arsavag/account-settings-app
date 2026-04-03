# Account Settings App

**Run:** Node.js + npm. Start the API first, then the UI (two terminals).

```bash
cd backend && npm install && npm run dev
```

API: **http://localhost:3000**

```bash
cd frontend && npm install && npm run dev
```

Open the URL Vite prints (e.g. **http://localhost:5173**).

**Add / change form fields:** edit **`frontend/src/config/settingsConfig.ts`**. Keep keys and defaults in sync with **`backend/src/configs/defaultSettings.ts`** so the API merge matches the UI.
