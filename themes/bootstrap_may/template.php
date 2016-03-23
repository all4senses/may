<?php
/**
 * @file
 * The primary PHP file for this theme.
 */


/**
 * Implements hook_preprocess_page().
 */
function bootstrap_may_preprocess_page(&$variables) {
  dpm($variables);
}
