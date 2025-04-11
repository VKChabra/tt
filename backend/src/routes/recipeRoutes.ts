import express from 'express';
import {
  getAllRecipes,
  getRecipeDetails,
  getCategories,
  getAreas,
  getIngredients
} from '../controllers/recipeController.js';

const router = express.Router();

// GET /api/recipes - Get all recipes with optional filtering
router.get('/', getAllRecipes);

// GET /api/recipes/categories - Get all meal categories
router.get('/categories', getCategories);

// GET /api/recipes/areas - Get all areas (countries)
router.get('/areas', getAreas);

// GET /api/recipes/ingredients - Get all ingredients
router.get('/ingredients', getIngredients);

// GET /api/recipes/:id - Get recipe details by ID
router.get('/:id', getRecipeDetails);

export default router;
