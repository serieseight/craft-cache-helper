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
    // update tokens using built-in Formie function
    if(typeof window.Formie !== 'undefined') {
        refreshTokens(form, formConfig, window.Formie);
    } else {
        document.addEventListener('onFormieInit', (e) => {
            refreshTokens(form, formConfig, e.detail.formie);
        })
    }
    if (formConfig.settings.submitMethod === 'page-reload') {
        // before submission add a query parameter to break the cache of the success message
        form.addEventListener('onFormieValidate', e => {
            const params = new URLSearchParams(location.search)
            if (params.get('form') === null) params.append('form', '')
            history.replaceState({}, '', `?${params.toString().replace(/=$|=(?=&)/g, '')}`)
        })
    }
}

function refreshTokens(form, formConfig, Formie) {
    // Check refreshForCache exists. It was added in 2.0.39
    if(typeof Formie.refreshForCache !== 'undefined') {
        Formie.refreshForCache(formConfig.formHashId)
    } else {
        fetch(`/actions/formie/forms/refresh-tokens?form=${formConfig.formHandle}`)
            .then(result => result.json())
            .then(result => {
                updateCSRF(form, result);
                updateCaptcha(form, result);
            });
    }
}

function updateCSRF(form, result) {
    const csrfEl = form.querySelector('input[name="CRAFT_CSRF_TOKEN"]');
    if (!csrfEl) return;
    csrfEl.outerHTML = result.csrf.input;
}

function updateCaptcha(form, result) {
    // Taken from Formie docs
    // https://verbb.io/craft-plugins/formie/docs/template-guides/cached-forms
    if (result.captchas && result.captchas.javascript) {
        let jsCaptcha = result.captchas.javascript;

        form.querySelector('input[name="' + jsCaptcha.sessionKey + '"]').value = jsCaptcha.value;
    }

    if (result.captchas && result.captchas.duplicate) {
        let duplicateCaptcha = result.captchas.duplicate;

        form.querySelector('input[name="' + duplicateCaptcha.sessionKey + '"]').value = duplicateCaptcha.value;
    }

    if (form.form && form.form.formTheme) {
        form.form.formTheme.updateFormHash();
    }
}

function updateDynamic(form) {
    for (const field of form.fields) {
        switch (field.type) {
            case 'dateUs':
                updateField(
                    form.parent,
                    field.handle,
                    Intl.DateTimeFormat('en-us', {month: '2-digit', day: '2-digit', year: 'numeric'}).format(new Date())
                );
                break;
            case 'dateInt':
                updateField(
                    form.parent,
                    field.handle,
                    Intl.DateTimeFormat('en-gb', {month: '2-digit', day: '2-digit', year: 'numeric'}).format(new Date())
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
            case 'prePopulate':
            case 'query':
                const params = new URLSearchParams(location.search);

                switch(field.name) {
                    case 'Checkboxes':
                        updateCheckboxes(form.parent, field.handle, [params.get(`${field.queryParam}`)]);
                        updateCheckboxes(form.parent, field.handle, params.getAll(`${field.queryParam}[]`));
                        break;

                    case 'Radio Buttons':
                        updateRadio(form.parent, field.handle, params.get(field.queryParam));
                        break;

                    case 'Entries':
                        updateElement(form.parent, field.handle, params.get(field.queryParam));
                        break;

                    default:
                        updateField(form.parent, field.handle, params.get(field.queryParam));
                }

                break;
        }
    }
}

function updateField(el, handle, value) {
    const field = el.querySelector(`[name="fields\[${handle}\]"]`);
    if (!field) return;
    field.value = value;
}

function updateElement(el, handle, value) {
    const field = el.querySelector(`[name="fields\[${handle}\][]"]`);
    if (!field) return;
    field.value = value;
}

function updateCheckboxes(el, handle, values = []) {
    if (values.length) {
        // unselect checkboxes
        el.querySelectorAll(`[name="fields\[${handle}\][]"]`).forEach(checkbox => checkbox.checked = false);

        // select other checkboxes
        values.forEach(value => {
            const checkbox = el.querySelector(`[name="fields\[${handle}\][]"][value="${value}"]`);
            if (!checkbox) return;
            checkbox.checked = true;
        })
    }
}

function updateRadio(el, handle, value) {
    const field = el.querySelector(`[name="fields\[${handle}\]"][value="${value}"]`);
    if(!field) return;
    field.checked = true;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

window.dynamicFormsInit = function () {
    init();
}