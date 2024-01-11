init();
function init() {
	const formieForms = document.querySelectorAll('.fui-form');
	for (const form of formieForms) {
		updateTokens(form);
	}

	for (const form of (window.dynamicForms || [])) {
		updateDynamic(form);
	}
}

function updateTokens(form) {
	const formConfigRaw = form.getAttribute('data-fui-form');
	if (!formConfigRaw) return;
	const formConfig = JSON.parse(formConfigRaw);
	if (!formConfig || !formConfig.formHandle) return;
	// update tokens
	fetch(`/actions/formie/forms/refresh-tokens?form=${formConfig.formHandle}`)
		.then(result => result.json())
		.then(result => {
			updateCSRF(form, result);
			updateCaptcha(form, result);
		});
	if (formConfig.settings.submitMethod === 'page-reload') {
		// before submission add a query parameter to break the cache of the success message
		form.addEventListener('onFormieValidate', e => {
			const params = new URLSearchParams(location.search)
			if (params.get('form') === null) params.append('form', '')
			history.replaceState({}, '', `?${params.toString().replace(/=$|=(?=&)/g, '')}`)
		})
	}
}

function updateCSRF(form, result) {
	const csrfEl = form.querySelector('input[name="CRAFT_CSRF_TOKEN"]');
	if (!csrfEl) return;
	csrfEl.outerHTML = result.csrf.input;
}

function updateCaptcha(form, result) {
	if (!result.captchas) return
	if (result.captchas.javascript) {
		const jsCaptchaEl = form.querySelector('input[name="' + result.captchas.javascript.sessionKey + '"]');
		if (jsCaptchaEl) jsCaptchaEl.value = result.captchas.javascript.value;
	}
	if (result.captchas.duplicate) {
		const duplicateCaptchaEl = form.querySelector('input[name="' + result.captchas.duplicate.sessionKey + '"]');
		if (duplicateCaptchaEl) duplicateCaptchaEl.value = result.captchas.duplicate.value;
	}
}

function updateDynamic(form) {
	for (const field of form.fields) {
		switch (field.type) {
			case 'dateUs':
				updateField(
					form.parent,
					field.handle,
					Intl.DateTimeFormat('en-us', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date())
				);
				break;
			case 'dateInt':
				updateField(
					form.parent,
					field.handle,
					Intl.DateTimeFormat('en-gb', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date())
				);
				break;
			case 'currentUrl':
				updateField(form.parent, field.handle, location.origin + location.pathname + location.search);
				break;
			case 'currentUrlNoQueryString':
				updateField(form.parent, field.handle, location.origin + location.pathname);
				break;
			case 'userAgent':
				updateField(form.parent, field.handle, navigator.userAgent);
				break;
			case 'referUrl':
				updateField(form.parent, field.handle, document.referrer);
				break;
			case 'cookie':
				updateField(form.parent, field.handle, getCookie(field.cookieName));
				break;
			case 'query':
				const params = new URLSearchParams(location.search);
				updateField(form.parent, field.handle, params.get(field.queryParam));
				break;
		}
	}
}

function updateField(el, handle, value) {
	const field = el.querySelector(`[name="fields\[${handle}\]"]`);
	if (!field) return;
	field.value = value;
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

window.dynamicFormsInit = function() {
	init();
}