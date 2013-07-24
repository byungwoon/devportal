#!/bin/bash

#works with drush 5.1 or newer installed

drush make --prepare-install --working-copy --no-gitinfofile --no-cache -y --force-complete apigee.make webapp
git clone git@github.com:apigee/drupal-settings.git ../drupal-settings
cp -R ../drupal-settings/sites/* webapp/sites
cp libraries.php webapp/sites/default/
