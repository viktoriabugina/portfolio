/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * 1. Перевіряє токен Cloudflare Turnstile на сервері (без цього капча не захищає).
 * 2. Валідує поля та відкидає ботів (honeypot).
 * 3. Пересилає заявку у CRM через вебхук і/або в Web3Forms на пошту.
 *
 * Змінні середовища (Pages → Settings → Environment variables):
 *   TURNSTILE_SECRET   — секретний ключ Turnstile
 *   CRM_WEBHOOK_URL    — вебхук CRM (HubSpot, Pipedrive, Zapier, Make тощо), необов'язково
 *   WEB3FORMS_KEY      — ключ Web3Forms для листа на пошту, необов'язково
 */
const json = (body, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function onRequestPost({ request, env }) {
	let form;
	try {
		form = await request.formData();
	} catch {
		return json({ success: false, message: 'Invalid request.' }, 400);
	}

	// Honeypot: люди це поле не бачать
	if (form.get('company_website')) return json({ success: true });

	const data = {
		name: String(form.get('name') || '').trim().slice(0, 200),
		email: String(form.get('email') || '').trim().slice(0, 200),
		clinic: String(form.get('clinic') || '').trim().slice(0, 200),
		interest: String(form.get('interest') || '').trim().slice(0, 50),
		message: String(form.get('message') || '').trim().slice(0, 4000),
	};
	if (!data.name || !EMAIL_RE.test(data.email)) {
		return json({ success: false, message: 'Enter your name and a valid email.' }, 422);
	}

	// Перевірка Turnstile
	const token = form.get('cf-turnstile-response');
	if (!token) return json({ success: false, message: 'Complete the security check and try again.' }, 400);
	const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: new URLSearchParams({
			secret: env.TURNSTILE_SECRET,
			response: token,
			remoteip: request.headers.get('CF-Connecting-IP') || '',
		}),
	}).then((r) => r.json());
	if (!verify.success) {
		return json({ success: false, message: 'Security check failed. Refresh the page and try again.' }, 403);
	}

	// Відправка: CRM-вебхук та/або лист через Web3Forms
	const jobs = [];
	if (env.CRM_WEBHOOK_URL) {
		jobs.push(
			fetch(env.CRM_WEBHOOK_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data, source: 'website', submittedAt: new Date().toISOString() }),
			})
		);
	}
	if (env.WEB3FORMS_KEY) {
		jobs.push(
			fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({ access_key: env.WEB3FORMS_KEY, subject: `New demo request: ${data.clinic || data.name}`, ...data }),
			})
		);
	}
	const results = await Promise.allSettled(jobs);
	const delivered = results.some((r) => r.status === 'fulfilled' && r.value.ok);
	if (jobs.length && !delivered) {
		return json({ success: false, message: 'We couldn’t send your request. Email hello@norvela.example instead.' }, 502);
	}
	return json({ success: true });
}

