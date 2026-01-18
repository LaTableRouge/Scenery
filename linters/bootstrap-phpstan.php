<?php

/**
 * Bootstrap file for PHPStan
 * Loads all PHP files from the inc directory to make classes available for static analysis
 * Also provides WooCommerce stubs for static analysis
 */

define('IS_VITE_DEVELOPMENT', false);
define('VITE_SERVER', 'http://localhost:5173');

define('DIST_FOLDER', 'build');
define('DIST_PATH', DIST_FOLDER);

