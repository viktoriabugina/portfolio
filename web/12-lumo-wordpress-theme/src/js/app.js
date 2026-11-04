/*
Lumo — збірка на основі "Чертоги Фрілансера" (FLS start template): Gulp + Webpack, SCSS, BEM.
Рух стриманий: Lenis (плавний скрол), заголовок по словах, паралакс фото, поява блоків, легкий нахил карток.
*/
window['FLS'] = false;

import "../scss/style.scss";
import Lenis from "lenis";

const root = document.documentElement;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* 1. Заголовок по словах */
document.querySelectorAll(".lumo-split").forEach((el) => {
	if (reduce || !el.textContent.trim()) return;
	const text = el.textContent.trim();
	el.setAttribute("aria-label", text);
	el.textContent = "";
	text.split(/\s+/).forEach((word, i, all) => {
		const mask = document.createElement("span");
		mask.className = "lumo-word";
		mask.setAttribute("aria-hidden", "true");
		const inner = document.createElement("span");
		inner.style.setProperty("--i", i);
		inner.textContent = word;
		mask.appendChild(inner);
		el.appendChild(mask);
		if (i < all.length - 1) el.appendChild(document.createTextNode(" "));
	});
});

/* 2. Поява блоків */
window.lumoRevealReady = true;
const items = document.querySelectorAll(".lumo-reveal, .lumo-reveal-group");
if (items.length && "IntersectionObserver" in window) {
	root.classList.add("lumo-js");
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					io.unobserve(entry.target);
				}
			});
		},
		{ rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
	);
	items.forEach((item) => io.observe(item));
}

/* 3. Шапка: лінія після прокручування + паралакс фото */
const header = document.querySelector(".lumo-header");
const parallax = [...document.querySelectorAll(".lumo-parallax")];
const update = () => {
	const y = window.scrollY;
	if (header) header.classList.toggle("is-scrolled", y > 8);
	if (reduce) return;
	const vh = window.innerHeight;
	parallax.forEach((el) => {
		const r = el.getBoundingClientRect();
		if (r.bottom < -100 || r.top > vh + 100) return;
		const p = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
		el.style.setProperty("--p", p.toFixed(3));
	});
};
update();

/* 4. Lenis: плавний скрол (вимкнено при "менше руху") */
if (!reduce) {
	const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
	lenis.on("scroll", update);
	const raf = (time) => {
		lenis.raf(time);
		requestAnimationFrame(raf);
	};
	requestAnimationFrame(raf);
	document.querySelectorAll('a[href^="#"]').forEach((a) => {
		a.addEventListener("click", (e) => {
			const target = document.querySelector(a.getAttribute("href"));
			if (target) {
				e.preventDefault();
				lenis.scrollTo(target, { offset: -70 });
			}
		});
	});
} else {
	window.addEventListener("scroll", update, { passive: true });
}

/* 5. Легкий нахил фото-карток від курсора (лише миша) */
if (fine && !reduce) {
	document.querySelectorAll(".lumo-zoom").forEach((el) => {
		el.addEventListener("pointermove", (e) => {
			const r = el.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width - 0.5;
			const y = (e.clientY - r.top) / r.height - 0.5;
			el.classList.add("is-tilting");
			el.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
			el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
		});
		el.addEventListener("pointerleave", () => {
			el.classList.remove("is-tilting");
			el.style.setProperty("--rx", "0deg");
			el.style.setProperty("--ry", "0deg");
		});
	});
}
