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
  'title'             => t('Taxonomy term add form'),
  // Description of context.
  'description'       => t('A taxonomy term add form.'),
  // Function to create context.
  'context'           => 'context_example_create_taxonomy_term_add_form',
  // Plugin settings form.
  'edit form'         => 'context_example_taxonomy_term_add_form_settings_form',
  // Keyword to use for %substitution.
  'keyword'           => 'taxonomy_add',
  // The unique identifier for this context for use by required context checks.
  'context name'      => 'taxonomy_term_add_form',
  // Provides a list of items which are exposed as keywords.
  'convert list'      => array('vocabulary' => t('Taxonomy vocabulary')),
  // Convert keywords into data.
  'convert'           => 'context_example_taxonomy_term_add_form_convert',
  // Placeholder form is used in panels preview, for example.
  'placeholder form'  => array(
    '#type'         => 'textfield',
    '#description'  => t('Enter the taxonomy vocabulary.'),
  ),
);

/**
 * It's important to remember that $conf is optional here, because contexts
 * are not always created from the UI.
 */
function context_example_create_taxonomy_term_add_form($empty, $data = NULL, $conf = FALSE) {
  // We want to create the taxonomy add form, so we need to add the form contexts too.
  $context = new ctools_context(array('form', 'taxonomy_term_add_form'));
  // This is the plugin file name.
  $context->plugin = 'taxonomy_term_add_form';

  // Checking data from settings form.
  if (!empty($data['vocabulary'])) {
    // Get the The vocabulary object.
    $vocabulary = taxonomy_vocabulary_machine_name_load($data['vocabulary']);

    // Validate the taxonomy vocabulary exists and user has administrator access.
    if (!empty($vocabulary) && user_access('administer taxonomy')) {
      $form_state = array('build_info' => array('args' => array(array(), $vocabulary)));
      $form_id    = 'taxonomy_form_term';
      form_load_include($form_state, 'inc', 'taxonomy', 'taxonomy.admin');
      // Build a taxonomy_form_term form.
      $form       = drupal_build_form($form_id, $form_state);

      // All forms should place the form here.
      $context->form       = $form;
      $context->form_id    = $form_id;
      $context->form_title = t('Create a @name term', array('@name' => $vocabulary->name));
      // It's will be used in convert function.
      $context->data       = $data;

      return $context;
    }
  }
}

/**
 * Settings form for context plugin.
 */
function context_example_taxonomy_term_add_form_settings_form($form, &$form_state) {
  $conf         = $form_state['conf'];
  $vocabularies = taxonomy_vocabulary_get_names();
  $options      = array();

  // Provide the settings, where you will be able to select which of vocabularies will be used for taxonomy_term_add form.
  if (!empty($vocabularies)) {
    foreach ($vocabularies as $machine_name => $vocabulary) {
      $options[$machine_name] = $vocabulary->name;
    }

    $form['vocabulary'] = array(
      '#type'           => 'select',
      '#title'          => t('Taxonomy vocabulary'),
      '#description'    => t('Select the taxonomy vocabulary for this form.'),
      '#default_value'  => !empty($conf['vocabulary']) ? $conf['vocabulary'] : '',
      '#required'       => TRUE,
      '#options'        => $options,
    );
  }

  return $form;
}

/**
 * Submit handler for plugin settings form.
 */
function context_example_taxonomy_term_add_form_settings_form_submit($form, &$form_state) {
  $form_state['conf']['vocabulary'] = $form_state['values']['vocabulary'];
}

/**
 * Convert a context into a string.
 */
function context_example_taxonomy_term_add_form_convert($context, $type) {
  switch ($type) {
    // Convert a vocabulary keyword into the data.
    case 'vocabulary':
      return $context->data['vocabulary'];
  }
}
