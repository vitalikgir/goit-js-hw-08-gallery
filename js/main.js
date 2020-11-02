import galleryItems from './gallery-items.js';

const refs = {
  gallery: document.querySelector('.js-gallery'),
  lightbox: document.querySelector('.js-lightbox'),
  lightboxImg: document.querySelector('.js-lightbox img'),
};

const galleryItemsMarkup = galleryItems
  .map(({ preview, original, description }, index) =>
    makeGalleryItemMarkup(preview, original, description, index),
  )
  .join('');

refs.gallery.insertAdjacentHTML('beforeend', galleryItemsMarkup);

let activeIndex;

refs.gallery.addEventListener('click', galleryClickCb);
refs.lightbox.addEventListener('click', lightboxClickCb);

function makeGalleryItemMarkup(preview, original, description, index) {
  return `
  <li class="gallery__item">
    <a
      class="gallery__link"
      href="${original}"
    >
      <img
        class="gallery__image"
        src="${preview}"
				data-source="${original}"
				data-index="${index}"
				alt="${description}"
      />
    </a>
  </li>
  `;
}
function openModal() {
  refs.lightbox.classList.add('is-open');
  window.addEventListener('keydown', windowKeydownCb);
}
function closeModal() {
  refs.lightbox.classList.remove('is-open');
  refs.lightboxImg.src = '';
  refs.lightboxImg.alt = '';
  window.removeEventListener('keydown', windowKeydownCb);
}
function galleryClickCb(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  refs.lightboxImg.src = event.target.dataset.source;
  refs.lightboxImg.alt = event.target.alt;
  openModal();
  activeIndex = +event.target.dataset.index;
}
function lightboxClickCb(event) {
  if (
    event.target.nodeName === 'DIV' ||
    event.target.dataset.action === 'close-lightbox'
  ) {
    closeModal();
  }
}
function windowKeydownCb({ key }) {
  if (key === 'Escape') {
    closeModal();
  }
  if (key === 'ArrowLeft') {
    activeIndex >= 1
      ? (activeIndex -= 1)
      : (activeIndex = galleryItems.length - 1);
    updateModalImg(activeIndex);
  }
  if (key === 'ArrowRight') {
    activeIndex < galleryItems.length - 1
      ? (activeIndex += 1)
      : (activeIndex = 0);
    updateModalImg(activeIndex);
  }
}
function updateModalImg(activeIndex) {
  refs.lightboxImg.src = galleryItems[activeIndex].original;
  refs.lightboxImg.alt = galleryItems[activeIndex].description;
}
