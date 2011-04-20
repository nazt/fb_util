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
    $li_string .= generate_activity_li($term);
  }

  $output = <<<FBJS
    <div id="fb-root"></div>
    <div id="like-count">
        <div class="msg-sort"><p class="msg-sort-label">เรียงตาม:</p><ul><li><a href="/connect" class="day7 active">สูงสุดใน 7 วัน</a></li><li><a href="/connect/popular/30days" class="day30">30 วัน</a></li><li><a href="/connect/popular/365days" class="day365">365 วัน</a></li><li><a href="/connect/popular/recent" class="recent">ล่าสุด</a></li></ul></div>
        <ul id="results"> </ul>
    </div>
FBJS;
  return $output;
}

function generate_activity_li($term) {
  $li = sprintf("<li class=\"cate-%s\"> <a href=\"#\" tid=\"%s\" class=\"category-item\">%s</a> <li>\n", $term->tid, $term->tid, $term->name);

  return $li;
}
