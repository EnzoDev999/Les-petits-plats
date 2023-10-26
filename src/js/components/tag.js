import { activeFilters } from "../pages/main.js";
import { getFilteredRecipes } from "../utils/recipeFilter.js";
import { displayRecipe } from "./recipeCard.js";
import { updateDropdownList } from "./dropDown.js";

function updateRecipeDisplay() {
  const cardSection = document.querySelector(".card_section");
  cardSection.innerHTML = "";

  const filteredRecipes = getFilteredRecipes();
  filteredRecipes.forEach((recipe) => {
    displayRecipe(recipe, cardSection);
  });
}

function createTag(category, item) {
  const tagContainer = document.querySelector(".tag_section"); // supposez que vous avez une div avec la classe "tag-section" pour contenir les tags

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
    activeFilters[category].splice(index, 1);
  }
  tagElement.remove();
  updateRecipeDisplay();

  // Mettre à jour toutes les listes déroulantes
  updateDropdownList("ingredients");
  updateDropdownList("ustensiles");
  updateDropdownList("appareils");

  // Remettre les éléments dans leur position initiale après la mise à jour
  sortDropdownList("ingredients");
  sortDropdownList("ustensiles");
  sortDropdownList("appareils");
}

export { createTag };
