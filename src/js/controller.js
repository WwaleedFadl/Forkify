import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView.js';
import bookMarksView from './Views/bookMarksView.js';
import addRecipeView from './Views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
if (module.hot) {
  module.hot.accept();
}
// Api
const controlRecipes = async function () {
  try {
    //getting the id
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // Updating bookmarks view
    bookMarksView.update(model.state.bookmarks);
    //0 Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    //1) loading the recipe
    await model.loadRecipe(id);
    // 2) Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};
//
const controlSearchResults = async function () {
  try {
    //0
    // console.log(resultsView);
    resultsView.renderSpinner();
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load search results
    await model.loadSearchResults(query);
    // 3) Render the results
    resultsView.render(model.getSearchResultsPage(1));
    // 4) render the pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};
//
const controlPagination = function (goToPage) {
  // 1) Render the new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) render the new pagination buttons
  paginationView.render(model.state.search);
};
//
const controlServings = function (newServings) {
  // 1) update the recipe servings in the state
  model.updateServings(newServings);
  // 2) update the view as well
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
//
const controlAddBookmark = function () {
  // 1) add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) update recipe view
  recipeView.update(model.state.recipe);
  // 3) render the bookmarks
  bookMarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookMarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // show Loading spinner
    addRecipeView.renderSpinner();
    // Upload the new Recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);
    // render the recipe on the recipe view
    recipeView.render(model.state.recipe);
    // display a success message
    addRecipeView.renderMessage();
    // close the form window
    setTimeout(function () {
      // addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};
//
const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandelerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
