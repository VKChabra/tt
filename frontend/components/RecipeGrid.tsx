import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import RecipeCard from './RecipeCard';
import { Recipe } from '@/services/api';
import styles from './RecipeGrid.module.css';

interface RecipeGridProps {
  recipes: Recipe[];
  title: string;
}

const RECIPES_PER_PAGE = 12;

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, title }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedRecipes, setPaginatedRecipes] = useState<Recipe[]>([]);

  const pageCount = Math.ceil(recipes.length / RECIPES_PER_PAGE);

  useEffect(() => {
    const startIndex = currentPage * RECIPES_PER_PAGE;
    const endIndex = startIndex + RECIPES_PER_PAGE;
    setPaginatedRecipes(recipes.slice(startIndex, endIndex));
  }, [recipes, currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [recipes]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      {recipes.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No recipes found</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {paginatedRecipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>

          {pageCount > 1 && (
            <div className={styles.paginationContainer}>
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                pageClassName={styles.pageItem}
                pageLinkClassName={styles.pageLink}
                previousClassName={styles.pageItem}
                previousLinkClassName={styles.pageLink}
                nextClassName={styles.pageItem}
                nextLinkClassName={styles.pageLink}
                breakClassName={styles.pageItem}
                breakLinkClassName={styles.pageLink}
                forcePage={currentPage}
              />

              <div className={styles.recipeCount}>
                Showing {paginatedRecipes.length} of {recipes.length} recipes
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecipeGrid;
