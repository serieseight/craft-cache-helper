<?php

namespace serieseight\cachehelper\assetbundles;

use craft\web\AssetBundle;

class CacheHelperBundle extends AssetBundle
{
    public function init()
    {
        $this->sourcePath = '@serieseight/cachehelper/resources';

        $this->js = [
            'cache-helper.js',
        ];

		$this->jsOptions = [
			'defer' => true,
		];

        parent::init();
    }
}
