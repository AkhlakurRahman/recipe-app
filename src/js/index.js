import Search from './models/Search';
import { elements } from './views/base';
import * as searchView from './views/searchView';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipe
 */

const state = {};

console.log(state);

// Search for recipe
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

    // 4. Search for recipes
    await state.search.getRecipe();

    // Render results in UI
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
