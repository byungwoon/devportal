<?php
/**
 * @file
 * Installation file for the app_notify module.
 */
/**
 * Module settings page.
 */
function app_notify_settings() {
  $form['app_notify'] = array(
    '#type' => 'fieldset',
    '#title' => t('App Notification'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE
  );
  $form['app_notify']['app_notify_mailto'] = array(
    '#type' => 'textarea',
    '#title' => t('Send notifications to this custom email address'),
    '#description' => t('Please specify multiple email ids with comma(,) separated values eg(%mailto,%mailto). If you leave this blank, the site email address, %mailto, will be used.', array('%mailto' => variable_get('site_mail', ini_get('sendmail_from')))),
    '#default_value' => variable_get('app_notify_mailto', variable_get('site_mail', ini_get('sendmail_from'))),
  );
  $form['app_notify']['app_notify_user'] = array(
    '#type' => 'checkbox',
    '#title' => t('Send email alert to the user who created the app'),
    '#description' => t('If checked user will get an email notification about the app creation.'),
    '#default_value' => variable_get('app_notify_user', FALSE),
  );
  return system_settings_form($form);
}