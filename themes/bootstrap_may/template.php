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
//  if (drupal_get_path_alias("node/{$variables['#node']->nid}") == 'foo') {
//    drupal_add_css(drupal_get_path('theme', 'MYTHEME') . "/css/foo.css");
//  }
    
    //dpm($variables, '$variables');
    //$node_parallax_js = drupal_get_path('module', 'may_pages') . '/js/parallax/pn' . $variables['nid']. '.js';
    //dpm('js is ' . $node_parallax_js);
    //return;
//    if (file_exists($node_parallax_js)) {
//        //dpm('added js ' . $node_parallax_js);
//        drupal_add_js($node_parallax_js);
//    }
}


function bootstrap_may_process_html($variables) {
    dpm($variables, 'process_html');
    
    
    $variables['styles']= '<style>
@import url("http://a4s-local.m-a-y.ru/modules/system/system.base.css?oe89tl");
</style>
<style>
@import url("http://a4s-local.m-a-y.ru/modules/contextual/contextual.css?oe89tl");
</style>
<style>
@import url("http://a4s-local.m-a-y.ru/modules/field/theme/field.css?oe89tl");
@import url("http://a4s-local.m-a-y.ru/modules/node/node.css?oe89tl");
@import url("http://a4s-local.m-a-y.ru/sites/all/modules/_Views/views/css/views.css?oe89tl");
@import url("http://a4s-local.m-a-y.ru/sites/all/modules/_Image/lazyloader/lazyloader.css?oe89tl");
@import url("http://a4s-local.m-a-y.ru/sites/all/modules/_Editor/ckeditor/css/ckeditor.css?oe89tl");
@import url("http://a4s-local.m-a-y.ru/sites/all/modules/_Menu/admin_menu/admin_menu.css?oe89tl");
@import url("http://a4s-local.m-a-y.ru/sites/all/modules/_Menu/admin_menu/admin_menu.uid1.css?oe89tl");
@import url("http://a4s-local.m-a-y.ru/sites/all/modules/_Menu/admin_menu/admin_menu_toolbar/admin_menu_toolbar.css?oe89tl");
@import url("http://a4s-local.m-a-y.ru/modules/shortcut/shortcut.css?oe89tl");
</style>
<style>
@import url("http://a4s-local.m-a-y.ru/sites/all/modules/_Other/ctools/css/ctools.css?oe89tl");
</style>
<style>.jquery_colorpicker_color_display_12_0_c4ed96{background-color:#c4ed96;}
.jquery_colorpicker_color_display_12_0_eda5ed{background-color:#eda5ed;}
</style>
<style>
@import url("http://a4s-local.m-a-y.ru/sites/all/themes/bootstrap_may/css/style.css");
@import url("http://a4s-local.m-a-y.ru/sites/all/themes/bootstrap_may/css/style_custom.css");
</style>';
}