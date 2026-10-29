// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

// Доступність бургер-меню: синхронізуємо aria-expanded з класом menu-open
const menuButton = document.querySelector('.icon-menu');
if (menuButton) {
	new MutationObserver(() => {
		menuButton.setAttribute('aria-expanded', document.documentElement.classList.contains('menu-open') ? 'true' : 'false');
	}).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}
