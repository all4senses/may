<?php

/**
 * @file
 * Plugin to provide the unix time property contex.
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
  // Keyword to use for %substitution.
  'keyword'           => 'utime',
  // The unique identifier for this context for use by required context checks.
  'context name'      => 'adyax_test_context_utime',
  // Provides a list of items which are exposed as keywords.
  'convert list'      => 'adyax_test_context_utime_convert_list', //array('utime_odd' => t('Unix time is odd, not even'), 'utime_even' => t('Unix time is even, not odd'),), //
  // Convert keywords into data.
  'convert'           => 'adyax_test_context_utime_convert',
);

/**
 * Function to create context.
 */
function adyax_test_context_utime_form($empty, $data = NULL, $conf = FALSE) {
  $context = new ctools_context('adyax_test_context_utime');
  $context->plugin = 'adyax_test_context_utime';
  
  if ($empty) {
    return $context;
  }
  
  $time = time();
  $context->title = $data;
  $context->argument = $data;
  $context->data = new stdClass();
  $context->data->time = $time;
  $context->data->even = ($time % 2 == 0) ? TRUE : FALSE;
  $context->data->description = ($context->data->even ? 'Time is even' : 'Time is odd') . ' (' . $time . ')';
  return $context;
}


/**
 * Convert a context into a string.
 */
function adyax_test_context_utime_convert($context, $type) {
  switch ($type) {
    case 'utime_time':
      return $context->data->time;
    
    case 'utime_even':
      return $context->data->even;
      
    case 'utime_descr':
      return $context->data->description;  
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
    'utime_time' => t('Unix time'),
    'utime_even' => t('Unix time is even, not odd'),
    'utime_descr' => t('Unix time context result description'),  
  );
}
