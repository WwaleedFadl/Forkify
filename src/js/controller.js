import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as modal from './model.js';
import recipeView from './Views/recipeView.js';
//
//
//
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

// Api
const controlRecipes = async function () {
  try {
    //getting the id
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //1) loading the recipe
    await modal.loadRecipe(id);

    // 2) Rendering the recipe
    recipeView.render(modal.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};
init();
