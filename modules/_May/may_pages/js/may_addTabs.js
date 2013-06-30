(function ($) {

  Drupal.behaviors.may_addTabs = {
    attach: function (context, settings) {

        //console.log('Tabs!');
        $( ".data.tabs" ).tabs();
        
    }
  };

}(jQuery));