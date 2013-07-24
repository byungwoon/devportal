<?php

/*
 * Shows subnavigation for main menu
 */

function sears_links($variables) {
  if (array_key_exists('id', $variables['attributes']) && $variables['attributes']['id'] == 'main-menu') {
    $pid = variable_get('menu_main_links_source', 'main-menu');
    $tree = menu_tree($pid);
    return drupal_render($tree);
  }
  return theme_links($variables);
}

/*
 * Outputs breadcrumbs as a UL
 */

function sears_breadcrumb($variables) {
  
  if(!empty($variables['breadcrumb'])) {
      // need to reverse urlencoding for the hash(#) because it's being used for named anchor links in custom breadcrumbs
      $variables['breadcrumb'] = str_replace('%23', '#', $variables['breadcrumb']);
      
      $crumbs = '<ul class="breadcrumbs">';
      
      $last_item = end($variables['breadcrumb']);
      
      foreach($variables['breadcrumb'] as $value) {
           if($value == $last_item) {
              $crumbs .= '<li>'.$value.'</li>';
           } else {
             $crumbs .= '<li>'.$value.' &gt;</li>';
          }
      }
      $crumbs .= '</ul>';
    }
  return $crumbs;
}
