<?php
/**
 * @file
 * The primary PHP file for this theme.
 */


/**
 * Implements hook_preprocess_page().
 */
function bootstrap_may_preprocess_page(&$variables) {
  //dpm($variables);
  
  if ($variables['is_front']) {
    //drupal_add_js(libraries_get_path('select2').'/select2.js');
    $libraries = libraries_get_libraries();
    dpm($libraries);
  }
}
