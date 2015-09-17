<?php


/**
 * @file
 * Sample ctools context type plugin that shows how to create a context from an arg.
 *
 */

/**
 * Plugins are described by creating a $plugin array which will be used
 * by the system that includes this file.
 */
$plugin = array(
  'title' => t("Simplecontext 2"),
  'description' => t('A single "simplecontext" context, or data element 2.'),
  'context' => 'adyax_test_context_utime_create_simplecontext_2',  // func to create context
  'context name' => 'simplecontext_2',
  'settings form' => 'simplecontext_2_settings_form',
  'keyword' => 'simplecontext_2',

  // Provides a list of items which are exposed as keywords.
  'convert list' => 'simplecontext_2_convert_list',
  // Convert keywords into data.
  'convert' => 'simplecontext_2_convert',

  'placeholder form' => array(
    '#type' => 'textfield',
    '#description' => t('Enter some data to represent this "simplecontext" 2.'),
  ),
);

/**
 * Create a context, either from manual configuration or from an argument on the URL.
 *
 * @param $empty
 *   If true, just return an empty context.
 * @param $data
 *   If from settings form, an array as from a form. If from argument, a string.
 * @param $conf
 *   TRUE if the $data is coming from admin configuration, FALSE if it's from a URL arg.
 *
 * @return
 *   a Context object/
 */
function adyax_test_context_utime_create_simplecontext_2($empty, $data = NULL, $conf = FALSE) {
  $context = new ctools_context('simplecontext_2');
  $context->plugin = 'simplecontext_2';

  if ($empty) {
    return $context;
  }

  if ($conf) {
    if (!empty($data)) {
      $context->data = new stdClass();
      // For this simple item we'll just create our data by stripping non-alpha and
      // adding '_from_configuration_item_1' to it.
      $context->data->item1_2 = t("Item1_2");
      $context->data->item2_2 = t("Item2_2");
      $context->data->description = preg_replace('/[^a-z]/i', '', $data['sample_simplecontext_setting_2']);
      $context->data->description .= '_from_configuration_sample_simplecontext_setting';
      $context->title = t("Simplecontext context from config 2");
      return $context;
    }
  }
  else {
    // $data is coming from an arg - it's just a string.
    // This is used for keyword.
    $context->title = $data;
    $context->argument = $data;
    // Make up a bogus context
    $context->data = new stdClass();
    $context->data->item1 = t("Item1_1_2"); // time();
    $context->data->item2 = t("Item2_2_2");

    // For this simple item we'll just create our data by stripping non-alpha and
    // adding '_from_simplecontext_argument' to it.
    $context->data->description = preg_replace('/[^a-z]/i', '', $data);
    $context->data->description .= '_from_simplecontext_argument';
    $context->arg_length = strlen($context->argument);
    return $context;
  }
}

function simplecontext_2_settings_form($conf, $external = FALSE) {
  if (empty($conf)) {
    $conf = array(
      'sample_simplecontext_setting_2' => 'default simplecontext setting',
    );
  }
  $form = array();
  $form['sample_simplecontext_setting_2'] = array(
    '#type' => 'textfield',
    '#title' => t('Setting for simplecontext 2'),
    '#size' => 50,
    '#description' => t('An example setting that could be used to configure a context 2'),
    '#default_value' => $conf['sample_simplecontext_setting_2'],
    '#prefix' => '<div class="clear-block no-float">',
    '#suffix' => '</div>',
  );
  return $form;
}



/**
 * Provide a list of sub-keywords.
 *
 * This is used to provide keywords from the context for use in a content type,
 * pane, etc.
 */
function simplecontext_2_convert_list() {
  return array(
    'item1_2' => t('Item1_2'),
    'item2_2' => t('Item2_2'),
    'description' => t('Description'),
  );
}

/**
 * Convert a context into a string to be used as a keyword by content types, etc.
 */
function simplecontext_2_convert($context, $type) {
  switch ($type) {
    case 'item1_2':
      return $context->data->item1_2;
    case 'item2_2':
      return $context->data->item2_2;
    case 'description':
      return $context->data->description;
  }
}

