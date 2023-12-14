import data from "../data/recipes.js";
import { createDropdown } from "../components/dropDown.js";
import { displayRecipe } from "../components/recipeCard.js";
import { openCloseDropdown } from "../utils/dropdownEvent.js";
import { updateRecipeCount } from "../utils/recipeCountUpdater.js";
import "../components/mainSearchBar.js";

export const recipes = data.recipes;

let activeFilters = {
  ingredients: [],
  appareils: [],
  ustensiles: [],
};

const recipesCountElement = document.createElement("p");
recipesCountElement.classList.add("recipes_count");

document.addEventListener("DOMContentLoaded", function () {
  const cardSection = document.querySelector(".card_section");

  // Ajout du conteneur dropdown au DOM
  const filterSection = document.querySelector(".filter_section");
  const dropdownContainer = createDropdown();
  filterSection.appendChild(dropdownContainer);

  // Affichage des recettes initiales
  for (let recipe of recipes) {
    displayRecipe(recipe, cardSection);
  }

  filterSection.appendChild(recipesCountElement);

  // Mettez à jour le compteur de recettes lors de l'initialisation
  updateRecipeCount(recipes.length, recipesCountElement);

  openCloseDropdown();
});

export { activeFilters, recipesCountElement };
