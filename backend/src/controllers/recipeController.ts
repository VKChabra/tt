import { Request, Response } from 'express';
import {
  getRecipes,
  getRecipeById,
  getAllCategories,
  getAllAreas,
  getAllIngredients,
  getIngredientImageUrl,
  getMealThumbnailUrl
} from '../services/recipeService.js';
import logger from '../utils/logger.js';

// Define interfaces for our controller
interface IngredientImage {
  name: string;
  measure: string;
  imageUrl: string;
  smallImageUrl: string;
  mediumImageUrl: string;
  largeImageUrl: string;
}

interface Thumbnails {
  default: string;
  small: string;
  medium: string;
  large: string;
}

interface ProcessedRecipe {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  ingredientImages: Record<string, IngredientImage>;
  thumbnails?: Thumbnails;
  [key: string]: string | Record<string, IngredientImage> | Thumbnails | undefined;
}

// Get all recipes with optional filtering
export const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filterType, filterValue } = req.query;

    const recipes = await getRecipes(filterType as string, filterValue as string);

    res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    logger.error('Controller error fetching recipes:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get recipe details by ID
export const getRecipeDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: 'Recipe ID is required' });
      return;
    }

    const recipe = await getRecipeById(id);

    if (!recipe) {
      res.status(404).json({ success: false, message: 'Recipe not found' });
      return;
    }

    // Create a new object with recipe properties
    const processedRecipe: ProcessedRecipe = {
      ...recipe,
      ingredientImages: {}
    };

    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== '') {
        processedRecipe.ingredientImages[ingredient] = {
          name: ingredient,
          measure: measure || '',
          imageUrl: getIngredientImageUrl(ingredient),
          smallImageUrl: getIngredientImageUrl(ingredient, 'small'),
          mediumImageUrl: getIngredientImageUrl(ingredient, 'medium'),
          largeImageUrl: getIngredientImageUrl(ingredient, 'large')
        };
      }
    }

    // Add thumbnail variations if strMealThumb exists
    if (recipe.strMealThumb) {
      processedRecipe.thumbnails = {
        default: recipe.strMealThumb,
        small: getMealThumbnailUrl(recipe.strMealThumb, 'small'),
        medium: getMealThumbnailUrl(recipe.strMealThumb, 'medium'),
        large: getMealThumbnailUrl(recipe.strMealThumb, 'large')
      };
    }

    res.status(200).json({ success: true, data: processedRecipe });
  } catch (error) {
    logger.error('Controller error fetching recipe details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all meal categories
export const getCategories = async (_: Request, res: Response): Promise<void> => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    logger.error('Controller error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all areas (countries)
export const getAreas = async (_: Request, res: Response): Promise<void> => {
  try {
    const areas = await getAllAreas();
    res.status(200).json({ success: true, data: areas });
  } catch (error) {
    logger.error('Controller error fetching areas:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all ingredients
export const getIngredients = async (_: Request, res: Response): Promise<void> => {
  try {
    const ingredients = await getAllIngredients();
    res.status(200).json({ success: true, data: ingredients });
  } catch (error) {
    logger.error('Controller error fetching ingredients:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
