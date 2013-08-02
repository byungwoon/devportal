<?php
/**
 * Menu callback; process one time login link and redirects to the user page on success.
 *
 * Add new simplified user registration and event signups functionality - email verification required
 * Menu callback; process one time login link and redirects to the user page on success.
 * this function is copied from user_pass_reset() function user.pages.inc of the core drupal user module
 * original function is over-ridden in sears_account_menu $callbacks['user/reset/%/%/%']
 *
 * Alterations from the standard user_pass_reset() are as follows:
 * - After login is finalized, we don't set a 'You just used your one-time login' message.
 * - After login is finalized, the extra 'loginlink' param is passed to the user edit page
 * - Instead of being presented with a confirm button after using a one-time link, the user is immediately redirected
 *   to the password reset form.
 */
function user_pass_reset2($form, &$form_state, $uid, $timestamp, $hashed_pass, $action = NULL) {
  global $user;

  // When processing the one-time login link, we have to make sure that a user
  // isn't already logged in.
  if ($user->uid) {
    // The existing user is already logged in.
    if ($user->uid == $uid) {
      drupal_set_message(t('You are logged in as %user. <a href="!user_edit">Change your password.</a>', array('%user' => $user->name, '!user_edit' => url("user/$user->uid/edit"))));
    }
    // A different user is already logged in on the computer.
    else {
      $reset_link_account = user_load($uid);
      if (!empty($reset_link_account)) {
        drupal_set_message(t('Another user (%other_user) is already logged into the site on this computer, but you tried to use a one-time link for user %resetting_user. Please <a href="!logout">logout</a> and try using the link again.',
          array('%other_user' => $user->name, '%resetting_user' => $reset_link_account->name, '!logout' => url('user/logout'))));
      } else {
        // Invalid one-time link specifies an unknown user.
        drupal_set_message(t('The one-time login link you clicked is invalid.'));
      }
    }
    drupal_goto();
  }
  else {
    // Time out, in seconds, until login URL expires. Defaults to 24 hours =
    // 86400 seconds.
    $timeout = variable_get('user_password_reset_timeout', 86400);
    $current = REQUEST_TIME;
    // Some redundant checks for extra security ?
    $users = user_load_multiple(array($uid), array('status' => '1'));
    if ($timestamp <= $current && $account = reset($users)) {
      // No time out for first time login.
      if ($account->login && $current - $timestamp > $timeout) {
        drupal_set_message(t('You have tried to use a one-time login link that has expired. Please request a new one using the form below.'));
        drupal_goto('user/password');
      }
      elseif ($account->uid && $timestamp >= $account->login && $timestamp <= $current && $hashed_pass == user_pass_rehash($account->pass, $timestamp, $account->login)) {
        // First stage is a confirmation form, then login
        if ($action == 'login') {
          watchdog('user', 'User %name used one-time login link at time %timestamp.', array('%name' => $account->name, '%timestamp' => $timestamp));
          // Set the new user.
          $user = $account;
          // user_login_finalize() also updates the login timestamp of the
          // user, which invalidates further use of the one-time login link.
          user_login_finalize();
          // Let the user's password be changed without the current password check.
          $token = drupal_hash_base64(drupal_random_bytes(55));
          $_SESSION['pass_reset_' . $user->uid] = $token;
          drupal_goto('user/' . $user->uid . '/edit', array('query' => array('pass-reset-token' => $token, 'loginlink' => 'successful')));
        }
        else {
          drupal_goto("user/reset/$uid/$timestamp/$hashed_pass/login");
        }
      }
      else {
        drupal_set_message(t('You have tried to use a one-time login link that has either been used or is no longer valid. Please request a new one using the form below.'));
        drupal_goto('user/password');
      }
    }
    else {
      // Deny access, no more clues.
      // Everything will be in the watchdog's URL for the administrator to check.
      drupal_access_denied();
    }
  }
}
