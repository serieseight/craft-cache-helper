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
