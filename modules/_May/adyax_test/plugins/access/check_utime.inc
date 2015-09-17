<?php

/**
 * @file
 * Plugin to provide access control based upon the current unix time property (even or odd).
 */

/**
 * Plugins are described by creating a $plugin array which will be used
 * by the system that includes this file.
 */
$plugin = array(
  'title' => t("Adyax test: Check utime"),
  'description' => t('Control access by unix time value.'),
  'callback' => 'adyax_test_check_utime_ctools_access_check',
  'default' => array(),
  'summary' => 'adyax_test_check_utime_ctools_access_summary',
  'required context' => new ctools_context_required(t('adyax_test_context_utime'), 'adyax_test_context_utime'),  
);


/**
 * Main Check for access function.
 */
function adyax_test_check_utime_ctools_access_check($conf, $context) {
  if (empty($context) || empty($context->data) || !isset($context->data->even)) {
    return FALSE;
  }

  return !$context->data->even;
}


/**
 * Provide a summary description based upon the context used.
 */
function adyax_test_check_utime_ctools_access_summary($conf, $context) {
  return 'Unix time must be odd to grant access.';
}

