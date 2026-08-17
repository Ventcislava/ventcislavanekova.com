(() => {
  const galleryImages = [...document.querySelectorAll(".gallery img")];
  if (!galleryImages.length) return;

  const styles = document.createElement("style");
  styles.textContent = `
    .gallery img.image-lightbox-trigger {
      cursor: zoom-in;
      transition: opacity .2s ease;
    }
    .gallery img.image-lightbox-trigger:hover {
      opacity: .88;
    }
    .gallery img.image-lightbox-trigger:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 4px;
    }
    .image-lightbox {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: clamp(42px, 6vh, 68px) clamp(72px, 8vw, 128px);
      background: rgba(0, 0, 0, .94);
      backdrop-filter: blur(8px);
    }
    .image-lightbox.is-open {
      display: flex;
    }
    .image-lightbox__image {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 6px;
      box-shadow: 0 20px 70px rgba(0, 0, 0, .55);
    }
    .image-lightbox__close {
      position: fixed;
      top: 18px;
      right: 22px;
      width: 44px;
      height: 44px;
      border: 1px solid rgba(255, 255, 255, .5);
      border-radius: 50%;
      background: rgba(0, 0, 0, .5);
      color: #fff;
      font: 300 30px/1 sans-serif;
      cursor: pointer;
    }
    .image-lightbox__close:hover,
    .image-lightbox__close:focus-visible {
      background: #fff;
      color: #0d0d0d;
      outline: none;
    }
    .image-lightbox__nav {
      position: fixed;
      top: 50%;
      z-index: 1;
      width: 40px;
      height: 52px;
      border: 0;
      background: transparent;
      color: rgba(255, 255, 255, .45);
      font: 300 32px/1 "Nunito Sans", sans-serif;
      cursor: pointer;
      transform: translateY(-50%);
      transition: color .2s ease, transform .2s ease;
      text-shadow: 0 2px 10px rgba(0, 0, 0, .5);
    }
    .image-lightbox__nav:hover,
    .image-lightbox__nav:focus-visible {
      color: rgba(255, 255, 255, .82);
      outline: none;
      transform: translateY(-50%) scale(1.08);
    }
    .image-lightbox__previous {
      left: clamp(12px, 2.5vw, 36px);
    }
    .image-lightbox__next {
      right: clamp(12px, 2.5vw, 36px);
    }
    body.image-lightbox-open {
      overflow: hidden;
    }
    @media (max-width: 600px) {
      .image-lightbox {
        padding: 54px 44px 32px;
      }
      .image-lightbox__nav {
        width: 32px;
        height: 44px;
        font-size: 26px;
      }
      .image-lightbox__previous {
        left: 6px;
      }
      .image-lightbox__next {
        right: 6px;
      }
    }
  `;
  document.head.appendChild(styles);

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Enlarged image");

  const enlargedImage = document.createElement("img");
  enlargedImage.className = "image-lightbox__image";

  const previousButton = document.createElement("button");
  previousButton.className = "image-lightbox__nav image-lightbox__previous";
  previousButton.type = "button";
  previousButton.setAttribute("aria-label", "Previous image");
  previousButton.textContent = "<";

  const nextButton = document.createElement("button");
  nextButton.className = "image-lightbox__nav image-lightbox__next";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Next image");
  nextButton.textContent = ">";

  const closeButton = document.createElement("button");
  closeButton.className = "image-lightbox__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close enlarged image");
  closeButton.textContent = "×";

  lightbox.append(previousButton, enlargedImage, nextButton, closeButton);
  document.body.appendChild(lightbox);

  let previouslyFocused = null;
  let currentIndex = 0;

  const showImage = () => {
    const image = galleryImages[currentIndex];
    enlargedImage.src = image.currentSrc || image.src;
    enlargedImage.alt = image.alt || "Enlarged gallery image";
    lightbox.setAttribute(
      "aria-label",
      `Enlarged image ${currentIndex + 1} of ${galleryImages.length}`
    );
  };

  const moveImage = (direction) => {
    currentIndex =
      (currentIndex + direction + galleryImages.length) % galleryImages.length;
    showImage();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("image-lightbox-open");
    enlargedImage.removeAttribute("src");
    if (previouslyFocused) previouslyFocused.focus();
  };

  const openLightbox = (image) => {
    previouslyFocused = image;
    currentIndex = galleryImages.indexOf(image);
    showImage();
    lightbox.classList.add("is-open");
    document.body.classList.add("image-lightbox-open");
    closeButton.focus();
  };

  galleryImages.forEach((image) => {
    image.classList.add("image-lightbox-trigger");
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `View larger: ${image.alt || "gallery image"}`);

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => moveImage(-1));
  nextButton.addEventListener("click", () => moveImage(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (lightbox.classList.contains("is-open")) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveImage(-1);
      if (event.key === "ArrowRight") moveImage(1);
    }
  });
})();
