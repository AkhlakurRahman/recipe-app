import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shoppingListView from './views/shoppingListView';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipe
 */

const state = {};

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

    try {
      // 4. Search for recipes
      await state.search.getAllRecipe();

      // Render results in UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Error while getting recipes! :(');
      clearLoader();
    }
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
const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare for UI changes
    recipeView.clearRecipeView();
    renderLoader(elements.recipe);

    // highlight selected item
    if (state.search) searchView.highlightSelected(id);

    // Create new Recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate serving time
      state.recipe.calcCookingTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert('Error while processing recipe! :(');
      clearLoader();
    }
  }
};

['hashchange', 'load'].map(event =>
  window.addEventListener(event, controlRecipe)
);

/**
 * ShoppingList Controller
 */

const shoppingListController = () => {
  // Create a new ShoppingList if there is none
  if (!state.shoppingListItem) state.shoppingListItem = new ShoppingList();

  // Add ingredients to the UI
  state.recipe.ingredients.forEach(el => {
    const item = state.shoppingListItem.addItem(
      el.count,
      el.unit,
      el.ingredient
    );
    shoppingListView.renderShoppingList(item);
  });
};

elements.shoppingList.addEventListener('click', e => {
  const itemId = e.target.closest('.shopping__item').dataset.itemid;

  // Handle delete
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Remove item from state
    state.shoppingListItem.removeItem(itemId);

    // Remove item from UI
    shoppingListView.deleteItem(itemId);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    if (val > 0) {
      state.shoppingListItem.updateCount(itemId, val);
    }
  }
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateRecipeServings(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateRecipeServings(state.recipe);
  } else if (e.target.matches('.recipe__btn--cart, .recipe__btn--cart *')) {
    shoppingListController();
  }
});

window.l = new ShoppingList();
