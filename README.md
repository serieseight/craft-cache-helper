# Cache Helper

This plugin injects HTML and JS into any Formie forms to help with cached fields (e.g. get query param or cookie)

## Requirements

This plugin requires Craft CMS 4.5.0 or later, and PHP 8.0.2 or later.

## Usage

This plugin will use Formie hooks if you're using `form.render()` (you should be).

If you're not using `form.render()` and rendering the form your own way, make sure you have `{% hook 'formie.form.end' %}` at the end of your form.

If you need to reinitialise your forms at any point, you can do so using `window.dynamicFormsInit()`.

## Installation
Open your terminal and run the following commands

```
# Go to project directory
cd /path/to/project

# Tell Composer to load the plugin
composer require serieseight/craft-cache-helper

# Tell Craft to install the plugin
./craft plugin/install cache-helper
```
