<?php
function show_list_idea_page() {
  $css_path = drupal_get_path('module', 'fb_util') . '/css/custom_style.css';
  $js_path  = drupal_get_path('module', 'fb_util') . '/js/listpage.js';
  drupal_add_css($css_path);
  drupal_add_js($js_path);

  $js_date_format= drupal_get_path('module', 'fb_util') . '/js/date.format.minified.js';

  $api_key = variable_get('fb_util_app_api_key', '');
  $secret_key = variable_get('fb_util_app_secret_key', '');
  $app_id = variable_get('fb_util_app_id', '');
  $page_id = variable_get('fb_util_page_id', '');
  drupal_add_js(array('fb_util' => array('apikey' => $api_key, 'appid' => $app_id, 'pageid' => $page_id)), 'setting');
  drupal_add_js($js_date_format);

  $activity_term_tree = taxonomy_get_tree(11);
  $li_string = "";
  foreach ($activity_term_tree as $term) {
    $alias = taxonomy_get_synonyms($term->tid);
    $li_string .= generate_activity_li($term, $alias);
  }

  $output = <<<FBJS
    <div id="fb-root"></div>
    <p class='loading' id='prepare-page'></p>
    <div id="like-count">
        <div class="msg-sort">
          <p class="msg-sort-label">หมวดหมู่:</p>
          <ul>
            <li class="cate-all"> <a href="#" tid="all" class="category-item active">ทั้งหมด</a> <li>
            $li_string
          </ul>
         </div>
        <ul id="results"> </ul>
    </div>
FBJS;
  return $output;
}

function generate_activity_li($term, &$alias = NULL) {
  if (!empty($alias[0])) {
    $term->name = $alias[0];
  }
  $li = sprintf("<li class=\"category-menu cate-%s\"> <a href=\"#\" tid=\"%s\" class=\"category-item\">%s</a> <li>\n", $term->tid, $term->tid, $term->name);

  return $li;
}
