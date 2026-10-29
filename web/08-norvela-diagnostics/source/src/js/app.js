/*
Norvela Diagnostics — збірка на основі "Чертоги Фрілансера" (FLS start template).
Підключаємо тільки ті модулі шаблону, які реально використовуються на сторінках.
*/
window['FLS'] = false;

// Стилі
import "../scss/style.scss";

// Функціонал шаблону
import * as flsFunctions from "./files/functions.js";

/* Клас touch для HTML на мобільних, loaded після завантаження */
flsFunctions.addTouchClass();
flsFunctions.addLoadedClass();

/*
Модуль "Спойлери" (details/summary)
Документація: https://template.fls.guru/template-docs/modul-spojlery.html
Футер на мобільному + FAQ на сторінці продукту
*/
flsFunctions.spollers();

/* Слайдер галереї продукту (Swiper) */
import "./files/sliders.js";

/* Шапка: клас _header-scroll після прокрутки */
import * as flsScroll from "./files/scroll/scroll.js";
flsScroll.headerScroll();

/* Динамічний адаптив: переносимо кнопку "Request a demo" у мобільне меню */
import "./libs/dynamic_adapt.js";

/* Свій код: меню з доступністю, відправка форми */
// Поява блоків при прокручуванні (data-watch)
import "./libs/watcher.js";

import "./files/script.js";
