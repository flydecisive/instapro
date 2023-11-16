import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import ruLocale from "date-fns/locale/ru";

export function renderPostsPageComponent({ appEl, likeButtonClick }) {
  const postsHtml = posts.map((el) => {
    return `<li class="post">
      <div class="post-header" data-user-id=${el.user.id}>
          <img src=${el.user.imageUrl} class="post-header__user-image">
          <p class="post-header__user-name">${el.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src=${el.imageUrl}>
      </div>
      <div class="post-likes">
        <button data-post-id=${el.id} class="like-button">
          <img src=${
            el.isLiked
              ? "./assets/images/like-active.svg"
              : "./assets/images/like-not-active.svg"
          }>
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${el.likes.length}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${el.user.name}</span>
        ${el.description}
      </p>
      <p class="post-date">
        ${formatDistanceToNow(new Date(el.createdAt), {
          locale: ruLocale,
        })} назад
      </p>
    </li>`;
  });

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      let isLiked;
      if (likeEl.children[0].currentSrc.includes("like-active")) {
        isLiked = true;
      } else {
        isLiked = false;
      }
      likeButtonClick({ id: likeEl.dataset.postId, isLiked });
    });
  }
}
