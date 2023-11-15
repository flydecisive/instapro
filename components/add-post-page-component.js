import { renderHeaderComponent } from "./header-component";
import { renderUploadImageComponent } from "./upload-image-component";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const postPageData = { description: "", imageUrl: "" };

  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
            <div class="upload-image">
              <label class="file-upload-label secondary-button">
                <input type="file" class="file-upload-input" hidden />
                Выберите фото
              </label>
            </div>
          </div>
          <label>
            Опишите фотографию
            <textarea class="input textarea" rows="4"></textarea>
          </label>
        </div>
      </div>
      <button class="button" id="add-button">Добавить</button>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: document.querySelector(".upload-image"),
      onImageUrlChange(imageUrl) {
        postPageData.imageUrl = imageUrl;
      },
    });

    document.querySelector(".textarea").addEventListener("input", (e) => {
      postPageData.description = e.target.value;
    });

    document.getElementById("add-button").addEventListener("click", () => {
      if (postPageData.imageUrl === "") {
        alert("Загрузите картинку");
        return;
      }

      if (postPageData.description === "") {
        alert("Заполните описание");
        return;
      }

      onAddPostClick({
        description: postPageData.description,
        imageUrl: postPageData.imageUrl,
      });
    });
  };

  render();
}
