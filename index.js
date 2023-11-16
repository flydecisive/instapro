import { getPosts, addPost, getUserPosts, addLike, dislike } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import { renderUserPostsPageComponent } from "./components/user-posts-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

// Токен
const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

function replacePost(post) {
  const postId = post.id;
  const newPosts = [...posts];
  posts.forEach((el, index) => {
    if (el.id === postId) {
      newPosts[index] = post;
    }
  });

  posts = newPosts;
}

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      getUserPosts({ id: data.userId }).then((data) => {
        posts = data.posts;
        page = USER_POSTS_PAGE;
        renderApp();
      });
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        addPost({ description, imageUrl, token: getToken() }).then((data) => {
          if (data) {
            goToPage(POSTS_PAGE);
          }
        });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      likeButtonClick({ id, isLiked }) {
        if (isLiked) {
          dislike({ id, token: getToken() }).then((data) => {
            replacePost(data.post);
            renderApp();
          });
        } else {
          addLike({ id, token: getToken() }).then((data) => {
            replacePost(data.post);
            renderApp();
          });
        }
      },
    });
  }

  if (page === USER_POSTS_PAGE) {
    return renderUserPostsPageComponent({
      appEl,
      likeButtonClick({ id, isLiked }) {
        if (isLiked) {
          dislike({ id, token: getToken() }).then((data) => {
            replacePost(data.post);
            renderApp();
          });
        } else {
          addLike({ id, token: getToken() }).then((data) => {
            replacePost(data.post);
            renderApp();
          });
        }
      },
    });
  }
};

goToPage(POSTS_PAGE);
