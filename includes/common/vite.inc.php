<?php

/**
 * Vite integration for custom PHP application
 *
 * @package Scenery
 * @subpackage Vite
 */

declare(strict_types=1);

class Vite {
    private const VITE_SERVER = 'http://localhost:5173';
    private const DIST_FOLDER = 'build';
    private string $distPath;

    public function __construct() {
        $this->distPath = self::DIST_FOLDER;
    }

    /**
     * Fetch asset information from Vite manifest
     *
     * @param string $filePath Path to the file relative to src directory
     * @return array{
     *  path?: string,
     *  css?: array<string>
     * }
     */
    public function fetchAssetFromManifest(string $filePath): array {
        $returnedArray = [];

        $fileName = basename($filePath);
        $manifestPath = $this->distPath . '/.vite/manifest.json';

        if (!file_exists($manifestPath)) {
            return $returnedArray;
        }

        /** @var array<string, array{file: string, css?: array<string>}> $manifest */
        $manifest = json_decode(file_get_contents($manifestPath), true);

        if (!is_array($manifest)) {
            return $returnedArray;
        }

        $fileKey = array_reduce(
            array_keys($manifest),
            fn(?string $carry, string $asset) => str_contains($asset, $fileName) ? $asset : $carry,
            null
        );

        if ($fileKey && isset($manifest[$fileKey])) {
            $returnedArray = [
                'path' => $this->distPath . "/{$manifest[$fileKey]['file']}",
            ];

            if (isset($manifest[$fileKey]['css']) && !empty($manifest[$fileKey]['css'])) {
                foreach ($manifest[$fileKey]['css'] as $css) {
                    $returnedArray['css'][] = $this->distPath . "/{$css}";
                }
            }
        }

        return $returnedArray;
    }

    /**
     * Enqueue style assets
     *
     * @param string $filePath Path to the file relative to src directory
     * @return void
     */
    public function enqueueStyle(string $filePath): void {
        $isDev = defined('IS_VITE_DEVELOPMENT') && IS_VITE_DEVELOPMENT;
        $viteServer = defined('VITE_SERVER') ? VITE_SERVER : self::VITE_SERVER;

        if ($isDev) {
            printf(
                '<link rel="stylesheet" href="%s">',
                htmlspecialchars($viteServer . '/' . $filePath, ENT_QUOTES, 'UTF-8')
            );

            return;
        }

        $manifestFileInfos = $this->fetchAssetFromManifest($filePath);
        if (empty($manifestFileInfos)) {
            printf('No build file found for asset "%s"', htmlspecialchars($filePath, ENT_QUOTES, 'UTF-8'));

            return;
        }

        $path = $manifestFileInfos['path'];
        printf(
            '<link rel="stylesheet" type="text/css" href="%s">',
            htmlspecialchars($path, ENT_QUOTES, 'UTF-8')
        );
    }

    /**
     * Enqueue script assets
     *
     * @param string $filePath Path to the file relative to src directory
     * @param bool $inHead Whether to add defer attribute (for head placement)
     * @return void
     */
    public function enqueueScript(string $filePath, bool $inHead = false): void {
        $isDev = defined('IS_VITE_DEVELOPMENT') && IS_VITE_DEVELOPMENT;
        $viteServer = defined('VITE_SERVER') ? VITE_SERVER : self::VITE_SERVER;
        $defer = $inHead ? ' defer="true"' : '';

        if ($isDev) {
            printf(
                '<script type="module" crossorigin src="%s"></script>',
                htmlspecialchars($viteServer . '/' . $filePath, ENT_QUOTES, 'UTF-8')
            );

            return;
        }

        $manifestFileInfos = $this->fetchAssetFromManifest($filePath);
        if (empty($manifestFileInfos)) {
            printf('No build file found for asset "%s"', htmlspecialchars($filePath, ENT_QUOTES, 'UTF-8'));

            return;
        }

        // Enqueue associated CSS files first
        if (isset($manifestFileInfos['css'])) {
            foreach ($manifestFileInfos['css'] as $cssPath) {
                printf(
                    '<link rel="stylesheet" type="text/css" href="%s">',
                    htmlspecialchars($cssPath, ENT_QUOTES, 'UTF-8')
                );
            }
        }

        $path = $manifestFileInfos['path'];
        printf(
            '<script%s type="text/javascript" src="%s"></script>',
            $defer,
            htmlspecialchars($path, ENT_QUOTES, 'UTF-8')
        );
    }
}
