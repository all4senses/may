<div id="bshadow">
    
  <?php
  /*
  <div id="skip-link">
    <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
    <?php if ($main_menu): ?>
      <a href="#navigation" class="element-invisible element-focusable"><?php print t('Skip to navigation'); ?></a>
    <?php endif; ?>
  </div>
  */
  ?>

  
  <header id="header" role="banner" class="clearfix">

    <nav id="navigation" role="navigation" class="clearfix">
      <div id="header-menu-back"></div>
      
      <div id="logo-block">
        <a href="<?php print $front_page; ?>" title="<?php print 'GetVoIP Home'; ?>" id="logo">
          <img src="http://dommoejmechty.com/sites/all/themes/may/css/images/may-logo.png" alt="May" title="MayP" />
        </a>
        <div class="descr">
          <div class="title">Home of your dream</div>
          <div class="subtitle">Made Easy!</div>
        </div>
      </div>
      
      <?php 
          global $user;

          echo render($page['header']); 
          
          echo may_blocks_getBlockThemed(array('module' => 'om_maximenu', 'delta' => 'om-maximenu-1', 'no_subject' => TRUE, 'class' => 'block-om-maximenu', 'shadow' => FALSE), TRUE, '+31 day', ($user->uid ? '_logged' : NULL));
          
      ?>
    </nav> <!-- /#navigation -->

    <?php ////if ($breadcrumb): print $breadcrumb; endif;?>
  </header> <!-- /#header -->

  
  <?php /* if ($page['highlighted']): ?>
    <section id="highlighted" class="clearfix">
      <?php print render($page['highlighted']); ?>
    </section>
  <?php endif; */ ?>
  
  
  <div id="all-content" class="clearfix">
      
      
    
      <section id="main" role="main" class="clearfix">

          <?php 
            if ($breadcrumb): 
              print $breadcrumb; 
            endif;
          ?>
        
          <?php 
          
            print $messages; 
            
          ?>
          <a id="main-content"></a>
          
          <?php if (!empty($tabs['#primary'])): ?><div class="tabs-wrapper clearfix"><?php print render($tabs); ?></div><?php endif; ?>
          <?php print render($page['help']); ?>
          <?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
          
          <?php print render($page['above_content']); ?>
          <?php print render($page['content']); ?>
          
          
      </section> <!-- /#main -->


      <?php if ($page['sidebar_first']): ?>
        <aside id="sidebar-first" role="complementary" class="sidebar clearfix">
          <?php print render($page['sidebar_first']); ?>
        </aside>  <!-- /#sidebar-first -->
      <?php endif; ?>

      <?php if ($page['sidebar_second']): ?>
        <aside id="sidebar-second" role="complementary" class="sidebar clearfix">
          <?php print render($page['sidebar_second']); ?>
        </aside>  <!-- /#sidebar-second -->
      <?php endif; ?>

  </div> <!-- /#all-content -->

  </div> <!-- <div id="bshadow"> -->


  
  <footer id="footer" role="contentinfo" class="clearfix">
   <div id="footer-inside">

   
    
    <?php
      
      

        echo '<div id="block-may-blocks-follow-links"><div class="follow-us">Follow Us</div>', may_blocks_get_headerLinks(), '</div>';
        
        echo render($page['footer']);
        
        ?>
     
    
            <div class="c">May<div>© 2013 | All Rights Reserved</div>
</div>

    
   </div>
  </footer> <!-- /#footer -->

