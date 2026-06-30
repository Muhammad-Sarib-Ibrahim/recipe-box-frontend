# Recipe Box — Frontend

A small Next.js frontend for [Recipe Box API](https://github.com/Muhammad-Sarib-Ibrahim/recipe-box-api), built to get comfortable with TypeScript and the App Router after working mostly in Python. Register, log in, and manage your own recipes — nothing fancy, just a clean example of a frontend talking to a real authenticated backend.

## Why I built it this way

The backend already existed as a tested API, so this was a chance to focus entirely on the frontend side of a flow I already understood from the API: register, log in, store the token, attach it to every request, handle the redirect logic when someone isn't logged in.

A couple of things worth pointing out:

- **The token lives in a React Context (`AuthProvider`), backed by `localStorage`.** Every page that needs to know "is someone logged in" reads from this one place instead of each page managing its own auth state.
- **API calls go through a single typed client (`lib/api.ts`)** rather than scattering `fetch` calls across every page. Each function mirrors one backend endpoint and returns a typed result, so a typo in a field name shows up as a TypeScript error instead of a runtime bug.
- **Protected pages check auth status after the initial load, not during it** — `localStorage` doesn't exist during server-side rendering, so the auth check has to happen client-side, after the page mounts. Getting the loading state right here (so logged-in users don't get bounced to the login page on every refresh) was one of the trickier parts of the App Router model coming from a typical Python web framework.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS.

## Running it locally

Make sure the [backend](https://github.com/Muhammad-Sarib-Ibrahim/recipe-box-api) is running first at `http://localhost:8000`.

```bash
git clone https://github.com/Muhammad-Sarib-Ibrahim/recipe-box-frontend.git
cd recipe-box-frontend
npm install
npm run dev
```

Open `http://localhost:3000`, register an account, and you'll land on your (empty) recipe list.

The backend URL is configurable in `.env.local`:
NEXT_PUBLIC_API_URL=http://localhost:8000

## How it's structured
app/
├── page.tsx                 # login / register
├── recipes/
│   ├── page.tsx                # list + create recipes (protected)
│   └── [id]/page.tsx             # view, edit, delete a single recipe (protected)
└── layout.tsx                    # wraps the app in AuthProvider + Navbar
lib/
├── api.ts                          # typed client for the backend API
└── auth-context.tsx                 # the JWT, login/logout, loading state
components/
└── Navbar.tsx

## A note on the auth approach

Storing the JWT in `localStorage` is the simplest option and fine for a project like this, but it's not what I'd reach for in production — an httpOnly cookie is more resistant to XSS, since `localStorage` is readable by any script running on the page. Worth mentioning since it's the kind of tradeoff that's easy to gloss over if you've only ever built the happy path.

## What I'd add next

Optimistic UI updates instead of waiting on every request, and probably a proper loading skeleton instead of the current plain-text "Loading…" state.
