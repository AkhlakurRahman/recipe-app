import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipe
 */

const state = {};

console.log(state);

/**
 * SearchController for recipe
 */

const controlSearch = async () => {
  // 1. Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    // Clear input
    searchView.resetInput();
    // Reset results
    searchView.resetResult();
    renderLoader(elements.searchResult);

    // 4. Search for recipes
    await state.search.getRecipe();

    // Render results in UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const gotoPage = parseInt(btn.dataset.goto, 10);
    searchView.resetResult();
    searchView.renderResults(state.search.result, gotoPage);
  }
});

/**
 * RecipeController
 */
const recipe = new Recipe(47746);
recipe.getRecipe();
console.log(recipe);

// const controlRecipe = async () => {

// }
