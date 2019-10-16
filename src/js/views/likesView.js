import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

  document
    .querySelector('.recipe__love use')
    .setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numberOfLikes => {
  elements.likesMenu.style.visibility =
    numberOfLikes > 0 ? 'visible' : 'hidden';
};

export const renderLikes = likes => {
  const markup = `
  <li>
    <a class="likes__link" href="#${likes.id}">
      <figure class="likes__fig">
        <img src="${likes.img}" alt="${likes.title}">
      </figure>
      <div class="likes__data">
        <h4 class="likes__name">${limitRecipeTitle(likes.title)}</h4>
        <p class="likes__author">${likes.publisher}</p>
      </div>
    </a>
  </li>
  `;

  elements.likesItem.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
  const likeItem = document.querySelector(`.likes__link[href="#${id}"]`)
    .parentElement;

  if (likeItem) likeItem.parentElement.removeChild(likeItem);
};
