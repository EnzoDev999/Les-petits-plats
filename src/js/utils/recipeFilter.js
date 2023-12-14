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
  let filteredRecipes = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    let matchesSearchText = false;
    let matchesFilters = true;

    // Vérifier si la recette correspond à la recherche textuelle
    if (searchText) {
      matchesSearchText =
        recipe.name.toLowerCase().includes(lowerCaseSearchText) ||
        recipe.description.toLowerCase().includes(lowerCaseSearchText);

      for (
        let j = 0;
        j < recipe.ingredients.length && !matchesSearchText;
        j++
      ) {
        if (
          recipe.ingredients[j].ingredient
            .toLowerCase()
            .includes(lowerCaseSearchText)
        ) {
          matchesSearchText = true;
        }
      }
    } else {
      matchesSearchText = true; // Si aucun texte de recherche, considérer que cela correspond
    }

    // Filtrez par les filtres actifs
    for (let key in activeFilters) {
      if (matchesFilters && activeFilters[key].length > 0) {
        let filterMatch = false;

        switch (key) {
          case "ingredients":
            for (
              let j = 0;
              j < recipe.ingredients.length && !filterMatch;
              j++
            ) {
              for (let k = 0; k < activeFilters[key].length; k++) {
                if (
                  recipe.ingredients[j].ingredient.toLowerCase() ===
                  activeFilters[key][k]
                ) {
                  filterMatch = true;
                  break;
                }
              }
            }
            break;
          case "appareils":
            for (
              let k = 0;
              k < activeFilters[key].length && !filterMatch;
              k++
            ) {
              if (recipe.appliance.toLowerCase() === activeFilters[key][k]) {
                filterMatch = true;
                break;
              }
            }
            break;
          case "ustensiles":
            for (let j = 0; j < recipe.ustensiles.length && !filterMatch; j++) {
              for (let k = 0; k < activeFilters[key].length; k++) {
                if (
                  recipe.ustensiles[j].toLowerCase() === activeFilters[key][k]
                ) {
                  filterMatch = true;
                  break;
                }
              }
            }
            break;
        }

        if (!filterMatch) {
          matchesFilters = false;
        }
      }
    }

    if (matchesSearchText && matchesFilters) {
      filteredRecipes.push(recipe);
    }
  }

  return filteredRecipes;
}
