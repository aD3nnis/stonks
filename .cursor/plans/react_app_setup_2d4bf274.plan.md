---
name: React app setup
overview: Recommend using Vite to create the React app inside a `client` folder, with exact commands and why to prefer Vite over Create React App for this monorepo.
todos: []
isProject: false
---

# How to Create the React App in This Project

## Recommendation: Use Vite in a `client` folder

**Use Vite, not Create React App.** Create React App is in maintenance mode; the React team and ecosystem have shifted toward Vite for new projects. Vite gives you faster dev server and HMR, smaller builds, and modern tooling out of the box. Netlify deploys Vite apps with no extra config.

**Keep the app in a dedicated `client` folder** so the repo stays a clean monorepo: `client/` (React) and `server/` (Express) at the repo root, as in your brief.

---

## Option A — Let Vite create the folder (simplest)

From the **repo root** (`stonks/`):

```bash
npm create vite@latest client -- --template react
cd client
npm install
```

This creates a new directory `client/` with a full Vite + React app (package.json, index.html, src/, public/, etc.). You do not need to create `client` yourself.

---

## Option B — Create the folder first, then init

If you prefer to create the folder yourself:

```bash
mkdir client
cd client
npm create vite@latest . -- --template react
npm install
```

The `.` tells Vite to use the current directory. Result is the same as Option A.

---

## After creation

- **Run the dev server:** From `client/`, run `npm run dev`. Vite typically serves the app at `http://localhost:5173`.
- **Proxy to the backend (Phase 1):** When you add the Express server, you’ll want the React app to call the API without CORS issues. In the Vite app, add a proxy in [client/vite.config.js](client/vite.config.js) (e.g. `server.proxy: { '/api': 'http://localhost:3000' }`) so requests to `/api/hello` go to Express. You can add this when you implement the “hello world” fetch in Phase 1.
- **Netlify:** Build command `npm run build`, publish directory `dist`. No extra setup needed for Vite.

---

## Summary


| Your brief said                                                            | Recommendation                                                     |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `npx create-react-app .` or `npm create vite@latest . -- --template react` | Use **Vite** only.                                                 |
| Two folders: `/client` and `/server`                                       | Create the React app **inside `client/`** via Option A or B above. |


Use **Option A** unless you have a reason to create `client/` manually first.