<?php
/**
 * @file
 * template.php
 */

// Русский...





/**
 * Return a themed breadcrumb trail.
 *
 * @param $breadcrumb
 *   An array containing the breadcrumb links.
 * @return a string containing the breadcrumb output.
 */
function zp_bootstrap_breadcrumb($variables) {
  
  //return zp_misc_setBreadcrumbs($variables);
  
  $breadcrumb = $variables['breadcrumb'];
  
  // And finally add a current place without a link.
  if (!empty($breadcrumb)) {
  
    global $zp_current_trail;
    
    $args = arg();
    //dpm($args);
    //dpm($breadcrumb);
    //dpm($zp_current_trail);
    
    // Clear the last breadcramb item if it's array.
//    foreach ($breadcrumb as $key => $value) {
//      if (is_array($value) && !empty($value['data'])) {
//        //$breadcrumb[$key] = $value['data'];
//        //drupal_set_title($breadcrumb[$key]);
//        unset($breadcrumb[$key]);
//        
//      }
//    }
    
    // For depts or products...
    if (in_array($args[0], array('d', 'dp')) || strpos($_SERVER['REQUEST_URI'], '/p/') !== FALSE) {
      
//      // Remove Home link
//      if (strpos($breadcrumb[0], 'Home') !== FALSE) {
//        //unset($breadcrumb[0]);
//        array_shift($breadcrumb);
//      }
      ////array_unshift($breadcrumb, 'Home');
      //dpm($breadcrumb);
      // For depts with products
      // Put facets breadcrumbs AFTER a current dept title, 
      // and add a link to a current title, if there are any facets breadcrumbs
      if ($args[0] == 'dp') {
        
        $zp_current_trail_count = count($zp_current_trail);
        //dpm('$zp_current_trail_count = ' . $zp_current_trail_count);
        // Get a parent of a current dept
        $parent_dept_breadcrumb_index = $zp_current_trail_count - 2;
        //dpm('$parent_dept_breadcrumb_index = ' .  $parent_dept_breadcrumb_index);
        
        // Assure that the index of the parent dept is the same in trail and breadcrumb
        if (strpos($breadcrumb[$parent_dept_breadcrumb_index], '>' . @$zp_current_trail[$parent_dept_breadcrumb_index]['link_title'] . '<') !== FALSE) {
          //dpm('1111');
          if (empty($breadcrumb[$zp_current_trail_count - 1])) {
            //dpm('22222');
            // Do nothing, because we dont have here not the current title, nor facets breadcrumb...
            // Just add a current dept title for the last (current) breadcrumb.
            $breadcrumb[] = $zp_current_trail[$zp_current_trail_count - 1]['link_title'];
          }
          elseif (strpos($breadcrumb[$zp_current_trail_count - 1], '>' . $zp_current_trail[$zp_current_trail_count - 1]['link_title'] . '<') === FALSE) {
            //dpm('33333');
            // the last crumb is defined but it's not the current title
            // We have facet breadcrumb(s) injected here.
            // So we insert our current dept title as breadcrumb after the parent dept and before facets breadcrumb.
            // And we add a link to the current dept title... because that way we set a link to reset (remove) facets user choice.
            $breadcrumb = zp_misc_array_insert_after($parent_dept_breadcrumb_index, $breadcrumb, $parent_dept_breadcrumb_index + 1, l($zp_current_trail[$zp_current_trail_count - 1]['link_title'], $zp_current_trail[$zp_current_trail_count - 1]['link_path']));
          }
          
        } // End of if (strpos($breadcrumb[$parent_dept_breadcrumb_index], '>' . $zp_current_trail[$parent_dept_breadcrumb_index]['link_title'] . '<') !== FALSE) {
        else {
          // Something wrong... trail and breadcrumb are not the same
          // So we do nothing here...
        }

      } // End of if ($args[0] == 'dp') {
      else {
        $breadcrumb[] = drupal_get_title();
      }
      
      // Remove Home link
      if (strpos($breadcrumb[0], 'Home') !== FALSE) {
        //unset($breadcrumb[0]);
        array_shift($breadcrumb);
      }
      
    } // End of if (in_array($args[0], array('d', 'dp', 'p'))) {
    else {
      // Adding the title of the current page to the breadcrumb.
      $breadcrumb[] = drupal_get_title();
    }
    
    //dpm($breadcrumb);
    
    // Provide a navigational heading to give context for breadcrumb links to
    // screen-reader users. Make the heading invisible with .element-invisible.
    $heading = '<h3 class="element-invisible">' . t('You are here') . '</h3>';
    // Uncomment to add current page to breadcrumb
	// $breadcrumb[] = drupal_get_title();
    return '<nav itemprop="breadcrumb" class="breadcrumb">' . $heading . implode(' » ', $breadcrumb) . '</nav>';
  }
  
}


/**
 * Override or insert variables into the block templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
function zp_bootstrap_preprocess_block(&$variables, $hook) {
  //dpm($variables);
  // Use a bare template for the page's main content.
  if ($variables['block_html_id'] == 'block-system-main') {
    $variables['theme_hook_suggestions'][] = 'block__bare';
  }

  $variables['title_attributes_array']['class'][] = 'block-title';
  
  // add odd/even zebra classes into the array of classes
  $variables['classes_array'][] = $variables['block_zebra'];
  if ($variables['block_id'] == 1) {
    $variables['classes_array'][] = 'first';
  }
}


/**
 * Override or insert variables into the block templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
function zp_bootstrap_process_block(&$variables, $hook) {
  //dpm($variables);
  // Drupal 7 should use a $title variable instead of $block->subject.
  if (!empty($variables['block']->subject)) {
    $variables['title'] = $variables['block']->subject;
  }
}


function zp_bootstrap_username($object) {
  return str_replace(' ('. t('not verified') .')', '', theme_username($object));
}


/**
 * Preprocess and Process Functions SEE: http://drupal.org/node/254940#variables-processor
 * 2. Uncomment the required function to use.
 * 3. Read carefully, especially within gv_orange_preprocess_html(), there
 *    are extra goodies you might want to leverage such as a very simple way of adding
 *    stylesheets for Internet Explorer and a browser detection script to add body classes.
 */
function zp_bootstrap_preprocess_html(&$vars) {
  // Load the media queries styles
  // Remember to rename these files to match the names used here - they are
  // in the CSS directory of your subtheme.
//  $media_queries_css = array(
//    'gv_orange.responsive.style.css',
//    'gv_orange.responsive.gpanels.css'
//  );
//  load_subtheme_media_queries($media_queries_css, 'gv_orange');


//  * Load IE Stylesheets
//  *
//  * AT automates adding IE stylesheets, simply add to the array using
//  * the conditional comment as the key and the stylesheet name as the value.
//  *
//  * See our online help: http://adaptivethemes.com/documentation/working-with-internet-explorer
//  *
//  * For example to add a stylesheet for IE8 only use:
//  *
//  *  'IE 8' => 'ie-8.css',
//  *
//  * Your IE CSS file must be in the /css/ directory in your subtheme.
  
//  Uncomment to add a conditional stylesheet for IE 7 or less.
//  $ie_files = array(
//    'lte IE 7' => 'ie-lte-7.css',
//  );
//  load_subtheme_ie_styles($ie_files, 'gv_orange');

  
  // Add class for the active theme name
  // Uncomment to add a class for the active theme name.
  //$vars['classes_array'][] = drupal_html_class($theme_key);
  
  // Works!
  global $user;
  if ($user->uid == 1 || ($user->uid && in_array('administrator', $user->roles)) ) {
    $vars['classes_array'][] = 'admin';
  }
  elseif ($user->uid && in_array('writer', $user->roles) ) {
    $vars['classes_array'][] = 'writer';
  }
  else {
    $vars['classes_array'][] = 'not-admin';
  }
  
  global $body_classes_add;
  if (!empty($body_classes_add)) {
    $vars['classes_array'] += $body_classes_add;
  }

  // Browser/platform sniff - adds body classes such as ipad, webkit, chrome etc.
  //Uncomment to add a classes for the browser and platform.
  //$vars['classes_array'][] = css_browser_selector();

}

/**
 * a4s
 * Workaround for Block menu module within Bootstrap
 * https://www.drupal.org/node/1850194#comment-8551799
 * Overrides theme_menu_link().
 */
function zp_bootstrap_menu_link__menu_block($variables) {
  return theme_menu_link($variables);
}
