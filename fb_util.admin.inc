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
