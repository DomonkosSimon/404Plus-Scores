# 404+ Scores

An offline-first Progressive Web App for scoring working equitation (or any
multi-competitor, multi-discipline) competitions on site. Built with React,
TypeScript, and MUI; deployed to Firebase Hosting with Firestore for a
shared, synced competition history. Built by 404plus s.r.o.

## Features

- Step-by-step wizard: competition name → number of competitors → competitor
  names → number of disciplines/rounds → discipline names.
- Drag-to-reorder competitors and free-form score entry per competitor per
  discipline.
- Automatic ranking on "Finish" — highest or lowest total wins, configurable
  in Settings (default: highest).
- Works fully offline: wizard, scoring, and results never require a network
  connection. Only *syncing a finished competition to shared history*
  requires internet; if you're offline at that point you're prompted to
  connect, and your result is kept safely on the device either way (never
  silently lost) until you sync it from the History screen.
- Slovak (default), Czech, English, and German UI, switchable in Settings.
- Installable as a PWA (Add to Home Screen) with a service worker for
  offline app-shell caching.

## Getting started

```bash
pnpm install
pnpm dev
```

### Available scripts

- `pnpm dev` — start the dev server
- `pnpm build` — typecheck and production build
- `pnpm typecheck` — `tsc -b` only
- `pnpm test` / `pnpm test:watch` — run unit tests (Vitest)
- `pnpm lint` — oxlint
- `pnpm format` — Prettier write

## Cloud sync setup (optional for local development)

Without Firebase configured, the app works completely — scoring and results
function normally, and finished competitions are simply kept on-device
under "Pending sync" in History instead of being pushed to the cloud.

To enable cloud history sync:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com),
   enabling **Firestore** and **Hosting**, and enabling **Anonymous**
   sign-in under Authentication (used only to satisfy Firestore security
   rules — there is no login UI, and no personal data is ever collected).
2. Copy `.env.example` to `.env.local` and fill in the values from
   Project settings → General → Your apps → SDK setup and configuration.
3. Deploy security rules once you have the Firebase CLI logged in locally:
   `npx firebase-tools deploy --only firestore:rules`.

Firestore data model and rules live in [`firestore.rules`](./firestore.rules)
— the `competitions` collection is append-only from the client (no update or
delete), gated on anonymous auth to block unauthenticated abuse while
keeping the history itself globally readable, matching the app's
shared/global history design.

## Deployment (CI/CD)

- [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs lint,
  typecheck, tests, and build on every pull request into `main`.
- [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) builds and
  deploys to Firebase Hosting (plus Firestore rules) on every push to `main`.

To wire up deployment:

1. Fill in your Firebase project id in [`.firebaserc`](./.firebaserc).
2. In the Firebase console, generate a service account key (Project settings
   → Service accounts → Generate new private key).
3. In the GitHub repo settings, add it as a secret named
   `FIREBASE_SERVICE_ACCOUNT` (paste the full JSON key contents).
4. Push to `main` — the workflow deploys automatically.

## Tech stack

- React 19 + TypeScript + Vite
- MUI (Material UI) for all components
- React Router for navigation
- Zustand for active-competition and settings state (persisted to
  `localStorage` for settings)
- Dexie (IndexedDB) for local competition storage and the pending-sync queue
- Firebase (Firestore + Anonymous Auth) for the shared cloud history
- react-i18next for sk/cs/en/de translations
- vite-plugin-pwa (Workbox) for the offline app shell and installability
- Vitest + Testing Library for unit tests, focused on the scoring/ranking
  logic in [`src/domain/scoring.ts`](./src/domain/scoring.ts)

## Project structure

See [`src/domain`](./src/domain) for the framework-free scoring/ranking
logic, [`src/storage`](./src/storage) for the Dexie-backed local repository,
and [`src/sync`](./src/sync) for the Firebase sync service — these three are
the core of the app and are the most useful starting points for
understanding or extending it.
