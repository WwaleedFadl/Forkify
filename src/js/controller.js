import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
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
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load search results
    await model.loadSearchResults(query);
    // 3) Render the results
    console.log(model.state.search.results);
  } catch (error) {
    console.log(error);
  }
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);

  searchView.addHandelerSearch(controlSearchResults);
};
init();
