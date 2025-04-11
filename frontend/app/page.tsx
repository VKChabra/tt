"use client";

import React, { useEffect, useState } from "react";
import { getRecipes } from "@/services/api";
import RecipeGrid from "@/components/RecipeGrid";
import Loading from "@/components/Loading";
import type { Recipe } from "@/services/api";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const title = "All Recipes";

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const data = await getRecipes();
      setRecipes(data);
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <RecipeGrid recipes={recipes} title={title} />;
}
