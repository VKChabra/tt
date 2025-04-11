import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/services/api';
import styles from './RecipeCard.module.css';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Link href={`/recipe/${recipe.idMeal}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {recipe.strMealThumb && (
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{recipe.strMeal}</h3>
        {recipe.strCategory && <p className={styles.meta}>Category: {recipe.strCategory}</p>}
        {recipe.strArea && <p className={styles.meta}>Cuisine: {recipe.strArea}</p>}
      </div>
    </Link>
  );
};

export default RecipeCard;
