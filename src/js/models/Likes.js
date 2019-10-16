class Likes {
  constructor() {
    this.likes = [];
  }

  addLikes(id, title, publisher, img) {
    const like = { id, title, publisher, img };
    this.likes.push(like);

    // Persist data to localStorage
    this.persistData();

    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);

    // Persist data to localStorage
    this.persistData();

    this.likes.splice(index, 1);
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumberOfLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorageData() {
    const storageData = JSON.parse(localStorage.getItem('likes'));

    // Restore data to this.likes
    if (storageData) this.likes = storageData;
  }
}

export default Likes;
