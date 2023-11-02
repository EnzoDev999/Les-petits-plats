export function updateRecipeCount(filteredRecipes, recipesCountElement) {
  const count = filteredRecipes.length;
  recipesCountElement.textContent = `${count} recettes`;
}
