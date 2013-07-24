<?php global $user; $current_path = implode("/", arg()); ?>
<header id="navbar" role="banner" class="navbar">
    <?php if ($logo): ?>
    <div class="logo-inner">    
      <a class="brand" href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>">
        <img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
      </a>
    </div>  
    <?php endif; ?>
  <div class="navbar-inner">
    <div class="container">
      <div class="nav-collapse">
        <nav role="navigation">
          <?php if ($main_menu): ?>
            <?php print theme('links__system_main_menu', array('links' => $main_menu, 'attributes' => array('id' => 'main-menu', 'class' => array('nav')))); ?> 
          <?php endif; ?>
          <div id='login-buttons' class="pull-right">  
          <?php if ($user->uid == 0) { ?>
          <!-- show/hide login and register links depending on site registration settings -->
          <?php if (($user_reg_setting != 0) || ($user->uid == 1)): ?>
            <?php if($page['login']): ?>
              <div class="login">
                  <?php print render($page['login']); ?>
              </div>
            <?php endif; ?>
          <?php endif; ?>
          <?php } else {
            $user_url =  "user/".$user->uid; ?>
            <ul class="nav pull-right">
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="<?php print $user -> mail; ?>"><?php print $truncated_user_email; ?><b class="caret"></b></a>
                <ul class="dropdown-menu">
                  <?php if (module_exists('devconnect_developer_apps')): ?>
                  <li class="first"><?php echo l('My Apps', $user_url . '/apps'); ?></li>
                  <?php endif; ?>
                  <li><?php echo l('Edit Profile', $user_url . '/edit'); ?></li>
                </ul>
              </li>
              <li><?php echo l(t("logout"), "user/logout"); ?></li>
            </ul>  
          <?php } ?>
          </div>
        </nav>
      </div>
      <?php if ($page['search']): ?>
      <div class="search-container">
        <?php print render($page['search']); ?>
      </div>    
      <?php endif; ?>
    </div>
  </div>
</header>
<div class="master-container">
  <!-- Header -->
  <header role="banner" id="page-header">
    <?php print render($page['header']); ?>
  </header>
  <?php if ($breadcrumb): ?>
  <!-- Breadcrumbs -->
  <div id="breadcrumb-navbar">
    <div class="container">
      <div class="row">
        <div class="span24">
        <?php print ($breadcrumb); ?>
        </div>
      </div>
    </div>
  </div>
  <?php endif;?>
  <!-- Title -->
  <?php if (drupal_is_front_page()): ?>
  <section class="page-header">
    <div class="container">
      <div class="row">
        <div class="span9">
          <div class="title">
            <?php if (theme_get_setting('welcome_message')): ?>
              <h1><?php print theme_get_setting('welcome_message'); ?></h1>
            <?php else: ?>
              <h1><span class="welcome">Welcome</span><br />to the&nbsp;<span><?php print $site_name ?></h1></span>
            <?php endif; ?>
           </div>
        </div>
      </div>
      <div class="page-header-content">
        <?php print render($page['homepage_header']); ?>
      </div>
    </div>
  </section>
  <?php else: ?>
    <?php if ($page['subpage_header']): ?>   
    <section class="page-header with-subpage-header">
    <?php else: ?>
    <section class="page-header">
    <?php endif; ?> 
        <div class="container">
          <div class="row">
            <span class="<?php print _apigee_base_content_span($columns); ?>">
              <!-- Title Prefix -->
              <?php print render($title_prefix); ?>
              <!-- Title -->
              <h1><?php print render($title); ?></h1>
              <!-- SubTitle -->
              <h2 class="subtitle"><?php print render($subtitle); ?></h2>              
              <!-- Title Suffix -->
              <?php print render($title_suffix); ?>
            </span>
            <?php if ($page['subpage_header']): ?>            
              <div class="page-header-content">
                <?php print render($page['subpage_header']); ?>
              </div>
            <?php endif; ?>              
          </div>
        </div>
    </section>
  <?php endif; ?>
  <div class="page-content">
    <div class="container">
      <?php print $messages; ?>
      <?php if ($page['help']): ?>
        <div class="well"><?php print render($page['help']); ?></div>
      <?php endif; ?>
      <?php if ($action_links): ?>
        <ul class="action-links"><?php print render($action_links); ?></ul>
      <?php endif; ?>
      <div class="row">
        <!-- Sidebar First (Left Sidebar)  -->
        <?php if ($page['sidebar_first']): ?>
          <aside class="span6 pull-left" role="complementary">
            <?php print render($page['sidebar_first']); ?>
          </aside>
        <?php endif; ?>
        <!-- Main Body  -->
        <section class="<?php print _apigee_base_content_span($columns); ?>">
          <?php if ($page['highlighted']): ?>
            <div class="highlighted hero-unit"><?php print render($page['highlighted']); ?></div>
          <?php endif; ?>
          <?php if (($tabs) && (!$is_front)): ?>
            <?php print render($tabs); ?>
          <?php endif; ?>
          <a id="main-content"></a>
          <?php print render($page['content']); ?>
        </section>
        <!-- Sidebar Second (Right Sidebar)  -->
        <?php if ($page['sidebar_second']): ?>
          <aside class="span6 pull-right" role="complementary">
            <?php print render($page['sidebar_second']); ?>
          </aside>  <!-- /#sidebar-second -->
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>
<!-- Footer  -->
<footer class="footer">
  <div class="footer-inner">
    <div class="container">
      <?php print render($page['footer']); ?>       
    </div>      
  </div>
  <div class="container">
      <div class="copy">&copy; <?php print date("Y"); ?> Sears.  All rights reserved.</div>     
  </div>
</footer>
