DELETE FROM users
  WHERE uid NOT IN ( 0 , 1 );
UPDATE node
  SET uid = 0;
DELETE FROM url_alias
  WHERE source LIKE 'user/%' AND source != 'user/1' AND source != 'user/0';
UPDATE users
  SET mail = CONCAT ( name , '@localhost' ) , init = CONCAT ( name , '@localhost' ) , pass = MD5 (
    CONCAT ( 'MILDSECRET' , name ) )
  WHERE uid != 0;
UPDATE comment
  SET mail = CONCAT ( name , '@localhost' );
UPDATE variable
  SET value = 's:4:"fake";'
  WHERE name = 'smtp_password';
DELETE FROM users_roles
  WHERE uid NOT IN ( 0 , 1 );

TRUNCATE authmap;
TRUNCATE apachesolr_environment;
TRUNCATE apachesolr_environment_variable;
TRUNCATE apachesolr_index_bundles;
TRUNCATE apachesolr_index_entities;
TRUNCATE apachesolr_index_entities_node;
TRUNCATE apachesolr_search_page;
TRUNCATE apachesolr_stats;
TRUNCATE cache;
TRUNCATE cache_admin_menu;
TRUNCATE cache_apachesolr;
TRUNCATE cache_block;
TRUNCATE cache_bootstrap;
TRUNCATE cache_ds_panels;
TRUNCATE cache_field;
TRUNCATE cache_file_styles;
TRUNCATE cache_filter;
TRUNCATE cache_form;
TRUNCATE cache_gravatar;
TRUNCATE cache_image;
TRUNCATE cache_libraries;
TRUNCATE cache_media_xml;
TRUNCATE cache_menu;
TRUNCATE cache_metatag;
TRUNCATE cache_page;
TRUNCATE cache_path;
TRUNCATE cache_rules;
TRUNCATE cache_styles;
TRUNCATE cache_token;
TRUNCATE cache_update;
TRUNCATE cache_variable;
TRUNCATE cache_views;
TRUNCATE cache_views_data;
TRUNCATE flood;
TRUNCATE history;
TRUNCATE openid_association;
TRUNCATE openid_nonce;
TRUNCATE oauth_common_consumer;
TRUNCATE oauth_common_provider_consumer;
TRUNCATE oauthconnector_connections;
TRUNCATE oauth_common_token;
TRUNCATE oauthconnector_fields;
TRUNCATE search_dataset;
TRUNCATE search_index;
TRUNCATE search_total;
TRUNCATE sessions;
TRUNCATE watchdog;
TRUNCATE webform_submitted_data;
TRUNCATE deploy_plans;

DELETE FROM variable
  WHERE name LIKE 'devconnect%';



