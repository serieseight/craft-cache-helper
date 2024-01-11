<?php

namespace serieseight\cachehelper;

use Craft;
use craft\base\Plugin;
use serieseight\cachehelper\assetbundles\CacheHelperBundle;
use craft\web\View;
use craft\helpers\Template;

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
                return $this->renderPluginTemplate('_caching.twig', [
                    'form' => $context['form'],
                ]);
            });
        }
    }

    protected function renderPluginTemplate($templatePath, $vars)
    {
        // Stash the old template mode, and set it Control Panel template mode
        $oldMode = Craft::$app->view->getTemplateMode();
        try {
            Craft::$app->view->setTemplateMode(View::TEMPLATE_MODE_CP);
        } catch (Exception $e) {
            Craft::error($e->getMessage(), __METHOD__);
        }

        // Render the template with our vars passed in
        try {
            $htmlText = Craft::$app->view->renderTemplate('_cache-helper/'.$templatePath, $vars);
        } catch (\Exception $e) {
            $htmlText = 'Error rendering template '.$templatePath.' -> '.$e->getMessage();
            Craft::error(Craft::t('_cache-helper', $htmlText), __METHOD__);
        }

        // Restore the old template mode
        try {
            Craft::$app->view->setTemplateMode($oldMode);
        } catch (Exception $e) {
            Craft::error($e->getMessage(), __METHOD__);
        }

        return Template::raw($htmlText);
    }
}
