# Cache Helper

This plugin injects HTML and JS into any Formie forms to help with cached fields (e.g. get query param or cookie)

## Requirements

This plugin requires Craft CMS 4.5.0 or later, and PHP 8.0.2 or later.

## Usage

This plugin will use Formie hooks if you're using `form.render()` (you should be).

If you're not using `form.render()` and rendering the form your own way, make sure you have `{% hook 'formie.form.end' %}` at the end of your form.

## Installation
Open your terminal and run the following commands

```
# Go to project directory
cd /path/to/project

# Add this git repo to composer.json
composer config repositories.craft-cache-helper git https://github.com/serieseight/craft-cache-helper.git

# Tell Composer to load the plugin
composer require serieseight/craft-cache-helper:dev-main@dev

# Tell Craft to install the plugin
./craft plugin/install _cache-helper
```

## Extra info

- The plugin handle is `_cache-helper`. The underscore (`_`) means the plugin is private. Private plugins are excluded from license verification (and ineligible for listing on the plugin store)
