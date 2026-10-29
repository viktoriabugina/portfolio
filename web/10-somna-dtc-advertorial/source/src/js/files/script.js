//========================================================================================================================================================
// Липка кнопка на мобільному: показуємо, коли заголовок статті пішов з екрана,
// і ховаємо, коли на екрані офер або блок оформлення (щоб не дублювати CTA)
//========================================================================================================================================================
const sticky = document.querySelector('[data-sticky-cta]');
const header = document.querySelector('.article__header');
const targets = document.querySelectorAll('.offer, .checkout, .footer');

if (sticky && header && 'IntersectionObserver' in window) {
	let headerVisible = true;
	const visibleTargets = new Set();
	const update = () => {
		sticky.classList.toggle('_visible', !headerVisible && visibleTargets.size === 0);
	};
	new IntersectionObserver(([entry]) => {
		headerVisible = entry.isIntersecting;
		update();
	}).observe(header);
	const targetObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			entry.isIntersecting ? visibleTargets.add(entry.target) : visibleTargets.delete(entry.target);
		});
		update();
	});
	targets.forEach((el) => targetObserver.observe(el));
}

//========================================================================================================================================================
// Вибір комплекту: оновлюємо суму на кнопці, сабміт показує демо-повідомлення
//========================================================================================================================================================
document.querySelectorAll('[data-bundle-form]').forEach((form) => {
	const total = form.querySelector('[data-bundle-total]');
	const status = form.querySelector('.checkout__status');
	form.addEventListener('change', (e) => {
		if (e.target.name === 'bundle') {
			total.textContent = `$${e.target.dataset.price}`;
			status.textContent = '';
		}
	});
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const choice = form.querySelector('input[name="bundle"]:checked');
		const count = choice.value === '1' ? '1 mask' : `${choice.value} masks`;
		status.textContent = `Demo page: on a live store, ${count} for $${choice.dataset.price} would go to the Shopify checkout here.`;
	});
});
