<?php

/**
 * @file
 * Plugin to provide a taxonomy_term_add_form context
 */

/**
 * Plugins are described by creating a $plugin array which will be used
 * by the system that includes this file.
 */
$plugin = array(
  // Visible title.
  'title'             => t('Unix time property'),
  // Description of context.
  'description'       => t('Unix time add or even'),
  // Function to create context.
  'context'           => 'adyax_test_context_utime_form',
  // Plugin settings form.
  //'edit form'         => 'adyax_test_context_utime_form_settings_form',
  // Keyword to use for %substitution.
  'keyword'           => 'utime',
  // The unique identifier for this context for use by required context checks.
  'context name'      => 'utime_odd_or_even',
  // Provides a list of items which are exposed as keywords.
  'convert list'      => 'adyax_test_context_utime_convert_list',
  // Convert keywords into data.
  'convert'           => 'adyax_test_context_utime_convert',
  // Placeholder form is used in panels preview, for example.
//  'placeholder form'  => array(
//    '#type'         => 'textfield',
//    '#description'  => t('Enter the taxonomy vocabulary.'),
//  ),
);

/**
 * It's important to remember that $conf is optional here, because contexts
 * are not always created from the UI.
 */
function adyax_test_context_utime_form($empty, $data = NULL, $conf = FALSE) {
  $context = new ctools_context('utime_odd_or_even');
  $context->plugin = 'utime_odd_or_even';

  
  if ($empty) {
    return $context;
  }
  
  $context->title = $data;
  $context->argument = $data;
  // Make up a bogus context
  $context->data = new stdClass();
  $context->data->odd = time();//t("Item1");
  //$context->data->item2 = t("Item2");

  // For this simple item we'll just create our data by stripping non-alpha and
  // adding '_from_simplecontext_argument' to it.
  //$context->data->description = preg_replace('/[^a-z]/i', '', $data);
  //$context->data->description .= '_from_simplecontext_argument';
  //$context->arg_length = strlen($context->argument);
  return $context;
}


/**
 * Convert a context into a string.
 */
function adyax_test_context_utime_convert($context, $type) {
  switch ($type) {
    // Convert a vocabulary keyword into the data.
    case 'odd':
      return $context->data->odd . '_xxx';
  }
}




/**
 * Provide a list of sub-keywords.
 *
 * This is used to provide keywords from the context for use in a content type,
 * pane, etc.
 */
function adyax_test_context_utime_convert_list() {
  return array(
    'odd' => t('Unix time is odd, not even'),
  );
}
