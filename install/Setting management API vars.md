#portal connections

The Apigee Drupal based portal maintains its connection to the management api via 4 variables stored in the variables table of the drupal database. These variables should NEVER be set using a SQL query. Drupal uses php's 'serialize' to set these variables so they not only have the value they have meta information about how php should use these variables. In addition, Drupal caches these values and the Drupal method of setting the vars insures that the cached versions are cleared.

There are two ways to change the values of these variables. 

1. command line: make sure drush is installed on the server and in your executable path. cd to the diirectory containing the correct settings.php file and execute the following commands:

  `drush vset devconnect_endpoint "https://<management api url>"`

  `drush vset devconnect_org "<your orgname>"`

  `drush vset devconnect_curlauth "<admin username>:<admin password>"`

  The fourth variable is devconnect_authtype. its set at 'basic' and should remain that as the portal does not, as yet, support other methods of authentication.

2. Druapl Admin Interface: you can also set these variables via the drupal web interface. using the admin black bar at the top of the screen, navigate to Configuration => Site => Variables => Module and edit the variables for the devconnect group. 
