export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResult: document.querySelector('.results'),
  searchResultList: document.querySelector('.results__list'),
  searchResultPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe')
};

export const renderLoader = parent => {
  const loader = `
    <div class="loader">
      <svg>
          <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;

  parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) loader.parentElement.removeChild(loader);
};
