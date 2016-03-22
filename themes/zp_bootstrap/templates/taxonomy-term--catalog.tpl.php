<?php

/**
 * @file
 * Default theme implementation to display a term.
 *
 * Available variables:
 * - $name: (deprecated) The unsanitized name of the term. Use $term_name
 *   instead.
 * - $content: An array of items for the content of the term (fields and
 *   description). Use render($content) to print them all, or print a subset
 *   such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $term_url: Direct URL of the current term.
 * - $term_name: Name of the current term.
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the following:
 *   - taxonomy-term: The current template type, i.e., "theming hook".
 *   - vocabulary-[vocabulary-name]: The vocabulary to which the term belongs to.
 *     For example, if the term is a "Tag" it would result in "vocabulary-tag".
 *
 * Other variables:
 * - $term: Full term object. Contains data that may not be safe.
 * - $view_mode: View mode, e.g. 'full', 'teaser'...
 * - $page: Flag for the full page state.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the term. Increments each time it's output.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * @see template_preprocess()
 * @see template_preprocess_taxonomy_term()
 * @see template_process()
 *
 * @ingroup themeable
 */

//dpm($content);
$current_url_dept_zp_tid = arg(1);
//dpm(arg());
//dpm($_GET);

//dpm($term);
//dpm('$view_mode = ' . $view_mode);

global $user;

//$term_zp_id = $content['field_zp_id'][0]['#markup']; // !empty($term->field_zp_id['und'][0]['safe_value']) ? $term->field_zp_id['und'][0]['safe_value'] : @$term->field_zp_id[0]['safe_value'];
$term_zp_id = !empty($term->field_zp_id['und'][0]['safe_value']) ? $term->field_zp_id['und'][0]['safe_value'] : @$term->field_zp_id[0]['safe_value'];

if ($current_url_dept_zp_tid == $term_zp_id) {
  $term_is_current_parent_dept = TRUE;
}
else {
  $term_is_current_parent_dept = FALSE;
}

?>

<div id="taxonomy-term-<?php print $term->tid; ?>" class="<?php print $classes; ?>">
  
<?php

if ($user->uid == 1/* && $term_is_current_parent_dept*/) {
?>
<ul class="tabs primary"><li class="active"><?php echo l('Edit', 'taxonomy/term/' . $term->tid . '/edit', array('query' => array('destination' => $_GET['q'])));  ?></li>
<li><?php echo l('Devel', 'taxonomy/term/' . $term->tid . '/devel', array('query' => array('destination' => $_GET['q'])));  ?></li>
</ul>
<?php

}

$current_subdept_children = !empty($term->field_has_prods_or_depts['und'][0]['value']) ? $term->field_has_prods_or_depts['und'][0]['value'] : @$term->field_has_prods_or_depts[0]['value']; //@$content['field_has_prods_or_depts'][0]['#markup']; //@$term->field_has_prods_or_depts['und'][0]['value']; // 0 - not defined, 1 - has subdepts, 2 - has priducts

if ($term_is_current_parent_dept) {
  echo '<h1 class="parent-dept current">', $term_name, '</h1>';
}
elseif (!$current_subdept_children) {
  echo '<h2>', $term_name, '</h2>';
}
else {
  echo '<h2>', l($term_name, ($current_subdept_children == 1 ? 'd/' : 'dp/') . $term_zp_id), '</h2>';
}

?>



  <div class="content">
    <?php print render($content); ?>
  </div>

</div>
