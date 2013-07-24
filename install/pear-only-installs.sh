#!/bin/bash

sudo pear config-set auto_discover 1
sudo pear channel-discover pear.drush.org
sudo pear channel-discover pear.phing.info
sudo pear channel-update pear.php.net
sudo pear channel-discover pear.phpunit.de
sudo pear channel-update pear.phpunit.de
sudo pear channel-discover components.ez.no
sudo pear channel-update components.ez.no
sudo pear channel-discover pear.symfony-project.com
sudo pear channel-update pear.symfony-project.com
sudo pear channel-discover saucelabs.github.com/pear
sudo pear channel-update saucelabs.github.com/pear

sudo pear install -f -a pear/Services_Amazon_S3-0.3.5
sudo pear install -f -a pear/VersionControl_Git-0.4.4

sudo pear upgrade -f -a Console_Getopt
sudo pear upgrade -f -a pear
sudo pear upgrade-all
sudo pear install -a drush/drush
sudo pear install pear.phpqatools.org/phpqatools pear.netpirates.net/phpDox
sudo pear install -a phing/phing
sudo pear install -a ezc/eZComponents
sudo pear install -f -a phpunit/DbUnit-1.0.3
sudo pear install -f -a phpunit/File_Iterator-1.2.6
sudo pear install -f -a phpunit/PHPUnit_MockObject-1.0.9
sudo pear install -f -a phpunit/PHP_CodeCoverage-1.0.5
sudo pear install -f -a phpunit/PHP_Invoker-1.0.0
sudo pear install -f -a phpunit/PHP_Timer-1.0.2
sudo pear install -f -a phpunit/PHP_TokenStream-1.0.1
sudo pear install -f -a phpunit/Text_Template-1.1.0

sudo pear install -a saucelabs/PHPUnit_Selenium_SauceOnDemand


# for sauce labs integration
# => sauce configure your-username your-access-key