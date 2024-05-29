init();

function init() {
  const formieForms = document.querySelectorAll('.fui-form');
  for(const form of formieForms) {
    updateTokens(form);
  }

  for(const form of (window.dynamicForms || [])) {
    updateDynamic(form);
  }
}

function updateTokens(form) {
  const formConfigRaw = form.getAttribute('data-fui-form');
  if(!formConfigRaw) return;
  const formConfig = JSON.parse(formConfigRaw);
  if(!formConfig || !formConfig.formHandle) return;
  // update tokens using built-in Formie function
  document.addEventListener('onFormieInit', (e) => {
    let Formie = e.detail.formie;
    Formie.refreshForCache(formConfig.formHashId)
  })
  if(formConfig.settings.submitMethod === 'page-reload') {
    // before submission add a query parameter to break the cache of the success message
    form.addEventListener('onFormieValidate', e => {
      const params = new URLSearchParams(location.search)
      if(params.get('form') === null) params.append('form', '')
      history.replaceState({}, '', `?${params.toString().replace(/=$|=(?=&)/g, '')}`)
    })
  }
}

function updateDynamic(form) {
  for(const field of form.fields) {
    switch(field.type) {
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
      case 'prePopulate':
      case 'query':
        const params = new URLSearchParams(location.search);
        if(field.className === 'verbb\formie\fields\formfields\Checkboxes') {
          updateCheckboxes(form.parent, field.handle, [params.get(`${field.queryParam}`)]);
          updateCheckboxes(form.parent, field.handle, params.getAll(`${field.queryParam}[]`));
        } else if(field.className === 'verbb\formie\fields\formfields\Entries') {
          updateElement(form.parent, field.handle, params.get(field.queryParam));
        } else {
          updateField(form.parent, field.handle, params.get(field.queryParam));
        }
        break;
    }
  }
}

function updateField(el, handle, value) {
  const field = el.querySelector(`[name="fields\[${handle}\]"]`);
  if(!field) return;
  field.value = value;
}

function updateElement(el, handle, value) {
  const field = el.querySelector(`[name="fields\[${handle}\][]"]`);
  if(!field) return;
  field.value = value;
}

function updateCheckboxes(el, handle, values = []) {
  if(values.length) {
    // unselect checkboxes
    el.querySelectorAll(`[name="fields\[${handle}\][]"]`).forEach(checkbox => checkbox.checked = false);

    // select other checkboxes
    values.forEach(value => {
      const checkbox = el.querySelector(`[name="fields\[${handle}\][]"][value="${value}"]`);
      if(!checkbox) return;
      checkbox.checked = true;
    })
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if(parts.length === 2) return parts.pop().split(';').shift();
}

window.dynamicFormsInit = function() {
  init();
}