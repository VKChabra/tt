import { Request, Response } from "express";
import {
  getRecipes,
  getRecipeById,
  getAllCategories,
  getAllAreas,
  getAllIngredients,
  getIngredientImageUrl,
  getMealThumbnailUrl,
} from "../services/recipeService";

// Get all recipes with optional filtering
export const getAllRecipes = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { filterType, filterValue } = req.query;

    const recipes = await getRecipes(
      filterType as string,
      filterValue as string
    );

    res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get recipe details by ID
export const getRecipeDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Recipe ID is required" });
    }

    const recipe = await getRecipeById(id);

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // Process recipe to add formatted ingredient images if needed
    const processedRecipe = {
      ...recipe,
      ingredientImages: {},
    };

    // Extract ingredients and their measures
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        (processedRecipe.ingredientImages as Record<string, any>)[ingredient] =
          {
            name: ingredient,
            measure: measure || "",
            imageUrl: getIngredientImageUrl(ingredient),
            smallImageUrl: getIngredientImageUrl(ingredient, "small"),
            mediumImageUrl: getIngredientImageUrl(ingredient, "medium"),
            largeImageUrl: getIngredientImageUrl(ingredient, "large"),
          };
      }
    }

    // Add thumbnail variations if strMealThumb exists
    if (recipe.strMealThumb) {
      (processedRecipe as any).thumbnails = {
        default: recipe.strMealThumb,
        small: getMealThumbnailUrl(recipe.strMealThumb, "small"),
        medium: getMealThumbnailUrl(recipe.strMealThumb, "medium"),
        large: getMealThumbnailUrl(recipe.strMealThumb, "large"),
      };
    }

    res.status(200).json({ success: true, data: processedRecipe });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all meal categories
export const getCategories = async (
  _: Request,
  res: Response
): Promise<any> => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all areas (countries)
export const getAreas = async (_: Request, res: Response): Promise<any> => {
  try {
    const areas = await getAllAreas();
    res.status(200).json({ success: true, data: areas });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all ingredients
export const getIngredients = async (
  _: Request,
  res: Response
): Promise<any> => {
  try {
    const ingredients = await getAllIngredients();
    res.status(200).json({ success: true, data: ingredients });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
