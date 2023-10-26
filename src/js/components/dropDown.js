import recipesData from "../data/recipes.js";
import { updateRecipesWithFilter } from "../utils/recipeFilter.js";
import { getFilteredRecipes } from "../utils/recipeFilter.js";
import { createTag } from "./tag.js";

// === Nouvelles fonctions pour la mise à jour du dropdown ===
function updateDropdownList(category) {
  const dropdownList = document.querySelector(
    `.dropdown_content_list[data-category="${category}"]`
  );
  const filteredItems = getFilteredItems(category);

  // Création d'une liste des éléments actuels
  const currentItems = Array.from(dropdownList.querySelectorAll("li")).map(
    (li) => li.innerText
  );

  // Ajout des éléments manquants
  filteredItems.forEach((item) => {
    if (!currentItems.includes(item)) {
      const li = document.createElement("li");
      li.innerText = item;
      li.setAttribute("tabindex", "0");
      dropdownList.appendChild(li);
    }
  });

  // Suppression des éléments non présents dans filteredItems
  dropdownList.querySelectorAll("li").forEach((li) => {
    if (!filteredItems.includes(li.innerText)) {
      li.remove();
    }
  });

  // Si un élément a été sélectionné, le déplacer en haut de la liste
  if (selectedElementValue) {
    const selectedItem = Array.from(dropdownList.querySelectorAll("li")).find(
      (li) => li.innerText === selectedElementValue
    );
    if (selectedItem) {
      dropdownList.prepend(selectedItem);
    }
  }
}

function getFilteredItems(category) {
  const allItems = new Set();
  const filteredRecipes = getFilteredRecipes(); // Une fonction de recipeFilter.js

  filteredRecipes.forEach((recipe) => {
    switch (category) {
      case "ingredients":
        recipe.ingredients.forEach((ing) => allItems.add(ing.ingredient));
        break;
      case "appareils":
        allItems.add(recipe.appliance);
        break;
      case "ustensiles":
        recipe.ustensils.forEach((ust) => allItems.add(ust));
        break;
    }
  });

  return Array.from(allItems).sort((a, b) => a.localeCompare(b));
}

let selectedElementValue; // Pour enregistrer la valeur de l'élément sélectionné

export function createDropdown() {
  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("dropdown-container");

  let ingredients = new Set();
  let appareils = new Set();
  let ustensiles = new Set();

  recipesData.recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => ingredients.add(ing.ingredient));
    appareils.add(recipe.appliance);
    recipe.ustensils.forEach((ust) => ustensiles.add(ust));
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
      li.setAttribute("tabindex", "0"); // Ajoutez cette ligne
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
        selectedElementValue = e.target.innerText; // Enregistre la valeur
        const selectedItem = e.target.innerText;
        const category = dropdownList.dataset.category;

        // Montre tous les éléments
        const items = dropdownList.querySelectorAll("li");
        items.forEach((item) => {
          item.style.display = "";
        });

        e.target.classList.add("dropdown_content_list_selectTag"); // Ajoute la classe

        const removeLiBtn = document.createElement("button");
        removeLiBtn.setAttribute("tabindex", "0");
        removeLiBtn.style.display = "block";
        e.target.appendChild(removeLiBtn);

        e.target.remove(); // Supprime l'élément sélectionné de sa position actuelle
        dropdownList.prepend(e.target); // Ajoute l'élément sélectionné au début de la liste

        createTag(category, selectedItem); // Création du tag
        updateRecipesWithFilter(category, selectedItem);
      }
    });
  }

  return dropdownContainer;
}

export { updateDropdownList };
