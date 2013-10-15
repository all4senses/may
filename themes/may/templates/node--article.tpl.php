<?php 

  $class_thumb_presented = '';
  
  if($view_mode == 'home_teaser') {

    $body = isset($node->body['und'][0]['value']) ? $node->body['und'][0]['value'] : $node->body[0]['value'];

    $teaser_data = may_misc_getArticleTeaserData('all', $body, $node->nid, 270);

    if (!empty($node->field_extra_data['und'][0]['value'])) {
      $extra_data = unserialize($node->field_extra_data['und'][0]['value']);
      $extra_data['guest_author'] = $author_name = !empty($extra_data['guest_author']) ? $extra_data['guest_author'] : NULL;
    }

    if (!$extra_data['guest_author']) {
      $authorExtendedData = may_misc_loadUserExtendedData($node->uid);
      $author_name = $authorExtendedData->realname;
    }

    echo $teaser_data['main_image_html'] . '<h3>'. l($node->title, 'node/' . $node->nid) . '</h3><div class="submitted">By <span class="author">' . $author_name . '</span> / ' . date('F d, Y', $node->created) . '</div>' 
            . '<div class="teaser">' . $teaser_data['teaser_only'] . '</div>';

    return;
  }
  elseif ($view_mode == 'side_block_teaser_latestBlogsOnNews') {
    $main_image = unserialize($node->field_main_image['und'][0]['value']);
    
    $out = '<div class="block-thumb">' . theme('may_misc_image_style', array('style_name' => 'block_thumb', 'src' => $main_image['src'], 'path' => $main_image['uri'], 'alt' =>  (@$main_image['alt'] ? $main_image['alt'] : $title), 'title' => $title )) . '</div>' . l($node->title, 'node/' . $node->nid);
    echo $out;
    return;
  }
  elseif($view_mode == 'side_block_teaser') {
    
      if (!empty($node->field_extra_data['und'][0]['value'])) {
        $extra_data = unserialize($node->field_extra_data['und'][0]['value']);
      }
  
     if (!empty($extra_data['teaser_side_block'])) {
        $teaser_data = $extra_data;
      }
      else {
        $teaser_data = may_misc_getArticleTeaserData('all', $node->body['und'][0]['value'], $node->nid);
      }
      
      if (!empty($teaser_data['side_block_main_image'])) {
        $class_thumb_presented = ' with_thumb';
      }
      
  }
?>


<?php if (!$page): ?>
  <article id="node-<?php print $node->nid; ?>" class="<?php print $classes . $class_thumb_presented; ?> clearfix"<?php print $attributes; ?>>
  <!-- <div class="inside"> -->
<?php else: ?>
  
    <?php 
    
      $url = 'http://dommoejmechty.com'. url('node/' . $node->nid);

          if (isset($node->metatags['title']['value']) && $node->metatags['title']['value']) {
            $share_title = $node->metatags['title']['value'];
          }
          else {
            $share_title = $title;
          }

        echo '<div class="float share">' . may_blocks_getSocialiteButtons($url, $share_title) . '</div>';

    ?>

  <div class="main-content"> 
<?php endif; ?>

 
  
 
          

      <?php if (!$page): ?>
        <?php 
          if (!empty($teaser_data['side_block_main_image'])) {
            echo $teaser_data['side_block_main_image']; 
          }
        ?>
        <header>
      <?php endif; ?>

          <?php if ($page): ?>
          <h1 
          <?php else: ?>
          <h2 
          <?php endif; ?>
              
            <?php print ' ' . /*$title_attributes*/ /*preg_replace('/datatype=".*"/', '', $title_attributes);*/ ''/*preg_replace('/datatype=""/', '', $title_attributes)*/; 
            if (!$node->status) {echo ' class="not-published"';} 
            ?>><?php if (!isset($node->title_no_link) && !$page): ?><a href="<?php print $node_url; ?>"><?php print $title; ?></a>
            <?php else: ?><?php print $title; ?><?php endif; ?><?php if ($page): ?></h1><?php else: ?></h2><?php endif; ?> 


          <span class="submitted">
            <?php 
            
              $created_str = date('F d, Y \a\t g:ia', $node->created);
              $created_rdf = preg_replace('|(.*)content=\"(.*)\"\s(.*)|', '$2', $date); //date('Y-m-d\TH:i:s', $node->created); 
              
              $paths_with_latest_article = FALSE;
              if (!$page) {
                $paths_with_latest_articles = array('/compare-business-voip-providers', '/compare-residential-voip-providers', '/business-voip-features', '/sip-trunking-providers', '/canada-voip', '/internet-fax-service-providers');
                if ($_SERVER['REQUEST_URI'] == '/' || in_array(@$_SERVER['REDIRECT_URL'], $paths_with_latest_articles)) {
                  $paths_with_latest_article = TRUE;
                }
              }
              
              $extra_data['guest_author'] = NULL;
              if (!empty($node->field_extra_data['und'][0]['value'])) {
                $extra_data = unserialize($node->field_extra_data['und'][0]['value']);
                dpm($extra_data);
                $extra_data['guest_author'] = $author_name = !empty($extra_data['guest_author']) ? $extra_data['guest_author'] : NULL;
              }
              
              if (!$extra_data['guest_author'] && ($page || $node->type == 'article' || $paths_with_latest_article) ) {
                $authorExtendedData = may_misc_loadUserExtendedData($node->uid);
                $author_name = $authorExtendedData->realname;
              }
            
              if ($page) {
                
               
                if ($node->uid) {
                  
                  global $language;
                  
                  if (!$extra_data['guest_author']) {
                    $author_url = url('user/' . $node->uid);
                    $gplus_profile = ($authorExtendedData->field_u_gplus_profile_value) ? ' <a class="gplus" title="Google+ profile of ' . $author_name . '" href="' . $authorExtendedData->field_u_gplus_profile_value . '?rel=author">(G+)</a>' : '';
                    $author_title = t('!author\'s profile', array('!author' => $author_name));
                  }
                  
                  $submitted = '<span property="dc:date dc:created" content="' . $created_rdf . '" datatype="xsd:dateTime" rel="sioc:has_creator">' .
                                  'By' . ':' .
                          
                                  (!$extra_data['guest_author'] ? '<a href="' . $author_url . '" title="' . $author_title . '" class="username" lang="' . $language->language . '" xml:lang="' . $language->language . '" about="' . $author_url . '" typeof="sioc:UserAccount" property="foaf:name">' . $author_name . '</a>' . $gplus_profile : '<span class="guest-author">' . $author_name . '</span>') .
                          
                                  ($node->type == 'article' ? '' : '<span class="delim">|</span>' . $created_str) .
                          
                               '</span>';
                  
                 
                }
                else {
                  $submitted = '<span property="dc:date dc:created" content="' . $created_rdf . '" datatype="xsd:dateTime" rel="sioc:has_creator">' .
                                  'By' . ':' .
                                  '<span class="username">' .
                                    'Guest' .
                                  '</span>' .
                                  ($node->type == 'article' ? '' : '<span class="delim">|</span>' . $created_str) .
                               '</span>';
                  
                }
                
                echo $submitted;
              }
              else {
                  if ($view_mode == 'side_block_teaser') {
                    echo date('F d, Y', $node->created);;
                  }
                  elseif ($paths_with_latest_article) {
                    // Home page articles teasers.
                    $type_cations = array('blog_post' => 'Blog', 'news_post' => 'News', 'article' => 'Article');
                    echo ($_SERVER['REQUEST_URI'] != '/' ? $type_cations[$node->type] . ' - ' : '') . 'By <span class="author">' , $author_name, '</span>' /*l($author_name, 'user/' . $node->uid, array('attributes' => array('title' => $author_name . '\'s profile', 'class' => 'username')))*/, ' / ', date('F d, Y', $node->created) /*may_misc_elapsed_time($node->created)*/;
                  }
                  else {
                    if ($node->type == 'article') {
                      echo 'By' , ': ' , $author_name;
                    }
                    else {
                      echo $created_str;
                    }
                  }
              }
              
            ?>
          </span>


      <?php if (!$page): ?>
        </header>
      <?php endif; ?>



      <div class="content <?php echo ($page ? 'page' : 'teaser'); ?>"<?php print $content_attributes; ?>>
        <?php
          // Hide comments, tags, and links now so that we can render them later.
          hide($content['comments']);
          hide($content['links']);
          
          
          if (!$page) {
            if ($view_mode == 'side_block_teaser') {
              echo $teaser_data['teaser_side_block'];
            }
            // $path_with_latest_article is defined above.
            elseif ($paths_with_latest_article) {
              // Show an other teaser on the home page.
              $extra_data = unserialize($node->field_extra_data['und'][0]['value']);
              if (isset($extra_data['teaser_home'])) {
                echo $extra_data['teaser_home'];
              }
              else {
                echo $extra_data['teaser_block'];
              }
            }
            else {
              // TODO: Temporary check. Should be removed after all articles resave.
              if (isset($node->field_a_teaser['und'][0]['value']) && $node->field_a_teaser['und'][0]['value']) {
                echo $node->field_a_teaser['und'][0]['value'];
              }
              else {
                $teaser_data = may_misc_getArticleTeaserData('all', $content['body'][0]['#markup'], $node->nid);
                echo $teaser_data['teaser'];
              }
            }
            
            hide($content['body']);
          }
          
         
          $keyword_metatag_name = ($node->type == 'news_post') ? 'news_keywords' : 'keywords';
          
          if (isset($content['metatags']['keywords'])) {
            hide($content['metatags']['keywords']);
          }
          
          if (isset($content['metatags']['keywords']['#attached']['drupal_add_html_head'][0][0]['#value']) && $content['metatags']['keywords']['#attached']['drupal_add_html_head'][0][0]['#value']) {
            may_misc_addMetatag($keyword_metatag_name, $content['metatags']['keywords']['#attached']['drupal_add_html_head'][0][0]['#value']);
          }
          
          echo render($content);
        ?>
      </div>



      <?php if ($page): ?>
    
                  <footer>

                    <div class="share">

                      

                      <div class="others">
                        <!-- ADDTHIS BUTTON BEGIN -->
                        <script type="text/javascript">
                        var addthis_config = {
                            //pubid: "all4senses"
                        }
                        var addthis_share =
                        {
                          // ... members go here
                          url: "<?php echo $url?>"
                        }
                        </script>

                        <div class="addthis_toolbox addthis_default_style" addthis:url="<?php echo $url?>">
                          <a href="http://addthis.com/bookmark.php?v=250&amp;pub=all4senses"></a>
                          <a class="addthis_button_email" title="E-mail this page link"><?php echo t('Email This Post'); ?></a>
                          <a class="addthis_button_tumblr"></a>
                          <a class="addthis_button_hackernews"></a>
                          <a class="addthis_button_digg"></a>
                          <a class="addthis_button_reddit"></a>
                          <a class="addthis_button_stumbleupon"></a>

                          <a class="addthis_button_compact"></a>
                        </div>
                        <script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pub=all4senses"></script>
                        <!-- ADDTHIS BUTTON END -->

                      </div>

                    </div>
                  </footer>
    
    
      <?php endif; ?>
    
      <div class="bottom-clear"></div>
 

    
  <?php //print render($content['comments']); ?>

<?php if (!$page): ?>
  <!-- </div> --> <!-- /.inside -->
  <!-- <div class="shadow"></div> -->
  </article> <!-- /.node -->
<?php endif; ?>


