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
  tag.setAttribute("data-item", item.toLowerCase());

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("tag-close");
  closeBtn.innerText = "x";

  tag.appendChild(closeBtn);
  tagContainer.appendChild(tag);

  closeBtn.addEventListener("click", () => {
    removeTag(tag, category, item);
  });
}

//trie de mes dropDown (permet de retrier mes listes au complet)
function sortDropdownList(category) {
  const dropdownList = document.querySelector(
    `.dropdown_content_list[data-category="${category}"]`
  );

  // Séparer les éléments sélectionnés et non sélectionnés
  const selectedItems = Array.from(
    dropdownList.querySelectorAll(".dropdown_content_list_selectTag")
  );
  const nonSelectedItems = Array.from(
    dropdownList.querySelectorAll("li:not(.dropdown_content_list_selectTag)")
  );

  // Trier uniquement les éléments non sélectionnés
  nonSelectedItems.sort((a, b) => a.innerText.localeCompare(b.innerText));

  // Vider la liste et remettre d'abord les éléments sélectionnés, puis les non sélectionnés triés
  dropdownList.innerHTML = "";
  selectedItems.forEach((item) => dropdownList.appendChild(item));
  nonSelectedItems.forEach((item) => dropdownList.appendChild(item));
}

function removeTag(element, category, itemText) {
  let item = itemText.toLowerCase();

  // Supprimer l'élément de la liste activeFilters si c'est un grand tag ou un li
  const index = activeFilters[category].indexOf(item);
  if (index > -1) {
    // ici .filter va créer un tableau contenant tous les éléments SAUF celui qu'on décide de supprimer (qu'il soit seul ou dupliqué en cliquant dessus plusieurs fois)
    activeFilters[category] = activeFilters[category].filter(
      (filterItem) => filterItem !== item.toLowerCase()
    );
  }

  // Suppression visuelle du tag de l'interface utilisateur
  if (element.classList.contains("tag")) {
    // Suppression du grand tag
    element.remove();
    // Trouver et supprimer le tag correspondant dans la liste déroulante si présent
    const dropdownItem = document.querySelector(
      `.dropdown_content_list[data-category="${category}"] li[data-item="${item}"]`
    );
    if (dropdownItem) {
      dropdownItem.classList.remove("dropdown_content_list_selectTag");
      // Si le tag dans le dropdown a un bouton de suppression, retirez-le
      const removeBtn = dropdownItem.querySelector(".li-remove-btn");
      if (removeBtn) {
        dropdownItem.removeChild(removeBtn);
      }
    }
  } else if (element.tagName === "LI") {
    // Suppression du tag de la liste déroulante
    element.classList.remove("dropdown_content_list_selectTag");
    // Supprimer la petite croix du li
    const removeBtn = element.querySelector(".li-remove-btn");
    if (removeBtn) {
      removeBtn.removeEventListener("click", removeTagListener); // Assurez-vous de désinscrire l'écouteur d'événements
      element.removeChild(removeBtn);
    }
    // Trouver et supprimer le grand tag correspondant si présent
    const tagElement = document.querySelector(`.tag[data-item="${item}"]`);
    if (tagElement) {
      tagElement.remove();
    }
  }

  // Mise à jour de l'affichage des recettes et des listes déroulantes
  updateRecipeDisplay();
  refreshDropdownsAndMaintainOrder("ingredients");
  refreshDropdownsAndMaintainOrder("appareils");
  refreshDropdownsAndMaintainOrder("ustensiles");
}

// Fonction d'écouteur pour la suppression à partir de la petite croix dans le dropdown
function removeTagListener(event) {
  const li = event.target.parentElement;
  const category = li
    .closest(".dropdown_content_list")
    .getAttribute("data-category");
  const itemName = li.textContent.trim();
  removeTag(li, category, itemName);
}

function refreshDropdownsAndMaintainOrder(category) {
  // Obtiens tous les éléments de la liste déroulante actuelle avec la classe 'dropdown_content_list_selectTag'
  const dropdownList = document.querySelector(
    `.dropdown_content_list[data-category="${category}"]`
  );
  // Sauvegarde les éléments sélectionnés dans un tableau pour les remettre plus tard
  let selectedItemsArray = Array.from(
    dropdownList.querySelectorAll(".dropdown_content_list_selectTag")
  ).map((li) => li.innerText);

  // Mettre à jour la liste déroulante maintenant
  updateDropdownList(category);

  // Trie la liste avec les éléments non sélectionnés restants après la mise à jour
  sortDropdownList(category); // on s'assure que cette ligne est après l'appel à updateDropdownList pour maintenir l'ordre

  // Remet les éléments sélectionnés au-dessus en conservant leur classe
  selectedItemsArray.forEach((selectedItemText) => {
    const itemToMoveUp = Array.from(dropdownList.querySelectorAll("li")).find(
      (li) => li.innerText === selectedItemText
    );
    if (itemToMoveUp) {
      itemToMoveUp.classList.add("dropdown_content_list_selectTag");
      dropdownList.prepend(itemToMoveUp); // Remet l'élément en haut de la liste
    }
  });
}

export { createTag };
export { removeTag };
