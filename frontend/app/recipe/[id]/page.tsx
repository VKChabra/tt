'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeById, getRecipes } from '@/services/api';
import Loading from '@/components/Loading';
import RecipeCard from '@/components/RecipeCard';
import type { Recipe } from '@/services/api';
import styles from './page.module.css';

export default function RecipeDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipeData = async () => {
      setLoading(true);

      const recipeData = await getRecipeById(id);
      setRecipe(recipeData);

      if (recipeData?.strCategory) {
        const categoryRecipes = await getRecipes('category', recipeData.strCategory);
        // Filter out the current recipe
        const filtered = categoryRecipes.filter((r) => r.idMeal !== id);
        setRelatedRecipes(filtered);
      }

      setLoading(false);
    };

    if (id) {
      fetchRecipeData();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!recipe) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>Recipe not found</h1>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          Back to Home
        </button>
      </div>
    );
  }

  // Extract ingredients and measures
  const ingredients: { name: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient && typeof ingredient === 'string' && ingredient.trim() !== '') {
      ingredients.push({
        name: ingredient,
        measure: typeof measure === 'string' ? measure : ''
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Main content */}
        <div className={styles.mainContent}>
          <div className={styles.recipeHeader}>
            {/* Recipe image */}
            <div className={styles.imageContainer}>
              {recipe.strMealThumb && (
                <div className={styles.recipeImage}>
                  <Image
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            {/* Recipe details */}
            <div className={styles.recipeDetails}>
              <h1 className={styles.recipeTitle}>{recipe.strMeal}</h1>

              {recipe.strArea && (
                <Link href={`/recipes/country/${recipe.strArea}`} className={styles.cuisineLink}>
                  Cuisine: {recipe.strArea}
                </Link>
              )}

              <h2 className={styles.ingredientsTitle}>Ingredients:</h2>
              <ul className={styles.ingredientsList}>
                {ingredients.map((item, index) => (
                  <li key={index} className={styles.ingredientItem}>
                    <Link
                      href={`/recipes/ingredient/${item.name.replace(' ', '_')}`}
                      className={styles.ingredientLink}
                    >
                      {item.name}
                    </Link>
                    <span className={styles.measure}>({item.measure})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className={styles.instructionsSection}>
            <h2 className={styles.instructionsTitle}>Instructions</h2>
            <div>
              {recipe.strInstructions?.split('\r\n').map((paragraph, index) =>
                paragraph.trim() ? (
                  <p key={index} className={styles.instructionsParagraph}>
                    {paragraph}
                  </p>
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Related recipes */}
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>
            {recipe.strCategory && (
              <Link
                href={`/recipes/category/${recipe.strCategory}`}
                className={styles.categoryLink}
              >
                More {recipe.strCategory} Recipes
              </Link>
            )}
          </h2>

          <div className={styles.relatedRecipes}>
            {relatedRecipes.slice(0, 5).map((relatedRecipe) => (
              <RecipeCard key={relatedRecipe.idMeal} recipe={relatedRecipe} />
            ))}

            {relatedRecipes.length === 0 && (
              <p className={styles.noRelated}>No related recipes found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
