import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView.js';
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

    //1) loading the recipe
    await model.loadRecipe(id);
    // 2) Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};
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
const init = function () {
  recipeView.addHandlerRender(controlRecipes);

  searchView.addHandelerSearch(controlSearchResults);
};
init();
