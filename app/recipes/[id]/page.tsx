"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getRecipe, updateRecipe, deleteRecipe, Recipe, ApiError } from "@/lib/api";

export default function RecipeDetailPage() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const recipeId = Number(params.id);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !token) {
      router.push("/");
    }
  }, [isAuthLoading, token, router]);

  useEffect(() => {
    if (!token) return;
    getRecipe(token, recipeId)
      .then((data) => {
        setRecipe(data);
        setTitle(data.title);
        setIngredients(data.ingredients);
        setInstructions(data.instructions);
      })
      .catch((err) =>
        setError(
          err instanceof ApiError && err.status === 404
            ? "Recipe not found."
            : "Could not load this recipe."
        )
      )
      .finally(() => setIsLoading(false));
  }, [token, recipeId]);

  async function handleSave() {
    if (!token) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateRecipe(token, recipeId, {
        title,
        ingredients,
        instructions,
      });
      setRecipe(updated);
      setIsEditing(false);
    } catch {
      setError("Could not save your changes.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!token) return;
    if (!confirm("Delete this recipe? This can't be undone.")) return;
    try {
      await deleteRecipe(token, recipeId);
      router.push("/recipes");
    } catch {
      setError("Could not delete this recipe.");
    }
  }

  if (isAuthLoading || !token || isLoading) {
    return <p className="mx-auto max-w-2xl px-6 py-12 text-sm text-stone-500">Loading…</p>;
  }

  if (error && !recipe) {
    return <p className="mx-auto max-w-2xl px-6 py-12 text-sm text-red-600">{error}</p>;
  }

  if (!recipe) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2 text-lg font-serif focus:border-stone-500 focus:outline-none"
          />
          <input
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
          <textarea
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="font-serif text-3xl text-stone-900">{recipe.title}</h1>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Ingredients
          </h2>
          <p className="mt-1 text-stone-700">{recipe.ingredients}</p>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Instructions
          </h2>
          <p className="mt-1 whitespace-pre-wrap text-stone-700">{recipe.instructions}</p>

          <div className="mt-8 flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
