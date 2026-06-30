# Recipe Box API

A small REST API for managing personal recipes — built with FastAPI as a way to get hands-on with backend fundamentals: authentication, ORM modeling, and writing an API that's actually safe to use, not just functional.

Users register, log in, and get a JWT token that lets them create, read, update, and delete their own recipes. Other people's recipes are completely inaccessible — not just hidden in the UI, but unreachable at the API level even if you know the exact ID.

**Live counterpart:** this pairs with a [Next.js frontend](https://github.com/Muhammad-Sarib-Ibrahim/recipe-box-frontend) that talks to this API.

## Why I built it this way

I wanted something small enough to finish quickly but that still touched the parts of backend development that actually come up in real jobs: hashing passwords properly, issuing and verifying JWTs, separating what the database stores from what the API exposes, and writing tests that prove the security model works rather than just asserting status codes.

A few decisions I made on purpose, worth mentioning if it comes up:

- **Ownership checks return 404, not 403.** If you try to access someone else's recipe by ID, the API says "not found" rather than "forbidden" — so it never confirms that a recipe with that ID exists at all.
- **API request/response shapes are separate from the database models.** The database stores a hashed password; the API response for a user never includes it, because the response is built from a different schema entirely, not the raw database object.
- **`ingredients` is a plain string, not a normalized table.** A fully relational ingredients model felt like more complexity than this project needed to prove its point, so I kept it simple on purpose.

## Stack

FastAPI, SQLModel (SQLAlchemy + Pydantic) over SQLite, bcrypt for password hashing, python-jose for JWTs, pytest for tests.

## Running it locally

```bash
git clone https://github.com/Muhammad-Sarib-Ibrahim/recipe-box-api.git
cd recipe-box-api
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Then open `http://localhost:8000/docs` — that's FastAPI's auto-generated Swagger UI. You can register, log in, copy the token it gives you into the "Authorize" button, and try every endpoint right from the browser.

Run the tests with:

```bash
pytest tests/ -v
```

## How it's structured
