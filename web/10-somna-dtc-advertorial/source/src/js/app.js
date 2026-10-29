/*
Somna advertorial + listicle — збірка "Чертоги Фрілансера" (FLS start template).
Підключаємо тільки потрібні модулі шаблону.
*/
window['FLS'] = false;

import "../scss/style.scss";
import * as flsFunctions from "./files/functions.js";

flsFunctions.addTouchClass();
flsFunctions.addLoadedClass();

/* FAQ на details/summary — модуль "Спойлери" */
flsFunctions.spollers();

/* Свій код: липка кнопка, вибір комплекту */
import "./files/script.js";
