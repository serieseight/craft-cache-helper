# Cache Helper (Craft 3)

This plugin injects HTML and JS into any Formie forms to help with cached fields (e.g. get query param or cookie)

## Requirements

This plugin requires Craft CMS 3.1.0 or later, and PHP 7.1.0 or later.

## Usage

This plugin will use Formie hooks if you're using `form.render()` (you should be).

If you're not using `form.render()` and rendering the form your own way, make sure you have `{% hook 'formie.form.end' %}` at the end of your form.

## Installation
Open your terminal and run the following commands

```
# Go to project directory
cd /path/to/project

# Tell Composer to load the plugin
composer require serieseight/craft-cache-helper:v3

# Tell Craft to install the plugin
./craft plugin/install cache-helper
```
