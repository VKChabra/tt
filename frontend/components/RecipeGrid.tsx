import React from "react";
import RecipeCard from "./RecipeCard";
import { Recipe } from "@/services/api";
import styles from "./RecipeGrid.module.css";

interface RecipeGridProps {
  recipes: Recipe[];
  title: string;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, title }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      {recipes.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No recipes found</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;
