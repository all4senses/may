<?php


/**
 * Implements hook_preprocess_user_profile();
 */
/*
function may_preprocess_user_profile(&$profile) {
  //dpm($profile);
}
*/


/**
 * Implements theme_link();
 * 
 * Add rel=nofollow to external links.
 */
function may_link($variables) {
  if (strpos($variables['path'], '://') && !strpos($variables['path'], 'ttp://may.all4senses.com')) {
    if (empty($variables['options']['attributes']['rel'])) {
      $variables['options']['attributes']['rel'] = 'nofollow';
    }
    else {
      
      if(is_array($variables['options']['attributes']['rel'])) {
        $rels = '';
        foreach($variables['options']['attributes']['rel'] as $rel) {
          $rels .= ($rels ? ' ' : '') . $rel;
        }
        $variables['options']['attributes']['rel'] = $rels;
      }

      if (strpos($variables['options']['attributes']['rel'], 'nofollow') === FALSE) {
        $variables['options']['attributes']['rel'] .= ' nofollow';
      }

    }
  }
  return '<a href="' . check_plain(url($variables['path'], $variables['options'])) . '"' . drupal_attributes($variables['options']['attributes']) . '>' . ($variables['options']['html'] ? $variables['text'] : check_plain($variables['text'])) . '</a>';
}


/**
 * Implements hook_preprocess_user_picture();
 */
function may_preprocess_user_picture(&$picture) {
  // Remove a link from a picture.
  if (!isset($picture['account']->picture->uri)) {
    return;
  }
  if (!empty($picture['account']->realname)) {
    $realname = $picture['account']->realname;
  }
  else {
    $userExtendedData = may_misc_loadUserExtendedData($picture['account']->uid);
    $realname = $userExtendedData->realname;
  }
  $picture['user_picture'] = theme('image_style', array( 'path' =>  $picture['account']->picture->uri, 'style_name' => 'avatar_profile_page', 'alt' => $realname, 'title' => $realname, 'attributes' => array('rel' => 'v:photo')));
}


/**
 * Returns HTML for the "next page" link in a query pager.
 *
 * @param $variables
 *   An associative array containing:
 *   - text: The name (or image) of the link.
 *   - element: An optional integer to distinguish between multiple pagers on
 *     one page.
 *   - interval: The number of pages to move forward when the link is clicked.
 *   - parameters: An associative array of query string parameters to append to
 *     the pager links.
 *
 * @ingroup themeable
 */
function may_pager_next($variables) {
  // Add a next rel metatag.
  $out = theme_pager_next($variables);
  if ($out) {
    $out_altered = str_replace('&amp;', '&', $out);
    if(preg_match('|.*href="([^"]*)" .*title="([^"]*)" .*|', $out_altered, $matches) && !empty($matches[1])) {
      
      //dpm('out in next = ' . $out_altered);
      //dpm($matches);

      if ($matches[2] == 'Go to next page') {
        may_misc_addMetatag('next', NULL, $href = 'http://may.all4senses.com' . $matches[1]);
      }
    }
  }
  return $out;
}


/**
 * Returns HTML for the "previous page" link in a query pager.
 *
 * @param $variables
 *   An associative array containing:
 *   - text: The name (or image) of the link.
 *   - element: An optional integer to distinguish between multiple pagers on
 *     one page.
 *   - interval: The number of pages to move backward when the link is clicked.
 *   - parameters: An associative array of query string parameters to append to
 *     the pager links.
 *
 * @ingroup themeable
 */
function may_pager_previous($variables) {
  // Add a prev rel metatag.
  $out = theme_pager_previous($variables);
  if ($out) {
    $out_altered = str_replace('&amp;', '&', $out);
    if(preg_match('|.*href="([^"]*)" .*title="([^"]*)" .*|', $out_altered, $matches) && !empty($matches[1])) {

      //dpm('out in prev = ' . $out_altered);
      //dpm($matches);
      
      if ($matches[2] == 'Go to previous page') {
        may_misc_addMetatag('prev', NULL, $href = 'http://may.all4senses.com' . $matches[1]);
      }
      
    }
  }
  return $out;
}


/**
 * Returns HTML for a query pager.
 *
 * Menu callbacks that display paged query results should call theme('pager') to
 * retrieve a pager control so that users can view other results. Format a list
 * of nearby pages with additional query results.
 *
 * @param $variables
 *   An associative array containing:
 *   - tags: An array of labels for the controls in the pager.
 *   - element: An optional integer to distinguish between multiple pagers on
 *     one page.
 *   - parameters: An associative array of query string parameters to append to
 *     the pager links.
 *   - quantity: The number of pages in the list.
 *
 * @ingroup themeable
 */
function may_pager($variables) {

  
  $arg_0 = arg(0);
  $arg_1 = arg(1);
  $altered_pager_posts = array('user', 'news', 'blog', 'about-voip-services', 'taxonomy');
  
  if ((in_array($arg_0, $altered_pager_posts)) || @$_SERVER['REDIRECT_URL'] == '/articles') {
    $newer_link_title = '‹ Newer Posts';
    $older_link_title = 'Older Posts ›';
  }
  else {
    return theme_pager($variables);
  }
  
  $tags = $variables['tags'];
  $element = $variables['element'];
  $parameters = $variables['parameters'];
  $quantity = $variables['quantity'];
  global $pager_page_array, $pager_total;

  $li_previous = theme('pager_previous', array('text' => (isset($tags[1]) ? $tags[1] : $newer_link_title), 'element' => $element, 'interval' => 1, 'parameters' => $parameters));
  $li_next = theme('pager_next', array('text' => (isset($tags[3]) ? $tags[3] : $older_link_title), 'element' => $element, 'interval' => 1, 'parameters' => $parameters));
  
  if ($li_previous) {
    $items[] = array(
      'class' => array('pager-previous'),
      'data' => $li_previous,
    );
  
  }
  if ($li_next) {
    
    $items[] = array(
      'class' => array('pager-next'),
      'data' => $li_next,
    );

  }
    
  
  if (empty($items)) {
    return NULL;
  }
  else {
    return '<h2 class="element-invisible">' . t('Pages') . '</h2>' 
          . theme('item_list', array(
            'items' => $items,
            'attributes' => array('class' => array('pager')),
          ));
  }
  
  
  
  // Original.
  /*
  
  // Calculate various markers within this pager piece:
  // Middle is used to "center" pages around the current page.
  $pager_middle = ceil($quantity / 2);
  // current is the page we are currently paged to
  $pager_current = $pager_page_array[$element] + 1;
  // first is the first page listed by this pager piece (re quantity)
  $pager_first = $pager_current - $pager_middle + 1;
  // last is the last page listed by this pager piece (re quantity)
  $pager_last = $pager_current + $quantity - $pager_middle;
  // max is the maximum page number
  $pager_max = $pager_total[$element];
  // End of marker calculations.

  // Prepare for generation loop.
  $i = $pager_first;
  if ($pager_last > $pager_max) {
    // Adjust "center" if at end of query.
    $i = $i + ($pager_max - $pager_last);
    $pager_last = $pager_max;
  }
  if ($i <= 0) {
    // Adjust "center" if at start of query.
    $pager_last = $pager_last + (1 - $i);
    $i = 1;
  }
  // End of generation loop preparation.

  $li_first = theme('pager_first', array('text' => (isset($tags[0]) ? $tags[0] : t('« first')), 'element' => $element, 'parameters' => $parameters));
  $li_previous = theme('pager_previous', array('text' => (isset($tags[1]) ? $tags[1] : t('‹ previous')), 'element' => $element, 'interval' => 1, 'parameters' => $parameters));
  $li_next = theme('pager_next', array('text' => (isset($tags[3]) ? $tags[3] : t('next ›')), 'element' => $element, 'interval' => 1, 'parameters' => $parameters));
  $li_last = theme('pager_last', array('text' => (isset($tags[4]) ? $tags[4] : t('last »')), 'element' => $element, 'parameters' => $parameters));

  if ($pager_total[$element] > 1) {
    if ($li_first) {
      $items[] = array(
        'class' => array('pager-first'),
        'data' => $li_first,
      );
    }
    if ($li_previous) {
      $items[] = array(
        'class' => array('pager-previous'),
        'data' => $li_previous,
      );
    }

    // When there is more than one page, create the pager list.
    if ($i != $pager_max) {
      if ($i > 1) {
        $items[] = array(
          'class' => array('pager-ellipsis'),
          'data' => '…',
        );
      }
      // Now generate the actual pager piece.
      for (; $i <= $pager_last && $i <= $pager_max; $i++) {
        if ($i < $pager_current) {
          $items[] = array(
            'class' => array('pager-item'),
            'data' => theme('pager_previous', array('text' => $i, 'element' => $element, 'interval' => ($pager_current - $i), 'parameters' => $parameters)),
          );
        }
        if ($i == $pager_current) {
          $items[] = array(
            'class' => array('pager-current'),
            'data' => $i,
          );
        }
        if ($i > $pager_current) {
          $items[] = array(
            'class' => array('pager-item'),
            'data' => theme('pager_next', array('text' => $i, 'element' => $element, 'interval' => ($i - $pager_current), 'parameters' => $parameters)),
          );
        }
      }
      if ($i < $pager_max) {
        $items[] = array(
          'class' => array('pager-ellipsis'),
          'data' => '…',
        );
      }
    }
    // End generation.
    if ($li_next) {
      $items[] = array(
        'class' => array('pager-next'),
        'data' => $li_next,
      );
    }
    if ($li_last) {
      $items[] = array(
        'class' => array('pager-last'),
        'data' => $li_last,
      );
    }
    return '<h2 class="element-invisible">' . t('Pages') . '</h2>' . theme('item_list', array(
      'items' => $items,
      'attributes' => array('class' => array('pager')),
    ));
  }
  */
}


/**
 * Implements hook_preprocess_search_results().
 */
function may_preprocess_search_results(&$variables) {
  
//  // a4s - fix - show lost pager from the results page on some pages.
//  // need prior actions (hack) in function node_search_execute() at node.module
//  // v1
//  //doesn't work correctly - it create bad links like http://may.all4senses.com/search/node/sip%20trunking?page=0%2C0%2C0%2C0%2C0%2C0%2C0%2C1
//  $variables['pager'] = theme('pager', array('tags' => NULL, 'element' => 7));

  
  
  // a4s - fix - show lost pager from the results page on some pages.
  // need prior actions (hack) in function node_search_execute() at node.module
  // v2
  global $may_num_rows, $may_limit_rows;
//  dpm('$may_num_rows =' . $may_num_rows, '$may_limit_rows = ' . $may_limit_rows);
//  dpm($_SESSION['may_node_search_data']);
//  $page = pager_default_initialize($_SESSION['may_node_search_data']['may_num_rows'], $_SESSION['may_node_search_data']['may_limit_rows']);
  $page = pager_default_initialize($may_num_rows, $may_limit_rows);
  $variables['pager'] = theme('pager', array('tags' => NULL));
 
}


/**
 * Implements hook_html_head_alter().
 * We are overwriting the default meta character type tag with HTML5 version.
 */
function may_html_head_alter(&$head_elements) {
  $head_elements['system_meta_content_type']['#attributes'] = array(
    'charset' => 'utf-8'
  );
  
  // Set right order for main metatags.
  
  
  $head_elements['system_meta_content_type']['#weight'] = -8;
  
  
  if (isset($head_elements['metatag_description'])) {
    $head_elements['metatag_description']['#weight'] = -15;
  }
  if (isset($head_elements['description'])) {
    $head_elements['description']['#weight'] = -15;
  }
  if (isset($head_elements['metatag_keywords'])) {
    $head_elements['metatag_keywords']['#weight'] = -14;
  }
  if (isset($head_elements['keywords'])) {
    $head_elements['keywords']['#weight'] = -14;
  }
  if (isset($head_elements['news_keywords'])) {
    $head_elements['news_keywords']['#weight'] = -13;
  }

  
  
  // Quick fix for Metatag, where the local node metatag title for some reason doesnt apply to the page metatag title.
  // Hope it will be solved with the newer version of the Metatag module.
  if (!empty($head_elements['name']['#attributes']['content'])) {
    // Will be used in html.tpl.php
    global $altered_head_title;
    $altered_head_title = $head_elements['name']['#attributes']['content'];
  }
  
  
  
  
  
  $current_page = NULL;
  
  // Remove a canonical tag if there next or prev tags are present.
  if (!empty($head_elements['next']) || !empty($head_elements['prev'])) {
    unset($head_elements['metatag_canonical']);
    
    
    // Define the number of a current page.
    if (!empty($head_elements['next'])) {
      $next = explode('?', $head_elements['next']['#attributes']['href']);
      //dpm($next);
      foreach (explode('&', $next[1]) as $param) {
        $param = explode('=', $param);
        if ($param[0] == 'page') {
          $current_page = ($param[1] - 1) + 1;
          break;
        }
      }
    }
    else {
      $prev = explode('?', $head_elements['prev']['#attributes']['href']);
      if (isset($prev[1])) {
        foreach (explode('&', $prev[1]) as $param) {
          $param = explode('=', $param);
          if ($param[0] == 'page') {
            $current_page = ($param[1] + 1) + 1;
            break;
          }
        }
      }
      else {
        $current_page = 2;
      }
      
      
    }

    if ($current_page > 1) {
      
      // Define a current page title
      if (!empty($head_elements['name']['#attributes']['content'])) {
        $current_title = $head_elements['name']['#attributes']['content'];
      }
      else {
        $current_title = drupal_get_title();
      }

      $current_title = str_replace(' - May', '', $current_title);

      // Will be used in html.tpl.php
      global $altered_head_title;
      
      $altered_head_title = $current_title . ' - Page ' . $current_page . ' - May';
      
      if (isset($head_elements['metatag_description'])) {
        $head_elements['metatag_description']['#value'] = 'Page ' . $current_page . ' - ' . $head_elements['metatag_description']['#value'];
      }
      if (isset($head_elements['description'])) {
        $head_elements['description']['#attributes']['content'] = 'Page ' . $current_page . ' - ' . $head_elements['description']['#attributes']['content'];
      }
      //dpm('$altered_head_title = ' . $altered_head_title);
//      global $user;
//      if ($user->uid == 1) {
//        may_misc_addMetatag('title', $altered_head_title);
//      }
    }
  }
  
  
  // Hide keywords metatag from all the site.
  if (isset($head_elements['metatag_keywords'])) {
    unset($head_elements['metatag_keywords']);
  }
  if (isset($head_elements['keywords'])) {
    unset($head_elements['keywords']);
  }
  if (isset($head_elements['news_keywords'])) {
    unset($head_elements['news_keywords']);
  }
  
  // Add a OG:Description metatag
  if (!empty($head_elements['metatag_description']['#value'])) {
    $head_elements['metatag_og_description'] = array(
      '#type' => 'html_tag',
      '#tag' => 'meta',
      '#attributes' => array(
          'property' => 'og:description',
          'content' => $head_elements['metatag_description']['#value'],
      ),
    );
  }
  
 // <meta name="verify-a" value="5c21728cee5f71b74ae4"> 
  $head_elements['verify-a'] = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array(
        'name' => 'verify-a',
        'value' => '5c21728cee5f71b74ae4',
    ),
  );
  
  // Remove tags 'dc:title' and 'sioc:num_replies' from pages
  if (isset($head_elements['rdf_node_title'])) {
    unset($head_elements['rdf_node_title']);
  }
  if (isset($head_elements['rdf_node_comment_count'])) {
    unset($head_elements['rdf_node_comment_count']);
  }
  
  // Add og:url by recomendation of Facebook's developer tool
  if (isset($head_elements['metatag_canonical'])) {
    $head_elements['og:url'] = array(
      '#type' => 'html_tag',
      '#tag' => 'meta',
      '#attributes' => array(
          'property' => 'og:url',
          'content' => $head_elements['metatag_canonical']['#value'],
      ),
    );
  }
  
      
}


/**
 * Duplicate of theme_menu_local_tasks() but adds clearfix to tabs.
 */
function may_menu_local_tasks(&$variables) {
  $output = '';

  if (!empty($variables['primary'])) {
    $variables['primary']['#prefix'] = '<h3 class="element-invisible">' . t('Primary tabs') . '</h3>';
    $variables['primary']['#prefix'] .= '<ul class="tabs primary clearfix">';
    $variables['primary']['#suffix'] = '</ul>';
    $output .= drupal_render($variables['primary']);
  }
  if (!empty($variables['secondary'])) {
    $variables['secondary']['#prefix'] = '<h3 class="element-invisible">' . t('Secondary tabs') . '</h3>';
    $variables['secondary']['#prefix'] .= '<ul class="tabs secondary clearfix">';
    $variables['secondary']['#suffix'] = '</ul>';
    $output .= drupal_render($variables['secondary']);
  }
  return $output;
}


/*
function may_preprocess_breadcrumb(&$variables) {
  dpm($variables);
}
*/


/**
 * Return a themed breadcrumb trail.
 *
 * @param $breadcrumb
 *   An array containing the breadcrumb links.
 * @return a string containing the breadcrumb output.
 */
function may_breadcrumb($variables) {
  $breadcrumb = $variables['breadcrumb'];

  if (!empty($breadcrumb)) {
    // Provide a navigational heading to give context for breadcrumb links to
    // screen-reader users. Make the heading invisible with .element-invisible.
    $heading = '<h3 class="element-invisible">' . t('You are here') . '</h3>';
    // Uncomment to add current page to breadcrumb
	// $breadcrumb[] = drupal_get_title();
    return '<nav itemprop="breadcrumb" class="breadcrumb">' . $heading . implode(' » ', $breadcrumb) . '</nav>';
  }
}


/**
 * Override or insert variables into the page template.
 */
function may_process_page(&$variables) {
  
  //$variables['breadcrumb'] = theme('breadcrumb', array('breadcrumb' => drupal_get_breadcrumb()));
  //array(l(t('Home'), NULL), l(t('Blogs'), 'blog'), l(t("!name's blog", array('!name' => format_username($node))), 'blog/' . $node->uid))
  
  if(isset($variables['node'])) {
    $variables['theme_hook_suggestions'][] = 'page__' . $variables['node']->type;
  }
  
  // Set breadcrumb
  $not_teasers_types = array('preface', 'admin_page', 'page', 'quote', 'webform');
  
  //dpm($_SERVER);
  //dpm(arg());
  
  if(@$_SERVER['REQUEST_URI'] == '/') {
    $variables['breadcrumb'] = ''; // Home page has no bredcrumb.
  }
  elseif(isset($variables['node']) && !in_array($variables['node']->type, $not_teasers_types) ) {
    //dpm($variables['node']);
    //dpm('teasers node------------');
    switch ($variables['node']->type) {
      case 'article':
        $variables['breadcrumb'] = theme('breadcrumb', array('breadcrumb' => array(l('Home', NULL), l('Articles', 'articles'), l('Library', 'about-voip-services'), $variables['node']->title )));
        break;
      case 'blog_post':
        $variables['breadcrumb'] = theme('breadcrumb', array('breadcrumb' => array(l('Home', NULL), l('Articles', 'articles'), l('Blog', 'blog'), $variables['node']->title )));
        break;
    }
  }
  /**/
  elseif(strpos($_SERVER['REQUEST_URI'], '/tags/') != FALSE) {
    //dpm('Tag page ------------');
    
    // Don't show anything yet.
    //$variables['breadcrumb'] = '';
    
    // Defined in
    global $current_tag_title;
    
    /**/
    {
      $variables['breadcrumb'] = theme('breadcrumb', array('breadcrumb' => array(l('Home', NULL), l('News', 'news'), l('News tags', 'news/tags'), $current_tag_title )));
    }
    /**/
  }
  elseif ($breadcrumb = may_misc_getMenuTrail()) {
    //dpm('Page VIA MENU------------');
    $variables['breadcrumb'] = $breadcrumb;
  }
  elseif (isset($variables['node'])) {
    //dpm('Any other NODE page------------');
    $variables['breadcrumb'] = theme('breadcrumb', array('breadcrumb' => array(l('Home', NULL), $variables['node']->title )));
  }
  elseif (arg(0) == 'user' && is_int($arg_uid = arg(1))) {
    //dpm('User profile page------------');
    $userExtendedData = may_misc_loadUserExtendedData($arg_uid);
    $variables['breadcrumb'] = theme('breadcrumb', array('breadcrumb' => array(l('Home', NULL), l('About Us', 'about-us'), l('Our Team', 'our-team'), $userExtendedData->realname )));
  }
  else {
    //dpm('Any other NOT node page------------');
    $variables['breadcrumb'] = '';
  }

}


/**
 * Override or insert variables into the node template.
 */
function may_preprocess_node(&$variables) {
  $variables['submitted'] = t('Published by !username on !datetime', array('!username' => $variables['name'], '!datetime' => $variables['date']));
  if ($variables['view_mode'] == 'full' && node_is_page($variables['node'])) {
    $variables['classes_array'][] = 'node-full';
  }
  if(isset($variables['node'])) {
    
    if($variables['node']->type == 'blog_post' || $variables['node']->type == 'news_post') {
      $variables['theme_hook_suggestions'][] = 'node__article';
    }
    elseif($variables['node']->type == 'webform') {
      $variables['theme_hook_suggestions'][] = 'node__admin_page';
    }
    // Custom 404 page.
    elseif($variables['node']->type == 'preface' && @$variables['node']->field_preface_key['und'][0]['value'] == 'page-not-found') {
      $variables['theme_hook_suggestions'][] = 'node__preface__page404';
    }
    
  }
  
}


/**
 * Preprocess variables for region.tpl.php
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("region" in this case.)
 */
function may_preprocess_region(&$variables, $hook) {
  // Use a bare template for the content region.
  if ($variables['region'] == 'content') {
    $variables['theme_hook_suggestions'][] = 'region__bare';
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
function may_preprocess_block(&$variables, $hook) {
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
function may_process_block(&$variables, $hook) {
  // Drupal 7 should use a $title variable instead of $block->subject.
  $variables['title'] = $variables['block']->subject;
}

/**
 * Changes the search form to use the "search" input element of HTML5.
 */
function may_preprocess_search_block_form(&$vars) {
  $vars['search_form'] = str_replace('type="text"', 'type="search"', $vars['search_form']);
}

/**
 * Changes the search button label. Here... because it doesn't work via module hook.
 */
function may_form_alter(&$form, &$form_state, $form_id) {
  if ($form_id == 'search_block_form') {
    
    $form['actions']['submit']['#value'] = '';
    
    // Autohiding hint.
    $default_search_text = t('Search Site Here');
    $form['search_block_form']['#default_value'] = $default_search_text;
    $form['default_text']['#default_value'] = $default_search_text;
    // Cause a fatal error without it for anonymous.
    $form['default_text']['#type'] = 'hidden';
    
    
    // Example! Does NOT work!!! The above one works!
    //$form['search_block_form']['#value'] = t($default_search_text); // Set a default value for the textfield
    
    // Add extra attributes to the text box
    // Without this a hint autohiding will not work for anonymous.
    $form['search_block_form']['#attributes']['onblur'] = "if (this.value == '') {this.value = '$default_search_text';}";
    $form['search_block_form']['#attributes']['onfocus'] = "if (this.value == '$default_search_text') {this.value = '';}";
  }
}


function may_username($object) {
  return str_replace(' ('. t('not verified') .')', '', theme_username($object));
}


/**
* Default theme function for all RSS rows.
*/
function may_preprocess_views_view_rss(&$vars) {
  $namespaces = $vars['view']->style_plugin->namespaces;
  $disabled_namespaces = array('content', 'dc', 'foaf', 'og', 'rdfs', 'sioc', 'sioct', 'skos', 'xsd', 'xmlns:addthis');
  foreach ($disabled_namespaces as $disabled_namespace) {
    if (isset($namespaces[$disabled_namespace])) {
      unset($namespaces[$disabled_namespace]);
    }
  }
  $vars['namespaces'] = '';
  foreach ($namespaces as $key => $value) {
    $vars['namespaces'] .= ' ' . $key . '="' . $value . '"';
  }
}


/**
* Default theme function for all RSS rows.
*/
function may_preprocess_views_view_row_rss(&$vars) {
  
  $node = $vars['view']->style_plugin->row_plugin->nodes[$vars['row']->nid];
  //$vars['description'] = check_plain(htmlspecialchars_decode($node->field_a_teaser['und'][0]['value']));
  if (isset($node->body['und'][0]['value'])) {
    $rss_teaser = may_misc_getArticleTeaserData('all', $node->body['und'][0]['value'], $vars['row']->nid, 400, TRUE);
    // Clear attribute typeof="foaf:Image" from the img tag (which iss added by the core rdf module via hook_preprocess_image).
    $rss_teaser = preg_replace('|typeof="foaf:Image" |', '', $rss_teaser);
    // Convert relative links to absolute.
    $rss_teaser = preg_replace('|href="/|', 'href="http://may.all4senses.com/', $rss_teaser);
    // Restore a normal state of a YouTube url from a token.
    // [video: http://www.youtube.com/watch?v=SoMS77zE7iE]
    $rss_teaser =   preg_replace('|\[video:.*(http.*)\]|', '<a href="$1"> [Watch a video] </a>', $rss_teaser);
    $vars['description'] = check_plain(htmlspecialchars_decode($rss_teaser));
  }
  
  // Replace username with real user name for <dc:creator>
  $vars['item_elements'] = preg_replace('|<dc:creator>.*</dc:creator>|', '<dc:creator>' . may_misc_getUserRealName($node->uid) . '</dc:creator>', $vars['item_elements']);
}


/**
 * Theme function for a CAPTCHA element.
 * 
 * a4s rename CAPTCHA to Captcha
 *
 * Render it in a fieldset if a description of the CAPTCHA
 * is available. Render it as is otherwise.
 */
/*
function may_captcha($variables) {
  $element = $variables['element'];
  if (!empty($element['#description']) && isset($element['captcha_widgets'])) {
    $fieldset = array(
      '#type' => 'fieldset',
      '#title' => t('Captcha'),
      '#description' => $element['#description'],
      '#children' => drupal_render_children($element),
      '#attributes' => array('class' => array('captcha')),
    );
    return theme('fieldset', array('element' => $fieldset));
  }
  else {
    return '<div class="captcha">' . drupal_render_children($element) . '</div>';
  }
}
*/


function may_preprocess_html(&$variables) {

  // Load the media queries styles
  // Remember to rename these files to match the names used here - they are
  // in the CSS directory of your subtheme.
//  $media_queries_css = array(
//    'may_orange.responsive.style.css',
//    'may_orange.responsive.gpanels.css'
//  );
//  load_subtheme_media_queries($media_queries_css, 'may_orange');


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
//  load_subtheme_ie_styles($ie_files, 'may_orange');

  
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
 
