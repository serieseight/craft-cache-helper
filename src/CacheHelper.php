<?php

namespace serieseight\cachehelper;

use Craft;
use craft\base\Plugin;
use serieseight\cachehelper\assetbundles\CacheHelperBundle;

/**
 * Cache Helper plugin
 *
 * @method static CacheHelper getInstance()
 */
class CacheHelper extends Plugin
{
    public function init(): void
    {
        parent::init();

        $this->attachEventHandlers();
    }

    private function attachEventHandlers(): void
    {
        // Check Formie plugin is installed
        if(Craft::$app->plugins->isPluginEnabled('formie')) {
            Craft::$app->getView()->hook('formie.form.end', function(array &$context) {
                // Register asset bundle into view
                // See assetbundles/CacheHelperBundle to see what this loads (JS/CSS)
                // At time of writing it only injects resources/cache-helper.js
                $context['view']->registerAssetBundle(CacheHelperBundle::class);

                return $context['view']->renderTemplate('_cache-helper/_caching.twig', [
                    'form' => $context['form'],
                ]);
            });
        }
    }
}
