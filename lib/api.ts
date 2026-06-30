const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// These mirror the Pydantic schemas in the backend's schemas.py.
// Keeping the shapes in sync by hand is a tradeoff of small projects —
// in a bigger app you'd generate these types from the OpenAPI schema.
export type Recipe = {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  created_at: string;
  owner_id: number;
};

export type RecipeInput = {
  title: string;
  ingredients: string;
  instructions: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

// A small custom error so the UI can show the backend's actual message
// (e.g. "Incorrect email or password") instead of a generic failure.
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.detail ?? "Something went wrong", response.status);
  }

  // 204 No Content (DELETE) has no body to parse
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function register(email: string, password: string) {
  return request<{ id: number; email: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export function listRecipes(token: string) {
  return request<Recipe[]>("/recipes", { headers: authHeaders(token) });
}

export function getRecipe(token: string, id: number) {
  return request<Recipe>(`/recipes/${id}`, { headers: authHeaders(token) });
}

export function createRecipe(token: string, data: RecipeInput) {
  return request<Recipe>("/recipes", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function updateRecipe(
  token: string,
  id: number,
  data: Partial<RecipeInput>
) {
  return request<Recipe>(`/recipes/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function deleteRecipe(token: string, id: number) {
  return request<void>(`/recipes/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
