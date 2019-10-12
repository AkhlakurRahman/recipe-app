import axios from 'axios';
import { API_KEY } from '../../../API_KEY';

class Search {
  constructor(query) {
    this.query = query;
  }

  async getRecipe() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';

    try {
      const res = await axios.get(
        `${proxy}https://www.food2fork.com/api/search?key=${API_KEY}&q=${this.query}`
      );
      this.result = res.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}

export default Search;
