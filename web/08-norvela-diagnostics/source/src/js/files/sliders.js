/*
Документація по роботі у шаблоні: https://template.fls.guru/template-docs/rabota-so-slajderom-swiper.html
Документація слайдера: https://swiperjs.com/
*/
import Swiper, { Navigation, Thumbs, Keyboard, A11y } from 'swiper';
// Базові стилі Swiper з шаблону
import "../../scss/base/swiper.scss";

function initSliders() {
	// Галерея продукту з мініатюрами
	const main = document.querySelector('.gallery__main');
	const thumbsEl = document.querySelector('.gallery__thumbs');
	if (main && thumbsEl) {
		const thumbs = new Swiper(thumbsEl, {
			slidesPerView: 3,
			spaceBetween: 12,
			watchSlidesProgress: true,
		});
		new Swiper(main, {
			modules: [Navigation, Thumbs, Keyboard, A11y],
			slidesPerView: 1,
			spaceBetween: 16,
			speed: 500,
			keyboard: { enabled: true, onlyInViewport: true },
			a11y: {
				prevSlideMessage: 'Previous image',
				nextSlideMessage: 'Next image',
				slideLabelMessage: 'Image {{index}} of {{slidesLength}}',
			},
			navigation: {
				prevEl: '.gallery__arrow--prev',
				nextEl: '.gallery__arrow--next',
			},
			thumbs: { swiper: thumbs },
		});
	}
}
// Ініціалізуємо одразу: стилі вже в CSS, чекати load не потрібно
initSliders();
