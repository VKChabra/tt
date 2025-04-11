// API service for making requests to the backend
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Flag to track if we've already shown the backend error toast
let hasShownBackendError = false;

// Helper function to show backend connection error
const showBackendConnectionError = () => {
  if (!hasShownBackendError) {
    toast.error(
      "Backend server not detected. Please follow the instructions in README.md to start both frontend and backend servers.",
      {
        duration: 10000,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#f44336",
          color: "#fff",
        },
      }
    );
    hasShownBackendError = true;
  }
};

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  thumbnails?: {
    default: string;
    small: string;
    medium: string;
    large: string;
  };
  ingredientImages?: Record<
    string,
    {
      name: string;
      measure: string;
      imageUrl: string;
      smallImageUrl: string;
      mediumImageUrl: string;
      largeImageUrl: string;
    }
  >;
  [key: string]:
    | string
    | string[]
    | undefined
    | {
        default: string;
        small: string;
        medium: string;
        large: string;
      }
    | Record<
        string,
        {
          name: string;
          measure: string;
          imageUrl: string;
          smallImageUrl: string;
          mediumImageUrl: string;
          largeImageUrl: string;
        }
      >;
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

// Get all recipes with optional filtering
export const getRecipes = async (
  filterType?: string,
  filterValue?: string
): Promise<Recipe[]> => {
  try {
    const queryParams =
      filterType && filterValue
        ? `?filterType=${filterType}&filterValue=${filterValue}`
        : "";

    const response = await fetch(`${API_URL}/recipes${queryParams}`);

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    showBackendConnectionError();
    return [];
  }
};

// Get recipe details by ID
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await fetch(`${API_URL}/recipes/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch recipe details");
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    showBackendConnectionError();
    return null;
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/recipes/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    showBackendConnectionError();
    return [];
  }
};

// Get all areas (countries)
export const getAreas = async (): Promise<Area[]> => {
  try {
    const response = await fetch(`${API_URL}/recipes/areas`);

    if (!response.ok) {
      throw new Error("Failed to fetch areas");
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching areas:", error);
    showBackendConnectionError();
    return [];
  }
};

// Get all ingredients
export const getIngredients = async (): Promise<Ingredient[]> => {
  try {
    const response = await fetch(`${API_URL}/recipes/ingredients`);

    if (!response.ok) {
      throw new Error("Failed to fetch ingredients");
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    showBackendConnectionError();
    return [];
  }
};
