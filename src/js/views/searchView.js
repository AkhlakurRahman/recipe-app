import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Reset input
export const resetInput = () => (elements.searchInput.value = '');

// Clear search result
export const resetResult = () => {
  elements.searchResultList.innerHTML = '';
  elements.searchResultPages.innerHTML = '';
};

// Hight light selected items
export const highlightSelected = id => {
  const classArr = Array.from(document.querySelectorAll('.results__link'));
  classArr.forEach(el => {
    el.classList.remove('results__link--active');
  });

  document
    .querySelector(`a[href="#${id}"]`)
    .classList.add('results__link--active');
};

// Limit recipe title
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    // return result
    return `${newTitle.join(' ')} ...`;
  }
  return title;
};

// Render individual recipe
const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
  </li>
  `;

  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// Create button
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
      <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === 'prev' ? 'left' : 'right'
            }"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numberOfResults, resultPerPage) => {
  const pages = Math.ceil(numberOfResults / resultPerPage);

  let button;
  if (page === 1 && pages > 1) {
    // Only button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Both buttons
    button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
  } else if (page === pages && pages > 1) {
    // Only button to go to prev page
    button = createButton(page, 'prev');
  }

  elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resultPerPage;
  const end = page * resultPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // render pagination buttons
  renderButtons(page, recipes.length, resultPerPage);
};
