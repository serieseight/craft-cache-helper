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
    public string $schemaVersion = '1.0.0';

    public function init(): void
    {
        parent::init();

        Craft::$app->onInit(function() {
            $this->attachEventHandlers();
        });
    }

    private function attachEventHandlers(): void
    {
        // Check Formie plugin is installed
        if(Craft::$app->plugins->isPluginEnabled('formie') && Craft::$app->request->getIsSiteRequest()) {
            Craft::$app->view->registerAssetBundle(CacheHelperBundle::class);

            Craft::$app->getView()->hook('formie.form.end', function(array &$context) {
                return $context['view']->renderTemplate('_cache-helper/_caching.twig', [
                    'form' => $context['form'],
                ]);
            });
        }
    }
}
