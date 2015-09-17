<?php


/**
 * @file
 * Ctools tontent type plugin for displaying the current unix time property (even or odd).
 *
 */

/**
 * Plugins are described by creating a $plugin array which will be used
 * by the system that includes this file.
 */
$plugin = array(
  'title' => t('The current Unix time property'),
  'description' => t('Show if the current unix time is even or odd'),
  'render callback' => 'adyax_test_text_content_type_render',
  'category' => t('Adyax ctools test'), // Категория, в которой будет находиться плагин.
  'required context' => new ctools_context_required(t('adyax_test_context_utime'), 'adyax_test_context_utime'),  
  'single' => TRUE,
); 


/**
 * Render callback for the content type.
 */
function adyax_test_text_content_type_render($subtype, $conf, $args, $context) {

  $block = new stdClass();
  $block->content = $context->data->even ? 'FALSE' : 'TRUE';

  return $block;
}