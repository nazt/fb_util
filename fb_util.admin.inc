<?php

/**
  * Settings Form
  */
function fb_util_settings_form() {
  $form['fb_util_app_id'] = array(
    '#type' => 'textfield',
    '#title' => t('App id'),
    '#description' => t('Enter your app id'),
    '#default_value' => variable_get('fb_util_app_id', 'null')
    );

  $form['fb_util_app_api_key'] = array(
    '#type' => 'textfield',
    '#title' => t('API key'),
    '#description' => t('Enter your app api key'),
    '#default_value' => variable_get('fb_util_app_api_key', 'null')
  );

  $form['fb_util_app_secret_key'] = array(
      '#type' => 'textfield',
      '#title' => t('Secret Key'),
      '#description' =>  t('Enter your secret key'),
      '#default_value' => variable_get('fb_util_app_secret_key', 'null')
  );

  $form['fb_util_page_id'] = array(
      '#type' => 'textfield',
      '#title' => t('Page ID'),
      '#description' =>  t('Enter your secret key'),
      '#default_value' => variable_get('fb_util_page_id', '153305968014537')
  );


  return system_settings_form($form);
}

function manage_contest_form() {
  $form['header'] = array(
      '#value' => t('<h2>Manage Idea Contest Settings</h2>'),
    );

  $form['fb_contest_started'] = array(
      '#type' => 'checkbox',
      '#title' => t('Show only promoted ideas.'),
      '#description' =>  '',
      '#default_value' => variable_get('fb_contest_started', false),
  );

  $form['div_open_'] = array(
      '#value' => '<div class=jump-to-select>',
  );

  $form['link_to_select_idea'] = array(
      '#value' => l(t('Go to select idea page.'),  'admin/content/idea/manage'),
    );

  $form['div_close_'] = array(
      '#value' => '</div>',
  );
  return system_settings_form($form);
}
