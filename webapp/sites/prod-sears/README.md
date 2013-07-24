# Apigee Developer Portal Customization Repository Template

##Purpose:
 * Provide a template directory structure for your repository
 * Assist in developing Drupal best practices
 * Ensure a structure that will integrate with Apigee automated deployment processes

### Basic Directory Structure
 * Repository Root - preferably named after your organization
   * files
   * libraries
   * modules
     * custom -- location of your custom modules
   * private
   * themes
   * tmp

## Getting Started
 * Download this repository from Github.  
 * Rename the root directory from DevPortal_Customization to something more specific to your organization.
 * Create a new Github repos for your organization based off this directory structure.
 * Start commiting your changes.


## Common Changes

### Custom Modules
If you are needing to create custom modules to support your specific business needs
place those modules in the **modules/custom** directory.  Optionally, if you are looking
to install a contrib module, you can place it in the modules or custom directory.  

Be sure to follow Drupal development best practices and keep your theme changes distinct from custom modules.

### Custom Themes
Company Brand is the most common way that customers customize their portal.  A custom
theme can be added to the **themes** directory to give your portal a completely new look and feel
to match your brand.
