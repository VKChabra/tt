"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRecipes } from "@/services/api";
import RecipeGrid from "@/components/RecipeGrid";
import Loading from "@/components/Loading";
import type { Recipe } from "@/services/api";

export default function FilteredRecipes() {
  const params = useParams();
  const filterType = params.type as string;
  const filterValue = params.value as string;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("Filtered Recipes");

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);

      let displayTitle = "Recipes";

      switch (filterType) {
        case "ingredient":
          displayTitle = `Recipes with ${filterValue.replace("_", " ")}`;
          break;
        case "country":
          displayTitle = `${filterValue} Recipes`;
          break;
        case "category":
          displayTitle = `${filterValue} Recipes`;
          break;
        default:
          displayTitle = "Filtered Recipes";
      }

      setTitle(displayTitle);

      const data = await getRecipes(filterType, filterValue);
      setRecipes(data);
      setLoading(false);
    };

    if (filterType && filterValue) {
      fetchRecipes();
    }
  }, [filterType, filterValue]);

  if (loading) {
    return <Loading />;
  }

  return <RecipeGrid recipes={recipes} title={title} />;
}
