// Fichier main.js
import data from "../data/recipes.js";
import { createDropdown } from "../components/dropDown.js";
import { displayRecipe } from "../components/recipeCard.js";
import { openCloseDropdown } from "../utils/dropdownEvent.js";
import { updateRecipesWithFilter } from "../utils/recipeFilter.js";

const recipes = data.recipes;

let activeFilters = {
  ingredients: [],
  appareils: [],
  ustensiles: [],
};

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

  const recipesCountElement = document.createElement("p");
  recipesCountElement.classList.add(".recipes_count");

  filterSection.appendChild(recipesCountElement);
  // Mise à jour du nombre de recettes
  recipesCountElement.textContent = `${recipes.length} recettes`;

  openCloseDropdown();
});

export { activeFilters };
