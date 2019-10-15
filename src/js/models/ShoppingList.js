import uniqueId from '../libs/uniqueId';

// import { v4 as uuid } from 'uuid';

class ShoppingList {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqueId(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item;
  }

  removeItem(id) {
    const index = this.items.findIndex(el => el.id === id);

    this.items.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }
}

export default ShoppingList;
