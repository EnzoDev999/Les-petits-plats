// Fichier recipeCard.js

export function displayRecipe(recipe, cardSection) {
  const recipeCard = document.createElement("div");
  recipeCard.classList.add("recipe-card");

  // Ajoutez les détails de votre recette ici, par exemple:
  recipeCard.innerHTML = `
    ${
      recipe.time > 0
        ? ` <p class="recipe-card_time">
              ${
                recipe.time > 60
                  ? `${Math.floor(recipe.time / 60)} h ${recipe.time % 60}`
                  : `${recipe.time} min`
              }
              </p>`
        : ""
    }
      <img src="./assets/images/recipes/${recipe.image}" alt="${recipe.name}">
      <div class="recipe-card_infos">
        <h2>${recipe.name}</h2>
        <div class="recipe-card_infos_instructions">
          <h3>recette</h3>
          <p>${recipe.description}</p>
        </div>
        <div class="recipe-card_infos_ingredients">
          <h3>ingrédients</h3>
          <ul>
            ${recipe.ingredients
              .map((ingredient) => {
                if (ingredient.quantity && ingredient.unit) {
                  return `
                      <li>
                          <span class="ingredient-elm">${ingredient.ingredient}</span>
                          <span class="quant-elm unit-elm">${ingredient.quantity} ${ingredient.unit}</span>
                      </li>
                          `;
                } else if (ingredient.quantity) {
                  return `
                      <li>
                          <span class="ingredient-elm">${ingredient.ingredient}</span>
                          <span class="quant-elm">${ingredient.quantity}</span>
                      </li>
                          `;
                } else {
                  return `
                      <li>
                          <span class="ingredient-elm">${ingredient.ingredient}</span>
                      </li>
                          `;
                }
              })
              .join("")}
          </ul>
         </div>
      </div>
    `;

  cardSection.appendChild(recipeCard);
}
