import recipesData from "../data/recipes.js";
import { updateRecipesWithFilter } from "../utils/recipeFilter.js";
import { getFilteredRecipes } from "../utils/recipeFilter.js";
import { createTag } from "./tag.js";

let selectedElementValue; // Pour enregistrer la valeur de l'élément sélectionné

export function refreshDropdowns(filteredRecipes) {
  if (!filteredRecipes) {
    filteredRecipes = getFilteredRecipes();
  }

  if (!Array.isArray(filteredRecipes)) {
    console.error("filteredRecipes doit être un tableau");
    return; // Sortie anticipée si filteredRecipes n'est pas un tableau
  }

  const filteredIngredients = getFilteredItems("ingredients", filteredRecipes);
  const filteredAppareils = getFilteredItems("appareils", filteredRecipes);
  const filteredUstensils = getFilteredItems("ustensiles", filteredRecipes);

  // Mettre à jour les listes déroulantes avec les éléments filtrés
  updateDropdownList("ingredients", filteredIngredients);
  updateDropdownList("appareils", filteredAppareils);
  updateDropdownList("ustensiles", filteredUstensils);
}

// === Nouvelles fonctions pour la mise à jour du dropdown ===
function updateDropdownList(category, filteredItems = null) {
  const dropdownList = document.querySelector(
    `.dropdown_content_list[data-category="${category}"]`
  );
  const filteredRecipes = getFilteredRecipes();

  let itemsToUpdate =
    filteredItems || getFilteredItems(category, filteredRecipes);

  if (!itemsToUpdate) {
    console.error(`itemsToUpdate est indéfini pour la catégorie: ${category}`);
    itemsToUpdate = [];
  } else if (!Array.isArray(itemsToUpdate)) {
    console.error(`itemsToUpdate doit être un tableau, reçu:`, itemsToUpdate);
    itemsToUpdate = [];
  }

  // Vider la liste actuelle
  dropdownList.innerHTML = "";
  // Ajout ou mise à jour des éléments
  itemsToUpdate.forEach((item) => {
    const li = document.createElement("li");
    li.innerText = item;
    li.setAttribute("tabindex", "0");
    li.setAttribute("data-item", item.toLowerCase());
    dropdownList.appendChild(li);
  });

  // Si un élément a été sélectionné précédemment, remettez-le en haut
  if (selectedElementValue) {
    const selectedItem = dropdownList.querySelector(
      `li[data-item="${selectedElementValue.toLowerCase()}"]`
    );
    if (selectedItem) {
      dropdownList.prepend(selectedItem);
    }
  }
}

export function getFilteredItems(category, filteredRecipes, searchText = "") {
  if (!Array.isArray(filteredRecipes)) {
    console.error("filteredRecipes doit être un tableau dans getFilteredItems");
    return [];
  }

  const allItems = new Set();

  // Parcourir les recettes filtrées
  filteredRecipes.forEach((recipe) => {
    switch (category) {
      case "ingredients":
        recipe.ingredients.forEach((ing) => {
          if (
            !searchText ||
            ing.ingredient.toLowerCase().includes(searchText.toLowerCase())
          ) {
            allItems.add(ing.ingredient);
          }
        });
        break;
      case "appareils":
        if (
          !searchText ||
          recipe.appliance.toLowerCase().includes(searchText.toLowerCase())
        ) {
          allItems.add(recipe.appliance);
        }
        break;
      case "ustensiles":
        recipe.ustensiles.forEach((ust) => {
          if (
            !searchText ||
            ust.ustensil.toLowerCase().includes(searchText.toLowerCase())
          ) {
            allItems.add(ust);
          }
        });
        break;
    }
  });

  return Array.from(allItems).sort((a, b) => a.localeCompare(b));
}

export function createDropdown() {
  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("dropdown-container");

  let ingredients = new Set();
  let appareils = new Set();
  let ustensiles = new Set();

  recipesData.recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => ingredients.add(ing.ingredient));
    appareils.add(recipe.appliance);
    recipe.ustensiles.forEach((ust) => ustensiles.add(ust));
  });

  const data = {
    ingredients: Array.from(ingredients).sort((a, b) => a.localeCompare(b)),
    appareils: Array.from(appareils).sort((a, b) => a.localeCompare(b)),
    ustensiles: Array.from(ustensiles).sort((a, b) => a.localeCompare(b)),
  };

  // Génération dynamique des dropdowns
  for (let category in data) {
    const dropdownWrap = document.createElement("div");
    dropdownWrap.classList.add("dropdown_wrapper");

    const dropDown = document.createElement("div");
    dropDown.classList.add("dropdown");

    const dropdownBtn = document.createElement("button");
    dropdownBtn.classList.add("dropdown_btn");
    dropdownBtn.innerText = category;

    const btnIcon = document.createElement("span");
    btnIcon.classList.add("fa-solid", "fa-chevron-down");
    btnIcon.setAttribute("aria-hidden", "true");

    const dropdownContent = document.createElement("div");
    dropdownContent.classList.add("dropdown_content");

    const divElement = document.createElement("div");
    const inputElement = document.createElement("input");
    inputElement.setAttribute("tabindex", "-1");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("id", `search-${category}`);
    inputElement.setAttribute("maxlength", "12");

    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("tabindex", "-1");

    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", `search-${category}`);
    labelElement.setAttribute("aria-label", `Search by ${category}`);

    divElement.appendChild(inputElement);
    divElement.appendChild(buttonElement);
    divElement.appendChild(labelElement);

    const dropdownList = document.createElement("ul");
    dropdownList.classList.add("dropdown_content_list");
    dropdownList.dataset.category = category;

    data[category].forEach((item) => {
      const li = document.createElement("li");
      li.innerText = item;
      li.setAttribute("tabindex", "0");
      li.setAttribute("data-item", item.toLowerCase());
      dropdownList.appendChild(li);
    });

    dropdownBtn.appendChild(btnIcon);
    dropdownContent.appendChild(divElement);
    dropdownContent.appendChild(dropdownList);
    dropDown.appendChild(dropdownBtn);
    dropDown.appendChild(dropdownContent);
    dropdownWrap.appendChild(dropDown);
    dropdownContainer.appendChild(dropdownWrap);

    inputElement.addEventListener("input", (e) => {
      const searchText = e.target.value.toLowerCase();

      if (searchText) {
        buttonElement.style.display = "block"; // Montre l'icône de croix
      } else {
        buttonElement.style.display = "none"; // Cache l'icône de croix
      }

      const items = dropdownList.querySelectorAll("li");
      items.forEach((item) => {
        if (item.innerText.toLowerCase().includes(searchText)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });

    // Croix dans la petite barre de recherche de nos dropdowns
    buttonElement.addEventListener("click", () => {
      inputElement.value = ""; // Efface le champ de recherche
      buttonElement.style.display = "none"; // Cache l'icône de croix
      const items = dropdownList.querySelectorAll("li");
      items.forEach((item) => {
        item.style.display = ""; // Réinitialise la liste
      });
    });

    dropdownList.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        selectedElementValue = e.target.innerText;
        const selectedItem = e.target.innerText.toLowerCase();
        const category = dropdownList.dataset.category;

        // Sauvegarder l'élément sélectionné
        const selectedItemRef = { category, value: selectedItem };

        createTag(category, selectedItem);
        updateRecipesWithFilter(category, selectedItem);

        // Appeler refreshDropdowns, qui réinitialisera les éléments
        refreshDropdowns();

        // Réappliquer la classe focused après la mise à jour
        setTimeout(() => {
          const updatedDropdownList = document.querySelector(
            `.dropdown_content_list[data-category="${category}"]`
          );
          const liToFocus = Array.from(
            updatedDropdownList.querySelectorAll("li")
          ).find((li) => li.innerText.toLowerCase() === selectedItemRef.value);
          if (liToFocus) {
            liToFocus.classList.add("focused");
          }
        }, 100);
      }
    });
  }

  return dropdownContainer;
}

export { updateDropdownList };
