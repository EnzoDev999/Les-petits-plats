import { activeFilters } from "../pages/main.js";
import { getFilteredRecipes } from "../utils/recipeFilter.js";
import { displayRecipe } from "./recipeCard.js";
import { updateDropdownList } from "./dropDown.js";
import { updateRecipeCount } from "../utils/recipeCountUpdater.js";
import { recipesCountElement } from "../pages/main.js";

function updateRecipeDisplay() {
  const cardSection = document.querySelector(".card_section");
  cardSection.innerHTML = "";

  const filteredRecipes = getFilteredRecipes();
  filteredRecipes.forEach((recipe) => {
    displayRecipe(recipe, cardSection);
  });

  // Mise à jour du nombre de recettes
  if (recipesCountElement) {
    updateRecipeCount(filteredRecipes, recipesCountElement);
  }
}

function createTag(category, item) {
  const tagContainer = document.querySelector(".tag_section");

  // Vérification si le tag existe déjà
  const existingTag = Array.from(tagContainer.querySelectorAll(".tag")).find(
    (tag) => tag.innerText.includes(item)
  );
  if (existingTag) {
    return; // Si le tag existe, sort de la fonction sans rien faire
  }

  const tag = document.createElement("div");
  tag.classList.add("tag");
  tag.innerText = item;

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("tag-close");
  closeBtn.innerText = "x";

  tag.appendChild(closeBtn);
  tagContainer.appendChild(tag);

  closeBtn.addEventListener("click", () => {
    removeTag(tag, category, item);
  });
}

//trie de mes dropDown
function sortDropdownList(category) {
  const dropdownList = document.querySelector(
    `.dropdown_content_list[data-category="${category}"]`
  );
  const items = Array.from(dropdownList.querySelectorAll("li"));
  items.sort((a, b) => a.innerText.localeCompare(b.innerText));
  items.forEach((item) => dropdownList.appendChild(item));
}

function removeTag(tagElement, category, item) {
  const index = activeFilters[category].indexOf(item.toLowerCase());
  if (index > -1) {
    // ici .filter va créer un tableau contenant tous les éléments SAUF celui qu'on décide de supprimer (qu'il soit seul ou dupliqué en cliquant dessus plusieurs fois)
    activeFilters[category] = activeFilters[category].filter(
      (filterItem) => filterItem !== item.toLowerCase()
    );
  }
  // Suppression de la div avec la classe 'tag'
  const tagContainer = document.querySelector(".tag_section");
  const tagDiv = Array.from(tagContainer.querySelectorAll(".tag")).find((tag) =>
    tag.innerText.includes(item)
  );

  if (tagDiv) {
    tagDiv.remove();
  }

  updateRecipeDisplay();

  // Mettre à jour toutes les listes déroulantes
  updateDropdownList("ingredients");
  updateDropdownList("ustensiles");
  updateDropdownList("appareils");

  // Supprim la classe de l'élément correspondant dans la liste déroulante
  const dropdownList = document.querySelector(
    `.dropdown_content_list[data-category="${category}"]`
  );
  const li = Array.from(dropdownList.querySelectorAll("li")).find(
    (li) => li.innerText.toLowerCase() === item.toLowerCase()
  );
  if (li) {
    li.classList.remove("dropdown_content_list_selectTag");
    if (li.classList.length === 0) {
      li.removeAttribute("class");
    }
  }

  // Remettre les éléments dans leur position initiale après la mise à jour
  sortDropdownList("ingredients");
  sortDropdownList("ustensiles");
  sortDropdownList("appareils");
}

export { createTag };
export { removeTag };
