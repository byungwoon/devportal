#! /bin/bash

if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

export LOGFILE="/var/log/apigee-drupal-install.log"
export DRUPAL_WEBAPP="/var/www/html"

export DOCS_DB_SOURCE="/tmp/apigee-drupal/db/docs_r20_2013-03-13.sql"
export DOCS_HOSTNAME="docs.local"

export PORTAL_DB_SOURCE="/tmp/apigee-drupal/db/portal_r20_2013-03-13.sql"
export PORTAL_HOSTNAME="portal.local"

export PLATFORM_NAME="centos".
export PLATFORM_TAG=$(cat /etc/system-release)
export PLATFORM_RELEASE="6*"
export PLATFORM_ARCHITECTURE="x86_64"
export PLATFORM_PACKAGING="dpkg"
export PLATFORM_AWK="/usr/bin/awk"
export PLATFORM_COLUMNS=$(tput cols)
export DISPLAY_DIVIDER=""
export PEAR_OPTIONAL="N"

# Clean up function called if signal caught
function cleanup_error(){

  display_header "

 ===> Exiting, ERROR!
 The actions of this installer are written to a log here: ${LOGFILE}
 If you need support during this installation,
 please include the logfile in your communication

"
  exit 1

}

function cleanup_noerror() {
  display_header "
  GREAT SUCCESS! you're good to go. To create a drupal user, cd to the
  site folder and use drush as below:

  >cd /var/www/html/sites/portal

  drush user-create newuser --mail='my@email.com' --password='newuserp@ssw0rd'
  drush user-add-role 'Administrator' --name='newuser'
  drush user-unblock newuser

  The actions of this installer are written to a log here: ${LOGFILE}
  If you need support during this installation,
  please include the logfile in your communication
"

  exit 0
}

# Display a multiline string, because we can't rely on `echo` to do the right thing.
#
# Arguments:
# 1. Text to display.
display() {
    display_nonewline "${1?}\n"
}

# Display a multiline string without a trailing newline.
#
# Arguments:
# 1. Text to display.
display_nonewline() {
    printf -- "${1?}"
}

# Display a newline
display_newline() {
    display ''
}

display_header() {
  display_separator
  display "${1?}"
  display_separator
}

# Display an error message to STDERR, but do not exit.
#
# Arguments:
# 1. Message to display.
display_error() {
    display_error "!! ERROR: ${1?}"
    display_newline
}

# Display a minor separator line.
display_separator() {
    display "*******************************************************************************"
}

# Invoke the exception_handler on CTRL-C or "set -e" errors.
register_exception_handler() {
    trap cleanup_error ERR
    trap clearup_noerror TERM HUP
}


# Display a step in the installation process.
#
# Arguments:
# 1. Description of the step, e.g. "PERFORM INSTALLATION"
# 2. Display newline afterwards? Defaults to 'y'.
display_step() {
    t_display_step__description="${1?}"
    t_display_step__newline="${2:-"y"}"

    if [ -z "${DISPLAY_STEP__NUMBER:-""}" ]; then
        DISPLAY_STEP__NUMBER=1
    else
        DISPLAY_STEP__NUMBER=$(( 1 + ${DISPLAY_STEP__NUMBER?} ))
    fi

    display_newline
    display_separator
    display_newline
    display "STEP ${DISPLAY_STEP__NUMBER?}: ${t_display_step__description?}"

    if [ y = "${t_display_step__newline?}" ]; then
        display_newline
    fi
    display_separator

}

# Display wrapped, indented text..
#
# Arguments:
# 1. Spaces to use for the initial line's indentation, e.g. 0
# 2. Spaces to use for the Subsequent lines' indentation, e.g. 4
# 3. Maximum width of the indented text before it's wrapped. Defaults to a sensible value.
#
# Example:
#   echo "Hello world!" | display_wrapped_text 4 2 4
display_wrapped_text() {
    t_display_wrapped_text__initial="${1:-"3"}"
    t_display_wrapped_text__subsequent="${2:-"3"}"
    t_display_wrapped_text__maxlength="${3:-""}"
    t_display_wrapped_text__maxlength="76"
    PLATFORM_AWK="/bin/awk"

    "${PLATFORM_AWK?}" -vmaxlength="${t_display_wrapped_text__maxlength?}" -vinitial="${t_display_wrapped_text__initial?}" -vsubsequent="${t_display_wrapped_text__subsequent?}" '
        function set_indent() {
            if (is_initial == 1)
                spacing = initial
            else
                spacing = subsequent

            if (spacing > 0)
                indent = sprintf(("%" spacing "s"), " ")
            else
                indent = ""
        }

        BEGIN {
            if (! maxlength)
                maxlength = 72

            if (! initial)
                initial = 0

            if (! subsequent)
                subsequent = 0

            buffer = ""
            is_initial = 1
            current = 0
        }

        {
            if (NF) {
                for (i = 1; i <= NF ; i++) {
                    if (buffer == "") {
                        buffer = $i
                    } else {
                        set_indent()

                        if (length(indent) + length(buffer) + length($i) + 1 <= maxlength) {
                            buffer = ( buffer " " $i )
                        } else {
                            if (is_initial == 1) {
                                is_initial = 0
                            }
                            printf("%s%s\n", indent, buffer)
                            buffer = $i
                        }
                    }
                 }
          } else {
              buffer = ""
              print
          }
        }

        END {
            if (length(buffer) > 0)
                set_indent()
                printf("%s%s", indent, buffer)
        }
    '
}

# Display a question, make the user answer it, and set a variable with their answer.
#
# Arguments:
# 1. Question text to display, e.g. "What's your favorite color?"
# 2. Name of the variable to export, e.g. "q_favorite_color"
# 3. Kind of question, e.g. "Yn" to show a 'Y/n' prompt that defaults to 'yes', "yN" to show a y/N prompt that defaults to 'no', "String" for a manditory string response, "StringOrBlank" for an optional string response.
# 4. Default answer, optional. Supported for "String" questions.
question() {
    question_question="${1?}"
    question_name="${2?}"
    question_kind="${3?}"
    question_default="${4:-""}"

    question_message="?? ${question_question?} "
    case "${question_kind?}" in
        Yn)
            question_message="${question_message?}[Y/n] "
            ;;
        yN)
            question_message="${question_message?}[y/N] "
            ;;
        yn)
            question_message="${question_message?}[y/n] "
            ;;
        cr)
            question_message="${question_message?}[c/r] "
            ;;
        StringOrBlank)
            question_message="${question_message?}[Default: (blank)] "
            ;;
        String*)
            if [ ! -z "${question_default?}" ]; then
                question_message="${question_message?}[Default: ${question_default?}] "
            fi
            ;;
        Port)
            if [ ! -z "${question_default?}" ]; then
                question_message="${question_message?}[Default: ${question_default?}] "
            fi
            ;;
        Password*)
            if [ ! -z "${question_default?}" ]; then
                question_message="${question_message?}[Default: ${question_default?}] "
            fi
            ;;
        Email)
            ;;
        *)
            display_failure "Invalid question kind: ${question_kind?}"
            ;;
    esac

    # Try to load the answer from an existing variable, e.g. given name "q" look at variable "$q".
    eval question_answered=\$"${question_name:-""}"
    question_defined=0
    question_success=n
    until [ y = "${question_success?}" ]; do
        echo "${question_message?}" | display_wrapped_text 0
        display_nonewline " "

            if [ "${question_kind?}" = "Password4" -o "${question_kind?}" = "Password8" ]; then
                read -q question_response; echo
            else
                #statements
                read question_response
            fi

        case "${question_kind?}" in
            Yn)
                if [ -z "${question_response?}" -o y = "${question_response?}" -o Y = "${question_response?}" ]; then
                    question_answer=y
                    question_success=y
                elif [ n = "${question_response?}" -o N = "${question_response?}" ]; then
                    question_answer=n
                    question_success=y
                else
                    display_error 'Answer must be either "y", "n" or <ENTER> for "y"'
                fi
                ;;
            yN)
                if [ y = "${question_response?}" -o Y = "${question_response?}" ]; then
                    question_answer=y
                    question_success=y
                elif [ -z "${question_response?}" -o n = "${question_response?}" -o N = "${question_response?}" ]; then
                    question_answer=n
                    question_success=y
                else
                    display_error 'Answer must be either "y", "n" or <ENTER> for "n"'
                fi
                ;;
            yn)
                if [ y = "${question_response?}" -o Y = "${question_response?}" ]; then
                    question_answer=y
                    question_success=y
                elif [ n = "${question_response?}" -o N = "${question_response?}" ]; then
                    question_answer=n
                    question_success=y
                else
                    display_error 'Answer must be either "y", "n"'
                fi
                ;;
            cr)
                if [ c = "${question_response?}" -o C = "${question_response?}" ]; then
                    question_answer=c
                    question_success=y
                elif [ r = "${question_response?}" -o R = "${question_response?}" ]; then
                    question_answer=r
                    question_success=y
                else
                    display_error 'Answer must be either "c", "r"'
                fi
                ;;
            String)
                if [ -z "${question_response?}" -a ! -z "${question_default?}" ]; then
                    question_answer="${question_default?}"
                    question_success=y
                elif [ ! -z ${question_response?} ]; then
                    question_answer="${question_response?}"
                    question_success=y
                else
                    display_error 'Answer must be a string'
                fi
                ;;
            StringForceLowerCase)
                if [ -z "${question_response?}" -a ! -z "${question_default?}" ]; then
                    question_answer="$(echo "${question_default?}" | tr '[A-Z]' '[a-z]')"
                    question_success=y
                elif [ ! -z ${question_response?} ]; then
                    question_answer="$(echo "${question_response?}" | tr '[A-Z]' '[a-z]')"
                    question_success=y
                else
                    display_error 'Answer must be a string'
                fi
                ;;
            StringDNSName)
                if [ -z "${question_response?}" -a ! -z "${question_default?}" ]; then
                    question_answer="${question_default?}"
                    question_success=y
                elif [ ! -z ${question_response?} ] && echo "${question_response?}" | ${PLATFORM_EGREP?} -v '[:;()_`\"\\ ]' | ${PLATFORM_EGREP?} -qv "[']"; then
                    question_answer="${question_response?}"
                    question_success=y
                else
                    display_error 'Answer must be a valid string of DNS names (use , to separate names)'
                fi
                ;;
            StringOrBlank)
                question_answer="${question_response?}"
                question_success=y
                ;;
            Port)
                if [ -z "${question_response?}" -a ! -z "${question_default?}" ]; then
                    question_answer="${question_default?}"
                    question_success=y
                else
                    if [ ${question_response?} -gt 0 -a ${question_response?} -lt 65536 2>/dev/null ]; then
                        question_answer="${question_response?}"
                        question_success=y
                    else
                        display_error 'Answer must be a valid port number in the range 1-65535'
                    fi
                fi
                ;;
            Password4)
                if [ 1 = "${question_defined?}" ]; then
                    read -s -r -p "Confirm Password: " question_response_confirm; echo
                    if [ "${question_response?}" = "${question_response_confirm?}" ]; then
                        question_answer="${question_response?}"
                        LEN=${#question_answer}
                        if [ $LEN -lt 4 ]; then
                            question_success=n
                            display_error 'Password must be a minimum of 4 characters'
                        else
                            question_success=y
                        fi
                    else
                        display_error 'Password mismatch: Please try again'
                    fi
                else
                    question_answer="${question_response?}"
                    question_success=y
                fi
                ;;
            Password8)
                if [ 1 = "${question_defined?}" ]; then
                    read -s -r -p "Confirm Password: " question_response_confirm; echo
                    if [ "${question_response?}" = "${question_response_confirm?}" ]; then
                        question_answer="${question_response?}"
                        LEN=${#question_answer}
                        if [ $LEN -lt 8 ]; then
                            question_success=n
                            display_error 'Password must be a minimum of 8 characters'
                        else
                            question_success=y
                        fi
                    else
                        display_error 'Password mismatch: Please try again'
                    fi
                else
                    question_answer="${question_response?}"
                    question_success=y
                fi
                ;;
            Email)
                if echo "${question_response}" | ${PLATFORM_EGREP?} -q '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$' ; then
                    question_success=y
                    question_answer="${question_response?}"
                else
                    display_error 'Answer must be a valid email address that matches username@example.com'
                fi
                ;;
            *)
                ;;
        esac

    done

    eval "${question_name?}='${question_answer?}'"
}

#register_exception_handler

register_exception_handler


touch $LOGFILE


display_header "

 This script will install a default Apigee Portal & Docs here:
 $DRUPAL_WEBAPP
 as a drupal multisite serving both sites
 for more information on drupal multisites, please see this url:
 http://drupal.org/documentation/install/multi-site

 You can make changes to the URLs to which apache responds by editing
 this file and changing the 'hostname' values on lines 12 & 15.

"

question "Press RETURN to continue..." DISCARD_ME StringOrBlank

if [[ -f /etc/yum.repos.d/epel.repo ]];
then
  display_step " EPEL certs already in place... "
else

  display_step " Installing EPEL Certs "

  cd /tmp
  wget -O /tmp/primary.sqlite.bz2 http://dl.iuscommunity.org/pub/ius/stable/CentOS/6/i386/repodata/primary.sqlite.bz2 >> $LOGFILE 2>&1
  bzip2 -dc /tmp/primary.sqlite.bz2 > /tmp/primary.sqlite
  for line in $(sqlite3 ./primary.sqlite "select location_href from packages where name like '%release%' order by name;"); do
    rpm -ivh `echo "http://dl.iuscommunity.org/pub/ius/stable/CentOS/6/i386/${line}"` >> $LOGFILE 2>&1
  done
fi

display_step " Installing Packages from various repos (this may take a few minutes)..."
yum install -y gcc httpd mysql mysql-server git php54 php54-devel php54-mysql php54-pdo php54-mcrypt php54-mbstring php54-pecl-ssh2 php54-process php54-tidy php54-xmlrpc php54-xml php54-gd php54-pear gd gd-devel openssl openssl-devel ImageMagick ImageMagick-devel >> $LOGFILE 2>&1
display_step " Making sure MySQL and Apache run at startup..."

chkconfig --levels 35 mysqld on >> $LOGFILE 2>&1
chkconfig --levels 35 httpd on >> $LOGFILE 2>&1

# there are extra libraries in here meant for development and diagnosis of php issues
# installing them all doesn't hurt anything


display_step " Upgrading PEAR"
pear upgrade -f -a pear >> $LOGFILE 2>&1
display_step " Upgrading EVERYTHING"
pear upgrade-all >> $LOGFILE 2>&1
display_step " Installing Drush..."
pear config-set auto_discover 1 >> $LOGFILE 2>&1
pear channel-discover pear.drush.org >> $LOGFILE 2>&1
pear config-set preferred_state stable >> $LOGFILE 2>&1
pear install -a drush/drush >> $LOGFILE 2>&1

question "If this is a development environment, you will need to install the development installs?:" PEAR_OPTIONAL Yn

if [[ $PEAR_OPTIONAL == "Y" ]]; then
  display_step "Adding channels for Developer Installs"
  pear channel-discover pear.phing.info >> $LOGFILE 2>&1
  pear channel-update pear.php.net >> $LOGFILE 2>&1
  pear channel-discover pear.phpunit.de >> $LOGFILE 2>&1
  pear channel-update pear.phpunit.de >> $LOGFILE 2>&1
  pear channel-discover components.ez.no >> $LOGFILE 2>&1
  pear channel-update components.ez.no >> $LOGFILE 2>&1
  pear channel-discover pear.symfony-project.com >> $LOGFILE 2>&1
  pear channel-update pear.symfony-project.com >> $LOGFILE 2>&1
  pear channel-discover saucelabs.github.com/pear >> $LOGFILE 2>&1
  pear channel-update saucelabs.github.com/pear >> $LOGFILE 2>&1

  display_step " Installing PEAR libs and DRUSH (This may take a few minutes)..."
  display_step " Upgrading Console_Getopt..."
  pear upgrade -f -a Console_Getopt >> $LOGFILE 2>&1
  display_step " Installing Services_Amazon_S3..."
  pear config-set preferred_state alpha >> $LOGFILE 2>&1
  pear install -f -a pear/Services_Amazon_S3-0.3.5 >> $LOGFILE 2>&1
  display_step " Installing VersonControl_Git..."
  pear install -f -a pear/VersionControl_Git-0.4.4 >> $LOGFILE 2>&1
  display_step " Installing phpqatools..."
  pear install pear.phpqatools.org/phpqatools pear.netpirates.net/phpDox >> $LOGFILE 2>&1
  display_step " Installing Phing..."
  pear install -a phing/phing >> $LOGFILE 2>&1
  display_step " Installing eZComponents..."
  pear install -a ezc/eZComponents >> $LOGFILE 2>&1
  display_step " Installing DbUnit..."
  pear install -f -a phpunit/DbUnit-1.0.3 >> $LOGFILE 2>&1
  display_step " Installing File_Iterator..."
  pear install -f -a phpunit/File_Iterator-1.2.6 >> $LOGFILE 2>&1
  display_step " Installing PHPUnit_MockObject..."
  pear install -f -a phpunit/PHPUnit_MockObject-1.0.9 >> $LOGFILE 2>&1
  display_step " Installing PHP_CodeCoverage..."
  pear install -f -a phpunit/PHP_CodeCoverage-1.0.5 >> $LOGFILE 2>&1
  display_step " Installing PHP_Invoker..."
  pear install -f -a phpunit/PHP_Invoker-1.0.0 >> $LOGFILE 2>&1
  display_step " Installing PHP_Timer..."
  pear install -f -a phpunit/PHP_Timer-1.0.2 >> $LOGFILE 2>&1
  display_step " Installing PHP_TokenStream..."
  pear install -f -a phpunit/PHP_TokenStream-1.0.1 >> $LOGFILE 2>&1
  display_step " Installing Text_Template..."
  pear install -f -a phpunit/Text_Template-1.1.0 >> $LOGFILE 2>&1
  display_step " Installing PHPUnit_Selenium_SauceOnDemand..."
  pear install -a saucelabs/PHPUnit_Selenium_SauceOnDemand >> $LOGFILE 2>&1

fi



display_step " Installing a few final RPMS..."


yum install -y php54-pecl-apc php54-pecl-imagick php54-pecl-ssh2 >> $LOGFILE 2>&1


display_step " Starting/Restarting Services..."


service httpd start >> $LOGFILE 2>&1
service mysqld start >> $LOGFILE 2>&1


display_step " Cloning the Apigee-Drupal release into /tmp/apigee-drupal..."


git clone -b releases git://github.com/apigee/apigee-drupal /tmp/apigee-drupal >> $LOGFILE 2>&1


display_step " Copying the webapp folder into /var/www/html ... "


cp -R -t $DRUPAL_WEBAPP /tmp/apigee-drupal/webapp/* /tmp/apigee-drupal/webapp/.ht*  >> $LOGFILE 2>&1
chown -R apache.apache /var/www/html >> $LOGFILE 2>&1
chmod -R 775 /var/www/html >> $LOGFILE 2>&1
cp /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd.conf.distro >> $LOGFILE 2>&1
cp /tmp/apigee-drupal/install/httpd.conf /etc/httpd/conf/httpd.conf >> $LOGFILE 2>&1
service httpd restart >> $LOGFILE 2>&1

echo "<?php " > "/var/www/html/sites/sites.php"



display_step " Installing the portal..."



export PORTAL_DB_PASSWORD=`openssl rand -base64 12 | sed -e "s/[^0-9a-zA-Z]//g"`
export PORTAL_DB_RANDUSER=`openssl rand -base64 8 | sed -e "s/[^0-9a-zA-Z]//g"`
export PORTAL_DB_USERNAME="user-${PORTAL_DB_RANDUSER}"

mkdir -p $DRUPAL_WEBAPP/sites/portal/{public,tmp,private}


mysql -u root -e "create database if not exists portal";
mysql -u root portal < $PORTAL_DB_SOURCE
mysql -u root -e "CREATE USER '${PORTAL_DB_USERNAME}'@'localhost' IDENTIFIED BY '${PORTAL_DB_PASSWORD}';"
mysql -u root -e "grant all on portal.* to '${PORTAL_DB_USERNAME}'@'localhost';"
mysql -u root -e 'FLUSH PRIVILEGES;'


# Create drupal site config
(
echo '<?php'
echo '$databases = array('
echo "  'default' =>"
echo "    array ("
echo "      'default' =>"
echo "        array ("
echo "	'database' => 'portal',"
echo "	'username' => '${PORTAL_DB_USERNAME}',"
echo "	'password' => '${PORTAL_DB_PASSWORD}',"
echo "	'host' => 'localhost',"
echo "	'port' => '',"
echo "	'driver' => 'mysql',"
echo "	'prefix' => '',"
echo "	),"
echo "    ),"
echo ");"
echo '$update_free_access = FALSE;'
echo '$drupal_hash_salt = "";'
echo "ini_set('session.gc_probability', 1);"
echo "ini_set('session.gc_divisor', 100);"
echo "ini_set('session.gc_maxlifetime', 200000);"
echo "ini_set('session.cookie_lifetime', 2000000);"
) > "${DRUPAL_WEBAPP}/sites/portal/settings.php"


# Add FQDN to sites/sites.php
(
echo "\$sites['${PORTAL_HOSTNAME}'] = 'portal';"
) >> "${DRUPAL_WEBAPP}/sites/sites.php"



display_step " Installing the documentation..."



export DOCS_DB_PASSWORD=`openssl rand -base64 12 | sed -e "s/[^0-9a-zA-Z]//g"`
export DOCS_DB_RANDUSER=`openssl rand -base64 8 | sed -e "s/[^0-9a-zA-Z]//g"`
export DOCS_DB_USERNAME="user-${DOCS_DB_RANDUSER}"

mkdir -p ${DRUPAL_WEBAPP}/sites/docs/{public,tmp,private}

mysql -u root -e "create database if not exists docs";
mysql -u root docs < $DOCS_DB_SOURCE
mysql -u root -e "CREATE USER '${DOCS_DB_USERNAME}'@'localhost' IDENTIFIED BY '$DOCS_DB_PASSWORD';"
mysql -u root -e "grant all on docs.* to '${DOCS_DB_USERNAME}'@'localhost';" docs
mysql -u root -e 'FLUSH PRIVILEGES;' docs


# Create drupal site config
(
echo '<?php'
echo '$databases = array('
echo "  'default' =>"
echo "    array ("
echo "      'default' =>"
echo "        array ("
echo "	'database' => 'docs',"
echo "	'username' => '${DOCS_DB_USERNAME}',"
echo "	'password' => '${DOCS_DB_PASSWORD}',"
echo "	'host' => 'localhost',"
echo "	'port' => '',"
echo "	'driver' => 'mysql',"
echo "	'prefix' => '',"
echo "	),"
echo "    ),"
echo ");"
echo '$update_free_access = FALSE;'
echo '$drupal_hash_salt = "";'
echo "ini_set('session.gc_probability', 1);"
echo "ini_set('session.gc_divisor', 100);"
echo "ini_set('session.gc_maxlifetime', 200000);"
echo "ini_set('session.cookie_lifetime', 2000000);"
) > "${DRUPAL_WEBAPP}/sites/docs/settings.php"


# Add FQDN to sites/sites.php
(
echo "\$sites['${DOCS_HOSTNAME}'] = 'docs';"
) >> "${DRUPAL_WEBAPP}/sites/sites.php"

chown -R apache.apache /var/www/html
chmod -R 775 /var/www/html

drush dl registry_rebuild >> $LOGFILE 2>&1

cd /var/www/html/sites/docs

drush rr >> $LOGFILE 2>&1
drush vset preprocess_css 0 --yes >> $LOGFILE 2>&1
drush vset preprocess_js 0 --yes >> $LOGFILE 2>&1
drush cc all >> $LOGFILE 2>&1

cd /var/www/html/sites/portal

drush rr >> $LOGFILE 2>&1
drush vset preprocess_css 0 --yes >> $LOGFILE 2>&1
drush vset preprocess_js 0 --yes >> $LOGFILE 2>&1
drush cc all >> $LOGFILE 2>&1

(
echo "# Firewall configuration written by system-config-firewall"
echo "# Manual customization of this file is not recommended."
echo "*filter"
echo ":INPUT ACCEPT [0:0]"
echo ":FORWARD ACCEPT [0:0]"
echo ":OUTPUT ACCEPT [0:0]"
echo "-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT"
echo "-A INPUT -p icmp -j ACCEPT"
echo "-A INPUT -i lo -j ACCEPT"
echo "-A INPUT -m state --state NEW -m tcp -p tcp --dport 22 -j ACCEPT"
echo "-A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT"
echo "-A INPUT -j REJECT --reject-with icmp-host-prohibited"
echo "-A FORWARD -j REJECT --reject-with icmp-host-prohibited"
echo "COMMIT"
) > /etc/sysconfig/iptables

service iptables restart >> $LOGFILE 2>&1

cleanup_noerror
