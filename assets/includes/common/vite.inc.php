<?php

require_once 'variables.inc.php';

function vite_fetch_asset_from_manifest($filePath) {
    $returnedArray = [];

    $fileName = basename($filePath);
    $fileNameWithoutExtension = substr($fileName, 0, strrpos($fileName, '.'));

    // Use manifest json to know which asset to enqueue
    if (file_exists(DIST_PATH . '/manifest.json')) {
        $manifest = json_decode(file_get_contents(DIST_PATH . '/manifest.json'), true);

        if (is_array($manifest)) {
            $manifest_keys = array_keys($manifest);
            $fileKey = null;
            foreach ($manifest_keys as $key => $asset) {
                if (strpos($asset, $fileName) !== false) {
                    $fileKey = $asset;
                    break;
                }
            }

            if ($fileKey && isset($manifest[$fileKey])) {
                $returnedArray = [
                    'path' => DIST_PATH . "/{$manifest[$fileKey]['file']}",
                ];

                // In case of scss files included in Javascript
                if (isset($manifest[$fileKey]['css']) && !empty($manifest[$fileKey]['css'])) {
                    foreach ($manifest[$fileKey]['css'] as $css) {
                        $returnedArray['css'][] = DIST_PATH . "/{$css}";
                    }
                }
            }
        }
    }

    return $returnedArray;
}

function vite_enqueue_style($filePath) {
    if (defined('IS_VITE_DEVELOPMENT') && IS_VITE_DEVELOPMENT === true) {
        /*
        * ================================ Inject assets in DOM
        * insert link tag for styles
        */
        echo '<link rel="stylesheet" href="' . VITE_SERVER . '/' . $filePath . '">';
    } else {
        /*
        * ================================ Call assets like usual
        */
        $manifestFileInfos = vite_fetch_asset_from_manifest($filePath);
        if (!empty($manifestFileInfos)) {
            $path = $manifestFileInfos['path'];
            echo '<link rel="stylesheet" type="text/css" href="' . $path . '">';
        } else {
            echo "No build file found for asset \"{$filePath}\"";
            die();
        }
    }
}

function vite_enqueue_script($filePath, $inHead = false) {
    $defer = $inHead ? 'defer="true"' : '';

    if (defined('IS_VITE_DEVELOPMENT') && IS_VITE_DEVELOPMENT === true) {
        /*
        * ================================ Inject assets in DOM
        * insert script tag for scripts
        */
        echo '<script type="module" crossorigin src="' . VITE_SERVER . '/' . $filePath . '"></script>';
    } else {
        /*
        * ================================ Call assets like usual
        */
        $manifestFileInfos = vite_fetch_asset_from_manifest($filePath);
        if (!empty($manifestFileInfos)) {
            if (isset($manifestFileInfos['css'])) {
                foreach ($manifestFileInfos['css'] as $cssPath) {
                    echo '<link rel="stylesheet" type="text/css" href="' . $cssPath . '">';
                }
            }

            $path = $manifestFileInfos['path'];
            echo '<script ' . $defer . ' type="text/javascript" src="' . $path . '"></script>';
        } else {
            echo "No build file found for asset \"{$filePath}\"";
            die();
        }
    }
}
