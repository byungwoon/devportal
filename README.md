#APIGEE STANDARD DRUPAL DISTRIBUTION

## Installing LAMP

Installing and configuring PHP is a pain in the ass. There's really no other way to put this. We've all had to do it at different times. Apigee's Portal team is committed to making this process easier and we will soon have some tools that make this a lot easier to do on any system. We're working on Puppet scripts that will spin up a version of LAMP with our distro of Drupal with a few commands. Until then, unfortunately, most of the PHP install experiences are not super user friendly. Take heart. Dive in. And don't be afraid to make some mistakes.

##Requirements

* Apache 2.2 or newer (njinx prolly works but is unsupported) 
* PHP 5.3.6 or newer (php 5.2 is EOL'd, 5.4 is preferred) 
* A Unix/Linux-based server. Windows is an unsupported server install 
* MySQL 5.1 or newer * Drush 5.0 or newer (see install instructions)

##A note about workflow
We recommend working with Apigee-Drupal/APIPortal locally and then moving your changes upstream to a staging environment then moving those changes from staging to a production environment. For that reason, we recommend using a local version of the `*AMP` stack.

###Mac OS Install 
Your mac has a default version of PHP installed. Feel free to install drupal in /Library/Webserver/Documents if you are only working on a single site. If you need to work on multiple web projects that need their own hostanme, we recommend [MAMP Pro](http://www.mamp.info). MAMP Pro installs multiple versions of PHP in a container and allows you to do virtual hosting with a great deal of ease. For a few words about making MAMP Pro the default PHP on your mac, see this [blog entry](http://stovak.net/blog/install-drush-5-mamp-pro).

###Windows 
Install For Windows, WAMP is a good choice. Installing [Cygwin](http://www.cygwin.com) is recommended for completely shell scripting compatibility.

###Linux 
Install For linux, use your distribution's latest PHP stack.

##Continuous Integration 
Keeping Drupal up-to-date can be a full-time job. This is why every time code is pushed out to Apigee's development environment, a Drush Make process is run and the site is built with the latest version of every module unless there's a reason to link to a specific version of that module. All of [Apigee's](http://www.apigee.com) hosting is done with CENTOS 6.x/Amazon's distro of linux. We use use [Puppet](http://puppetlabs.com) to manage our server infrastructure and server software updates. We use Jenkins to do software builds, including Apigee Drupal. We use [Phing](http://phing.info) to manage the build process. And Selenium and PHPUnit for automated testing.

The Apigee Drupal team's goal is to verify a Drupal point release within 15 days of it being posted on Drupal.org. In practice it's been less time than that as Drupal releases have been getting progressively more stable as they solidify their build processes.

##Installation of Apigee-Drupal

1. Start by cloning this repository.

 `git clone git@github.com:apigee/apigee-drupal`

1. PECL & PEAR Modules 

  PHP Unit versions 3.7 and newer require the "pcntl" module for php. We also have a couple of modules that require the "SSH2" module for php. These modules can be installed with PECL provided you have the source from the PHP install in a directory somewhere in your path. With MAMP Pro, I usually unpack the source of the PHP i'm going to use into `/Applications/MAMP/bin/php/php<VERSION>/lib/php`. 
    
  For special instructions about SSL certificates and MAMP Pro, [please read this blog post](http://dev.soup.io/post/56438473/If-youre-using-MAMP-and-doing-something).
  
  To get a working version of either of these modules to work with MAMP/MAMP Pro requires that you download and install Apple's command line compiler tools and also [homebrew](http://mxcl.github.com/homebrew/) or [macports](http://www.macports.org) to help manage the installed libraries. For linux installs, use apt-get search or yum search to find the exact install version you require. In windows, you can install everything you will need with [Cygwin](http://www.cygwin.com).
  
  You will need to install "autoconf" (which you get from the MacOS Developer tools) and if you're going to try to connect to the Devconnect 4g API Endpoint, you will need the custom SSH2 package. I prefer homebrew to mac ports but use what you prefer to. As long as the open source projects needed are installed and in the working path.
  
  There is a "pear-install.sh" file in the root directory of the Apigee-Drupal repo. It will download drush, phing, php-unit and selenium. Run it as root on your machine. If PECL and PEAR fail to install what you need, you can usually cd to the PHP source directory and find the php modules in question, execute `phpize`, `configure`, `make`, and `sudo make install` to get the missing module installed. I've had to consistantly do this to make sure PHP's PCNTL module is installed. It comes as part of the PHP package but is not included in MAMP for whatever reason. If you get stuck, your best source is Google. Every problem you encouter has been encoutered and solved by others before you.

  `>sudo sh pear-installs.sh`

  If you have not yet seen or used automated selenium testing, check it out at saucelabs.com. PHP has it's own testing framework which may or may not work for your testing needs. I find is useful to a point. More about that in the readme in the Devconnect repo under "tests".
  
  Phing is an automated builder for php similar to ANT for Java. It will download all the files you need to complete the build process.

1. Install drush registry rebuild.

  One big change between Drupal 6 and Drupal 7 is a database table called "registry". this table holds the location of all your module files. If those files or any of their associated classes for any reason change location your Drupal install will white-screen.
  
  The Phing build script which is in this directory in a file called `build.sh`. As part of every build, this shell script instructs Jenkins to do a registry rebuild to fix any modules that might have moved since the last build and avoid white-screens when file locations change.
  
  if drush is installed correctly, you can simply

  `> drush dl registry_rebuild`
 
1. A word about Versioning

  If you already have an instance of the portal on [Apigee&lsquo;s](https://apigee.com) servers, You can find out which version of the portal is running by [navigating to the build info file](https://default.apiportal.jupiter.apigee.net/buildInfo). It should look something like this:
  
  `Version: dev-4.21.83`
  
  `Build Timestamp: 20130108.0000`
  
  `SCM Revision: 07b538d06d0f9a4160432c519968e4c1372e0ec2`
  
  The first number is the version of the Apigee backend with which this is compatible. Four is the latest version of the Apigee backend and will be so for the foreseeable future. Twenty is the current "rocket" that the development of the portal is in. It's probably irrelevant to you, but we need it internally. The third number is the important one to you. It tells what build number is published to your portal. In the master branch of this repo, builds are tagged with their respective build numbers by our  [Jenkins](http://jenkins-ci.org) build server. You can reproduce a build exactly by checking out the tag of your build from the master and then running Phing from the root directory of that checkout.

  `git checkout dev-4.21.83`

  This would get you the 4.20.55 release makefile. Running phing on that makefile will include the modules that went into that release, even if newer code from that module has been checked in after the build was made. In the makefile the modules are referenced with specific commits and exact versions of contrib modules are referenced. Those exact versions download when drush make is run on the makefile.

  If you want a more generic version suitable for development, feel free to checkout the 7.x-1.x branch in which modules are spec'd generically and Drush make will download the latest version.

1. From the command line, `cd` to the folder containing the cloned files

  `cd apigee-drupal`

1. Phing

  In the "webapp" folder there's a "build.xml" file. Invoke the phing default build.
  
  `phing -f build.xml`
  
  This will trigger a series of commands resulting in a basic Apigee Drupal install. If you're on the Apigee development team and have access to the drupal-settings repo: 
  
  `phing -f build.xml -Dbuild.type=internal` 
  
  This build requires access to our in-house Drupal-Settings repo. Only Apigee employees and contractors should have access to this so don't worry if you don't. This will get you the drupal-settings folder and then copy them to the correct place.
  
  _NOTE_: The Phing build completely removes the core "PHP Filter" and "Update" modules from Drupal. This is intended behavior. They will not be on any server you deploy to. Putting PHP in a node is a security risk and should not be a part of your development pattern. All updates will be done by our scripts and automated.

1. Permissions

  Make sure the webserver (typically Apache) can write to sites/default/files. If there's nobody else using your server, you can do a `chmod -R 777 sites/default/files` and that should fix any permissions issues you might encounter.

1. Edit the settings file

  In the root folder "sites/default" is an example settings.php file (`sites/default/settings.php`). Edit the file with your database connection settings. You should have been given a default portal database from your Apigee Customer service rep along with Portal connection settings based on your enterprise. If you have an existing portal and are setting up for local development, you can log into your existing portal and use the Backup/Migrate database export to get a copy of your portal. In-house Apigee developers should use the DEVELOPMENT database exports for local development.

1. Private files

  Drupal 7 has a setting for "private" files. For a production site, you might want to not even have them inside of the webroot. For development, I've moved my default settings for this to sites/SITENAME/private or sites/default/private. Drupal will put an HTACCESS in the folder to keep prying eyes out.

1. Change the admin user's password

  `> drush user-password admin --password='newpass'`

  The database backup is in a public repo. Your Drupal install should not be considered secure until the password for existing users have been changed. Be sure to follow good password policy and don't write the Admin user's password in a big red binder with 'important passwords' on the outside.

1. Your Drupal install should be ready to use.
