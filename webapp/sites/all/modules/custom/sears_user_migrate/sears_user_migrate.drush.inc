<?php

define('SOURCE_ALIAS', 'oldsears');
define('DEST_ALIAS', 'default');

/**
 * Implements hook_drush_command().
 *
 * @return array
 */
function sears_user_migrate_drush_command() {
  $items = array();
  $items['sears-user-import'] = array(
    'callback' => 'sears_user_migrate_drush_migrate_users',
    'description' => dt('Migrates users from one Drupal install to another.'),
  );
  return $items;
}

function sears_user_migrate_drush_help($section) {
  switch ($section) {
    case 'drush:sears-user-import':
      return dt('This command migrates users from the old Sears Devconnect instance to the new one.');
  }
}

function sears_user_migrate_drush_migrate_users() {

  // First, port all users over.
  Database::setActiveConnection(SOURCE_ALIAS);

  $old_uids = db_select('users', 'u')
    ->fields('u', array('uid'))
    ->condition('uid', 0, '>')
    ->execute()
    ->fetchAll(PDO::FETCH_COLUMN);

  // This array will have old-database UID as key and new-database UID as value.
  $uid_map = array();

  // avoid unnecessary KMS calls
  module_disable(array('devconnect_user', 'sears_custom'));

  foreach ($old_uids as $old_uid) {
    // Read user from source db
    Database::setActiveConnection(SOURCE_ALIAS);

    // If we don't clear the field cache, we'll get errors in user_load
    // while in the "old" database due to undefined fields and their missing
    // underlying tables.
    field_cache_clear();

    $old_user = user_load($old_uid, TRUE);
    Database::setActiveConnection(DEST_ALIAS);
    // Does user already exist in target db?
    $new_user = _sears_user_migrate_load_user_by_mail($old_user->mail, $old_user->name);

    // User does not yet exist in target db, so create it.
    if (empty($new_user)) {
      $new_user = $old_user;
      // Unset uid so it is saved as a new user.
      unset($new_user->uid);
      $new_user = user_save($new_user);
      drush_print("Created user " . $new_user->mail);
    }
    else {
      if ($new_user->pass != $old_user->pass || $new_user->name != $old_user->name || $new_user->mail != $old_user->mail) {
        $new_user->mail = $old_user->mail;
        $new_user->pass = $old_user->pass;
        $new_user->name = $old_user->name;
        user_save($new_user);
        drush_print("Updated user " . $new_user->mail);
      }
    }

    // Map UIDs for use in migrating nodes/comments below
    $uid_map[$old_uid] = $new_user->uid;
    drush_print("Old UID $old_uid mapped to New UID " . $new_user->uid);
  }
  module_enable(array('devconnect_user', 'sears_custom'));

  // Now migrate all forum nodes.
  Database::setActiveConnection(SOURCE_ALIAS);
  $old_nids = db_select('node', 'n')
    ->fields('n', array('nid'))
    ->condition('type', 'forum')
    ->condition('uid', array_values($uid_map), 'IN')
    ->execute()
    ->fetchAll(PDO::FETCH_COLUMN);

  foreach ($old_nids as $old_nid) {
    // Read node from source database.
    Database::setActiveConnection(SOURCE_ALIAS);
    $old_node = node_load($old_nid);
    // Check to see if this node exists in target database.
    // NID may be different but title will be the same.
    Database::setActiveConnection(DEST_ALIAS);
    $new_nid = db_select('node', 'n')
      ->fields('n', array('nid'))
      ->condition('type', 'forum')
      ->condition('title', $old_node->title)
      ->execute()
      ->fetch(PDO::FETCH_COLUMN);

    $new_node = $old_node;
    $new_node->uid = $uid_map[$old_node->uid];
    if (!$new_nid) {
      // Node does not yet exist in target db, so create it.
      // Unset nid/vid so that it is saved as a new node.
      unset($new_node->nid);
      unset($new_node->vid);
      // Fortunately we don't need to map forum tids, as they are the same.
      node_save($new_node);
      drush_print("Created new node " . $new_node->title);
    }
    drush_print("Old NID $old_nid mapped to New NID " . $new_node->nid);

    // Comments may be responses to other comments, so we need to cache
    // a map of old-cids to new-cids.
    $cid_map = array();

    Database::setActiveConnection(SOURCE_ALIAS);
    // Comments must be ordered by cid so that parent/child relationships
    // remain intact.
    $old_cids = db_select('comment', 'c')
      ->fields('c', array('cid'))
      ->condition('nid', $old_nid)
      ->orderBy('cid')
      ->execute()
      ->fetchAll(PDO::FETCH_COLUMN);

    // Destination db does not contain any comments for these nodes. This has been
    // guaranteed by analysis, so we can do a straight save of all comments
    // without fear of duplicates.
    foreach ($old_cids as $old_cid) {
      // Read comment from source db
      Database::setActiveConnection(SOURCE_ALIAS);
      $old_comment = comment_load($old_cid);
      // Save comment to target db.
      Database::setActiveConnection(DEST_ALIAS);
      $new_comment = $old_comment;
      // Unset cid so this is saved as a new comment.
      unset($new_comment->cid);
      // See if we can map parent comment
      $new_comment->pid = (isset($cid_map[$old_comment->pid]) ? $cid_map[$old_comment->pid] : 0);
      // Set correct nid for target db
      $new_comment->nid = $new_node->nid;
      // Map user if possible; if we can't, make it anonymous
      $new_comment->uid = (isset($uid_map[$old_comment->uid]) ? $uid_map[$old_comment->uid] : 0);
      comment_save($new_comment);
      // Save cid to our old-to-new map
      $cid_map[$old_comment->cid] = $new_comment->cid;
      drush_print("Old CID $old_cid mapped to New CID " . $new_comment->cid);
    }

  }
  // Clean up
  Database::setActiveConnection(DEST_ALIAS);

}

/**
 * Performs a user load without hitting cache.
 *
 * @param $mail
 * @return mixed
 */
function _sears_user_migrate_load_user_by_mail($mail, $name) {
  $users = user_load_multiple(array(), array('mail' => $mail), TRUE);
  $user = reset($users);
  if (empty($user)) {
    $users = user_load_multiple(array(), array('name' => $name), TRUE);
    $user = reset($users);
  }
  return $user;
}