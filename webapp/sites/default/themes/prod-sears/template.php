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

/**
 * Preprocessor for theme('region').
 */
// function sears_preprocess_region(&$variables, $hook) {
//   if ($variables['region'] == 'content') {
//     $variables['theme_hook_suggestions'][] = 'region__no_wrapper';
//   }
// 
//   if($variables['region'] == "sidebar_first") {
//     $variables['classes_array'][] = 'well';
//   }
// 
//   if ($variables['region'] == "sidebar_second") {
//     $parent_id = 0;
//     foreach ($variables['elements']['book_navigation'] as $element) {
//       if (is_array($element) && isset($element['#theme'])) {
//           $tmp = explode('_', $element['#theme']);
//           $parent_id = $tmp[sizeof($tmp) - 1];
//       }
//     }
//     $parent_info = node_load($parent_id);
//     $tmp = $variables['content'];
//     #echo "<pre>".print_r($parent_info, true) . "</pre>";
//     $tmp = str_replace('<h2>Topics</h2>', '<h3><a href="/' . $parent_info -> book['link_path'] . '">' . $parent_info -> title . '</a></h3><h2>Topics</h2>', $tmp);
//     $variables['content'] = $tmp;
//   }
// }


/**
 * Overrides theme_menu_link().
 *
 * Prints sub-items with the menu link.
 */
// function sears_menu_link(array $variables) {
//     $element = $variables['element'];
//     $sub_menu = '';
// 
//     if ($element['#below']) {
//         // Add our own wrapper
//         unset($element['#below']['#theme_wrappers']);
//         $sub_menu = '<ul>' . drupal_render($element['#below']) . '</ul>';
// 
//         $element['#localized_options']['html'] = TRUE;
// 
//         #$element['#href'] = "";
//     }
// 
//     $output = l($element['#title'], $element['#href'], $element['#localized_options']);
//     return '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
// }
