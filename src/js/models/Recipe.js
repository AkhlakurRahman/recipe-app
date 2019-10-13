import axios from 'axios';
import { API_KEY, PROXY } from '../config';

class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios.get(
        `${PROXY}https://www.food2fork.com/api/get?key=${API_KEY}&rId=${this.id}`
      );

      this.title = res.data.recipe.title;
      this.publisher = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.source = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      alert('Something went wrong! :(');
    }
  }

  calcCookingTime() {
    // Cooking time is 15 minutes for each 3 ingredients
    const numberOfIngredients = this.ingredients.length;
    const period = Math.ceil(numberOfIngredients / 3);
    this.totalCookingTime = period * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLongForm = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds'
    ];

    const unitsShortForm = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'lb'
    ];

    const units = [...unitsShortForm, 'kg', 'g'];

    const newIngredients = this.ingredients.map(el => {
      // Uniform units
      let ingredient = el.toLowerCase();
      unitsLongForm.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShortForm[index]);
      });
      // Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // Parse ingredients into count, unit and ingredient
      // Converting ingredient string into array
      const arrIngredient = ingredient.split(' ');
      // Matching the units between unitsShortForm and arrIngredient
      const unitIndex = arrIngredient.findIndex(el2 => units.includes(el2));

      let objIngredient;
      if (unitIndex > -1) {
        // Unit is present
        // Ex. 3 1/4 cup results into [3, 1/4]
        // Ex 2 ounces results into [2]
        const arrCount = arrIngredient.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIngredient[0].replace('-', '+'));
        } else {
          // Ex. 3 1/4 cup results into [3, 1/4] --> eval("3+1/4") --> 3.25
          count = eval(arrCount.join('+'));
        }

        objIngredient = {
          count,
          unit: arrIngredient[unitIndex],
          ingredient: arrIngredient.slice(unitIndex + 1).join(' ')
        };
      } else if (parseInt(arrIngredient[0], 10)) {
        // No unit present but first element is number
        objIngredient = {
          count: parseInt(arrIngredient[0], 10),
          unit: '',
          ingredient: arrIngredient.slice(1).join(' ')
        };
      } else if (unitIndex === -1) {
        // There is no unit
        objIngredient = {
          count: 1,
          unit: '',
          ingredient
        };
      }

      return objIngredient;
    });

    this.ingredients = newIngredients;
  }
}

export default Recipe;
