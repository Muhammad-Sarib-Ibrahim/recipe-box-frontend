# Recipe Box — Frontend

A small Next.js (App Router + TypeScript) frontend for the Recipe Box API.
Register, log in, and manage your own recipes — talks to the FastAPI backend over a JWT-authenticated REST API.

## Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- React Context for auth state (JWT stored in `localStorage`)

## Setup

Make sure the backend (recipe-api) is running first at `http://localhost:8000`.

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Register an account, log in, and you'll land on `/recipes`
where you can add, edit, and delete your own recipes.

The API URL is configurable via `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project structure

```
app/
├── page.tsx                # Login / register
├── recipes/
│   ├── page.tsx              # List + create recipes (protected)
│   └── [id]/page.tsx          # View, edit, delete a single recipe (protected)
└── layout.tsx                 # Wraps the app in AuthProvider + Navbar
lib/
├── api.ts                     # Typed fetch wrapper for the backend API
└── auth-context.tsx            # React Context for the JWT + login/logout
components/
└── Navbar.tsx
```

## How auth works here

On login, the backend returns a JWT. The frontend stores it in `localStorage` via
`AuthProvider` (`lib/auth-context.tsx`) and attaches it as an `Authorization: Bearer <token>`
header on every request to a protected endpoint (see `lib/api.ts`). Protected pages
(`/recipes`, `/recipes/[id]`) check for a token on mount and redirect to `/` if missing.

## Notes

- This is a learning/portfolio project — `localStorage` for token storage is simple and fine
  here, but a production app would likely use an httpOnly cookie to reduce XSS exposure.
- CORS must be enabled on the backend for this to work — see `app/main.py` in the backend repo.
