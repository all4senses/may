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
   
    //drupal_add_js('sites/all/libraries/jquery.plugins/_parallax/scrolly/jquery.scrolly.js');
    
    drupal_add_js('sites/all/libraries/jquery.plugins/_parallax/jquery-data-parallax---kasparsj---a4s/jquery.requestAnimationFrame.min.js');
    drupal_add_js('sites/all/libraries/jquery.plugins/_parallax/jquery-data-parallax---kasparsj---a4s/jquery.data-parallaxx---a4s.js');
    drupal_add_js('sites/all/libraries/jquery.plugins/_parallax/jquery-data-parallax---kasparsj---a4s/jquery.easing.1.3.plus_one_argument.js');
    
    drupal_add_js('sites/all/libraries/jquery.plugins/_parallax/jquery.parallax-scroll---gsgd/js/jquery.parallax-scroll---a4s.js');
    
    
//    $path_to_custom_js = drupal_get_path('module', 'may_pages') . '/js/';
//    drupal_add_js($path_to_custom_js . 'may_home_parallax.js');
    
    
    //drupal_add_library('contextual','contextual-links');
    
  }
}





function bootstrap_may_preprocess_node($variables) {

    //drupal_add_css(path_to_theme(). "/file.css", "theme");
    //drupal_add_css(drupal_get_path('theme', 'MYTHEME') . "/css/foo.css");

    
    //dpm($variables, '$variables');
    //$node_parallax_js = drupal_get_path('module', 'may_pages') . '/js/parallax/pn' . $variables['nid']. '.js';
    //dpm('js is ' . $node_parallax_js);
//    if (file_exists($node_parallax_js)) {
//        //dpm('added js ' . $node_parallax_js);
//        drupal_add_js($node_parallax_js);
//    }
    
    
    
}


function bootstrap_may_process_html(&$variables) {
    // Remove Query Strings from CSS filenames (CacheBuster) 
    //$variables['styles'] = preg_replace('/.css\?.*"/','.css"', $variables['styles']); 
    $variables['styles'] = preg_replace('/style_custom.css\?.*"/','style_custom.css"', $variables['styles']); 

}