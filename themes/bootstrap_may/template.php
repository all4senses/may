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
    
    drupal_add_js('sites/all/libraries/jquery.plugins/_parallax/scrolly/jquery.scrolly.js');
    
    $path_to_custom_js = drupal_get_path('module', 'may_pages') . '/js/';
    drupal_add_js($path_to_custom_js . 'may_home_parallax.js');
    //drupal_add_library('contextual','contextual-links');
    
  }
}
