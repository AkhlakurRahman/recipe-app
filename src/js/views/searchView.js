import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Reset input
export const resetInput = () => (elements.searchInput.value = '');

// Clear search result
export const resetResult = () => (elements.searchResultList.innerHTML = '');

// Render individual recipe
const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${recipe.title}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
  </li>
  `;

  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// Render all recipe
export const renderResults = recipes => {
  recipes.map(renderRecipe);
};
