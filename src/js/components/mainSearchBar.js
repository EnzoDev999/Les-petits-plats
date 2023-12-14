import { displayRecipe } from "./recipeCard.js";
import { updateRecipeCount } from "../utils/recipeCountUpdater.js";
import { updateDropdownList } from "./dropDown.js";
import { recipesCountElement } from "../pages/main.js";
import { getFilteredItems } from "./dropDown.js";
import { getFilteredRecipes } from "../utils/recipeFilter.js"; // Assurez-vous que cette importation est correcte
import { refreshDropdowns } from "./dropDown.js";

export function updateUI(filteredRecipes) {
  const cardSection = document.querySelector(".card_section");
  cardSection.innerHTML = ""; // Vide la section des cartes

  if (filteredRecipes.length > 0) {
    filteredRecipes.forEach((recipe) => {
      displayRecipe(recipe, cardSection);
    });
    updateRecipeCount(filteredRecipes.length, recipesCountElement); // Passer le nombre de recettes
  } else {
    cardSection.innerHTML =
      "<p>Aucune recette ne correspond à votre recherche.</p>";
    updateRecipeCount(0, recipesCountElement); // Passer zéro si aucune recette n'est trouvée
  }
}

// Fonction pour rechercher les recettes en fonction du texte
export function searchRecipesByText(searchText) {
  const filtered = getFilteredRecipes(searchText);

  if (!Array.isArray(filtered)) {
    console.error("Le résultat de getFilteredRecipes doit être un tableau");
    return []; // Retournez un tableau vide pour éviter des erreurs plus loin dans le code
  }

  return filtered;
}

// Événement d'entrée pour la barre de recherche principale
const mainSearchBar = document.getElementById("search-recipe");

// À l'intérieur de votre gestionnaire d'événements 'input' pour la barre de recherche
mainSearchBar.addEventListener("input", (event) => {
  const searchText = event.target.value.trim();

  if (searchText.length >= 3 || searchText.length === 0) {
    const filteredRecipes = searchRecipesByText(searchText);

    if (Array.isArray(filteredRecipes)) {
      updateUI(filteredRecipes);
      refreshDropdowns(filteredRecipes);
    }
  }
});
