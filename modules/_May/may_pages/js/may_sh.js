(function ($) {

  Drupal.behaviors.may_sh = {
    attach: function (context, settings) {
       
       
       $(".light").click(function(){
         
         console.log('click');
         console.log(this);
         //console.log('href = ' + $(this).attr('href'));
         //console.log('title = ' + $(this).attr('title'));

         (jQuery).ajax({
            
                url: '/sh-get', 
                data: {
                        type: 'button_click',
                        id: $(this).attr('id'),
                        class: $(this).attr('class'),
                        //click_page: window.location.href,
                        //url: $(this).attr('href'),
                        //title: $(this).attr('title')
                        //,referer: document.referrer
                       
                      }, 
                    type: 'POST', 
                    dataType: 'json'
                    
                    , 
                    success: function(data) 
                            { 
                                console.log(data);
                                if(!data.error) {
                                    console.log('The data is arrived!');
                                }
                                return false;
                            } 
                     
            }); // end of (jQuery).ajax
        


       });

       
    }
  };

}(jQuery));
