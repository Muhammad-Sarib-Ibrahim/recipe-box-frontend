"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { listRecipes, createRecipe, Recipe, ApiError } from "@/lib/api";

export default function RecipesPage() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Wait for the auth check to finish before deciding whether to redirect —
  // otherwise every logged-in user gets briefly bounced to "/" on refresh,
  // because `token` starts as null until localStorage has been read.
  useEffect(() => {
    if (!isAuthLoading && !token) {
      router.push("/");
    }
  }, [isAuthLoading, token, router]);

  useEffect(() => {
    if (!token) return;
    listRecipes(token)
      .then(setRecipes)
      .catch(() => setError("Could not load recipes."))
      .finally(() => setIsLoading(false));
  }, [token]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setIsCreating(true);
    setError(null);
    try {
      const newRecipe = await createRecipe(token, {
        title,
        ingredients,
        instructions,
      });
      setRecipes((prev) => [...prev, newRecipe]);
      setTitle("");
      setIngredients("");
      setInstructions("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save the recipe.");
    } finally {
      setIsCreating(false);
    }
  }

  if (isAuthLoading || !token) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-serif text-3xl text-stone-900">My recipes</h1>

      <form
        onSubmit={handleCreate}
        className="mt-8 flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-5"
      >
        <h2 className="font-serif text-lg text-stone-800">Add a recipe</h2>
        <input
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
        />
        <input
          placeholder="Ingredients (comma separated)"
          required
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
        />
        <textarea
          placeholder="Instructions"
          required
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isCreating}
          className="self-start rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {isCreating ? "Saving…" : "Save recipe"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-stone-500">Loading recipes…</p>
        ) : recipes.length === 0 ? (
          <p className="text-sm text-stone-500">
            No recipes yet — add your first one above.
          </p>
        ) : (
          recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400"
            >
              <h3 className="font-serif text-lg text-stone-900">{recipe.title}</h3>
              <p className="mt-1 truncate text-sm text-stone-500">
                {recipe.ingredients}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
