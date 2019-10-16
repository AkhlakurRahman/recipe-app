import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as likesView from './views/likesView';
import * as shoppingListView from './views/shoppingListView';
import Likes from './models/Likes';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipe
 */

const state = {};
window.state = state;

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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
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

    state.shoppingListItem.updateCount(itemId, val);
  }
});

/**
 * LikeController
 */

const likeController = () => {
  if (!state.likes) state.likes = new Likes();

  const recipeId = state.recipe.id;

  // If user hasn't liked yet
  if (!state.likes.isLiked(recipeId)) {
    // Add recipe to the state
    const newLike = state.likes.addLikes(
      recipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.img
    );

    // Toggle like button
    likesView.toggleLikeBtn(true);

    // Add recipe to UI
    likesView.renderLikes(newLike);
  } else {
    // If user already liked
    // Remove recipe from the state
    state.likes.deleteLike(recipeId);
    // Toggle like button
    likesView.toggleLikeBtn(false);

    // Remove recipe from UI
    likesView.deleteLike(recipeId);
  }

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorageData();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

  // Render existing likes to UI
  state.likes.likes.forEach(like => likesView.renderLikes(like));
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
    // Add recipe to shopping cart
    shoppingListController();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    likeController();
  }
});
