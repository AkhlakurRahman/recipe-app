import axios from 'axios';
import { API_KEY, PROXY } from '../config';

class Search {
  constructor(query) {
    this.query = query;
  }

  async getRecipe() {
    try {
      const res = await axios.get(
        `${PROXY}https://www.food2fork.com/api/search?key=${API_KEY}&q=${this.query}`
      );
      this.result = res.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}

export default Search;
