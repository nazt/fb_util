<?php
function show_post_idea_page() {

  $css_path = drupal_get_path('module', 'fb_util') . '/css/custom_style.css';
  $js_path  = drupal_get_path('module', 'fb_util') . '/js/util.js';
  drupal_add_css($css_path);
  drupal_add_js($js_path);

  $api_key = variable_get('fb_util_app_api_key', '');
  $secret_key = variable_get('fb_util_app_secret_key', '');
  $app_id = variable_get('fb_util_app_id', '');
  $page_id = variable_get('fb_util_page_id', '');
  drupal_add_js(array('fb_util' => array('apikey' => $api_key, 'appid' => $app_id, 'pageid' => $page_id)), 'setting');

  $activity_term_tree = taxonomy_get_tree(11);
  $li_string = "";

  foreach ($activity_term_tree as $term) {
    $li_string .= generate_activity_li($term);
  }

  $output = <<<FBJS
      <div id="fb-root"></div>
    <p class='loading' id='prepare-page'></p>
   <div id='like-box-fan-page' class='hidden'> </div>
      <ul class="category-wrapper idea-rule-top hidden">
        $li_string
      </ul>

      <script type="text/javascript">
          (function() {
            var e = document.createElement('script');
            e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js#xfbml=1';
            e.async = true;
            document.getElementById('fb-root').appendChild(e);
          }());
      </script>
FBJS;
  return $output;
}

function generate_activity_li($term) {
  $li = sprintf("<li class=\"cate-%s\"> <a href=\"#\" tid=\"%s\" class=\"category-item\">%s</a> <li>\n", $term->tid, $term->tid, $term->name);

  return $li;
}
