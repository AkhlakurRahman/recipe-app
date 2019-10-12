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
      alert(error);
    }
  }
}

export default Recipe;
