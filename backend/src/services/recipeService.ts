import axios from 'axios';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const BASE_URL = process.env.RECIPE_API_BASE_URL;

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  [key: string]: string | undefined;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Area {
  strArea: string;
}

export interface Ingredient {
  idIngredient: string;
  strIngredient: string;
  strDescription: string | null;
  strType: string | null;
}

// Get recipes with optional filtering
export const getRecipes = async (filterType?: string, filterValue?: string): Promise<Recipe[]> => {
  try {
    let url = `${BASE_URL}/search.php?s=`;

    if (filterType && filterValue) {
      switch (filterType) {
        case 'ingredient':
          url = `${BASE_URL}/filter.php?i=${filterValue}`;
          break;
        case 'country':
          url = `${BASE_URL}/filter.php?a=${filterValue}`;
          break;
        case 'category':
          url = `${BASE_URL}/filter.php?c=${filterValue}`;
          break;
        default:
          break;
      }
    }

    const response = await axios.get(url);
    return response.data.meals || [];
  } catch (error) {
    logger.error('Error fetching recipes:', error);
    throw new Error('Failed to fetch recipes');
  }
};

// Get recipe details by ID
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const url = `${BASE_URL}/lookup.php?i=${id}`;
    const response = await axios.get(url);
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    logger.error('Error fetching recipe details:', error);
    throw new Error('Failed to fetch recipe details');
  }
};

// Get all meal categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const url = `${BASE_URL}/categories.php`;
    const response = await axios.get(url);
    return response.data.categories || [];
  } catch (error) {
    logger.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

// Get list of all areas (countries)
export const getAllAreas = async (): Promise<Area[]> => {
  try {
    const url = `${BASE_URL}/list.php?a=list`;
    const response = await axios.get(url);
    return response.data.meals || [];
  } catch (error) {
    logger.error('Error fetching areas:', error);
    throw new Error('Failed to fetch areas');
  }
};

// Get list of all ingredients
export const getAllIngredients = async (): Promise<Ingredient[]> => {
  try {
    const url = `${BASE_URL}/list.php?i=list`;
    const response = await axios.get(url);
    return response.data.meals || [];
  } catch (error) {
    logger.error('Error fetching ingredients:', error);
    throw new Error('Failed to fetch ingredients');
  }
};

// Helper function to get ingredient image URL
export const getIngredientImageUrl = (
  ingredient: string,
  size: 'small' | 'medium' | 'large' | 'default' = 'default'
): string => {
  const formattedIngredient = ingredient.replace(/\s+/g, '_').toLowerCase();

  if (size === 'default') {
    return `https://www.themealdb.com/images/ingredients/${formattedIngredient}.png`;
  }

  return `https://www.themealdb.com/images/ingredients/${formattedIngredient}-${size}.png`;
};

// Helper function to get meal thumbnail with size
export const getMealThumbnailUrl = (
  imageUrl: string,
  size: 'small' | 'medium' | 'large' | null = null
): string => {
  if (!size) return imageUrl;

  // Extract the base part of the URL before any potential /preview
  const baseUrl = imageUrl.replace(/\/preview$/, '');
  return `${baseUrl}/${size}`;
};
