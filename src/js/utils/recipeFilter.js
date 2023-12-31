import { activeFilters } from "../pages/main.js";
import data from "../data/recipes.js";
import { displayRecipe } from "../components/recipeCard.js";
import { updateDropdownList } from "../components/dropDown.js";
import { updateRecipeCount } from "../utils/recipeCountUpdater.js";

const recipes = data.recipes;

export function updateRecipesWithFilter(category, filterValue) {
  // Met à jour l'objet activeFilters avec la nouvelle valeur de filtre
  if (filterValue) {
    activeFilters[category].push(filterValue.toLowerCase());
  }

  const cardSection = document.querySelector(".card_section");
  cardSection.innerHTML = ""; // efface les recettes précédentes

  // Filtrer les recettes en fonction des filtres actifs
  const filteredRecipes = getFilteredRecipes();

  filteredRecipes.forEach((recipe) => {
    displayRecipe(recipe, cardSection);
  });

  // Mise à jour du compteur de recettes
  const recipesCountElement = document.querySelector(".recipes_count");
  updateRecipeCount(filteredRecipes.length, recipesCountElement);

  // Met à jour les menus déroulants après la mise à jour des recettes
  ["ingredients", "appareils", "ustensiles"].forEach(updateDropdownList);
}

export function getFilteredRecipes(searchText = "") {
  const lowerCaseSearchText = searchText.toLowerCase();

  const filtered = recipes.filter((recipe) => {
    // Vérifie d'abord si la recette correspond à la recherche textuelle
    if (
      searchText &&
      !recipe.name.toLowerCase().includes(lowerCaseSearchText) &&
      !recipe.description.toLowerCase().includes(lowerCaseSearchText) &&
      !recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(lowerCaseSearchText)
      )
    ) {
      return false;
    }

    // Puis filtre par les filtres actifs
    return Object.keys(activeFilters).every((key) => {
      if (activeFilters[key].length === 0) return true;

      switch (key) {
        case "ingredients":
          return activeFilters[key].every((filter) =>
            recipe.ingredients.some(
              (ing) => ing.ingredient.toLowerCase() === filter
            )
          );
        case "appareils":
          return activeFilters[key].every(
            (filter) => recipe.appliance.toLowerCase() === filter
          );
        case "ustensiles":
          return activeFilters[key].every((filter) =>
            recipe.ustensiles.some((ust) => ust.toLowerCase() === filter)
          );
        default:
          return true;
      }
    });
  });
  return filtered;
}
