<?php


/**
 * @file
 * 
 *
 */

/**
 * Plugins are described by creating a $plugin array which will be used
 * by the system that includes this file.
 */
$plugin = array(
  'title' => t('-----Content type plugin title'), // Название плагина, отображаемое при его выборе.
  'description' => t('-----Content type plugin description.'), // Описание плагина, отображаемое при его выборе.
  'render callback' => 'adyax_test_text_content_type_render', // Функция, которая будет формировать и выводить содержимое плагина.
  'edit form' => 'adyax_test_text_edit_form', // Форма с настройками плагина.
  'category' => t('-----Content type plugin category'), // Категория, в которой будет находиться плагин.
  //'required context' => new ctools_context_required(t('Node'), 'node'), // Обязательный контекст, без которого плагин не будет работать.
  //'all contexts' => TRUE, // Флаг, указывающий, что плагину будут доступны все контексты.
  'single' => TRUE, // Флаг, указывающий является ли плагин подтипом другого.
); 


/**
 * 'Edit form' callback for the content type.
 */
function adyax_test_text_edit_form($form, &$form_state) {
  // Получаем ранее введенные настройки.
  $conf = $form_state['conf'];
 
  $form['text'] = array(
    '#type' => 'textarea',
    '#title' => t('----Custom texttttt'),
    '#default_value' => !empty($conf['text']) ? $conf['text'] : '',
  );
 
  return $form;
}
 
/**
 * Submit callback for the adyax_test_text_edit_form().
 */
function adyax_test_text_edit_form_submit($form, &$form_state) {
  // Сохраняем настройки.
  $form_state['conf'] = array(
    'text' => $form_state['values']['text'],
  );
}


/**
 * Render callback for the content type.
 */
function adyax_test_text_content_type_render($subtype, $conf, $args, $context) {
 
  // Если в настройках плагина не ввели текст, то ничего не выводим.
  if (empty($conf['text'])) {
    return '----xxxx';
  }
 
  $block = new stdClass();
  $block->content = $conf['text'];
  return $block;
}