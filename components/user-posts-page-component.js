import { renderHeaderComponent } from "./header-component";
import { posts } from "../index";
import { formatDistanceToNow } from "date-fns";
import ruLocale from "date-fns/locale/ru";

export function renderUserPostsPageComponent({ appEl, likeButtonClick }) {
  const name = posts[0].user.name;
  const imageUrl = posts[0].user.imageUrl;

  const postsHtml = posts.map((el) => {
    return `<li class="post">
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
                <div class="posts-user-header">
                    <img src=${imageUrl} class="posts-user-header__user-image" />
                    <p class="posts-user-header__user-name">${name}</p>
                </div>
                <ul class="posts">
                    ${postsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

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
