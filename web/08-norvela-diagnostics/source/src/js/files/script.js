// Підключення функціоналу "Чертоги Фрілансера"
import { bodyLock, bodyUnlock } from "./functions.js";

//========================================================================================================================================================
// Мобільне меню: aria-expanded, Esc, пастка фокусу, закриття по кліку на пункт
//========================================================================================================================================================
const menuButton = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.menu__body');
const html = document.documentElement;

function isMenuOpen() {
	return html.classList.contains('menu-open');
}
function openMenu() {
	html.classList.add('menu-open');
	bodyLock(0);
	menuButton.setAttribute('aria-expanded', 'true');
	menuButton.setAttribute('aria-label', 'Close menu');
	const firstLink = menuBody.querySelector('a');
	firstLink && firstLink.focus();
}
function closeMenu(returnFocus = true) {
	html.classList.remove('menu-open');
	bodyUnlock(0);
	menuButton.setAttribute('aria-expanded', 'false');
	menuButton.setAttribute('aria-label', 'Open menu');
	returnFocus && menuButton.focus();
}
if (menuButton && menuBody) {
	menuButton.addEventListener('click', () => isMenuOpen() ? closeMenu() : openMenu());
	// Клік по пункту меню — закриваємо (переходи по якорях)
	menuBody.addEventListener('click', (e) => {
		if (e.target.closest('a') && isMenuOpen()) closeMenu(false);
	});
	document.addEventListener('keydown', (e) => {
		if (!isMenuOpen()) return;
		if (e.key === 'Escape') {
			closeMenu();
			return;
		}
		// Пастка фокусу: Tab ходить тільки по меню та кнопці закриття
		if (e.key === 'Tab') {
			const focusable = [menuButton, ...menuBody.querySelectorAll('a, button')];
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	});
	// Якщо екран став ширшим за мобільний — закриваємо меню
	matchMedia('(min-width: 768px)').addEventListener('change', (mq) => {
		if (mq.matches && isMenuOpen()) closeMenu(false);
	});
}

//========================================================================================================================================================
// Форма заявки: валідація, Turnstile, відправка на /api/contact (Cloudflare Pages Function)
//========================================================================================================================================================
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setFieldError(input, show) {
	const error = document.getElementById(`${input.id}-error`);
	input.setAttribute('aria-invalid', show ? 'true' : 'false');
	if (error) {
		error.hidden = !show;
		show ? input.setAttribute('aria-describedby', error.id) : input.removeAttribute('aria-describedby');
	}
}
function validate(form) {
	let firstInvalid = null;
	form.querySelectorAll('[required]').forEach((input) => {
		const value = input.value.trim();
		const invalid = !value || (input.type === 'email' && !EMAIL_RE.test(value));
		setFieldError(input, invalid);
		if (invalid && !firstInvalid) firstInvalid = input;
	});
	return firstInvalid;
}

document.querySelectorAll('[data-request-form]').forEach((form) => {
	const status = form.querySelector('.form-request__status');
	const submit = form.querySelector('[type="submit"]');
	const submitText = submit.textContent;

	// Помилка зникає, щойно людина виправляє поле
	form.addEventListener('input', (e) => {
		if (e.target.getAttribute('aria-invalid') === 'true') setFieldError(e.target, false);
	});

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		status.className = 'form-request__status';
		status.textContent = '';

		const firstInvalid = validate(form);
		if (firstInvalid) {
			firstInvalid.focus();
			return;
		}
		// Honeypot: якщо поле заповнене — це бот, тихо "успішно" виходимо
		if (form.company_website && form.company_website.value) return;

		submit.disabled = true;
		submit.textContent = 'Sending…';
		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: new FormData(form),
				headers: { 'Accept': 'application/json' }
			});
			const isJson = (response.headers.get('content-type') || '').includes('application/json');
			if (!isJson) {
				// Статичне прев'ю без серверної функції (404/405/501, HTML у відповідь) — демо-повідомлення
				showStatus(status, 'success', 'Thanks! This is a demo page, so nothing was sent. On the live site this request goes to the clinic’s CRM.');
				form.reset();
			} else {
				const data = await response.json().catch(() => ({}));
				if (response.ok && data.success !== false) {
					showStatus(status, 'success', 'Thanks! We’ll reply within one business day.');
					form.reset();
				} else {
					showStatus(status, 'error', data.message || 'Something went wrong. Try again or email hello@norvela.example.');
				}
			}
		} catch (err) {
			if (!window.turnstile) {
				// Прев'ю в пісочниці без мережі й Turnstile — показуємо демо-повідомлення
				showStatus(status, 'success', 'Thanks! This is a demo page, so nothing was sent. On the live site this request goes to the clinic’s CRM.');
				form.reset();
			} else {
				showStatus(status, 'error', 'Couldn’t send your request. Check your connection and try again.');
			}
		} finally {
			submit.disabled = false;
			submit.textContent = submitText;
			// Новий токен Turnstile для наступної відправки
			if (window.turnstile) window.turnstile.reset(form.querySelector('.cf-turnstile'));
		}
	});
});

function showStatus(el, type, message) {
	el.classList.add(`form-request__status--${type}`);
	el.textContent = message;
}
