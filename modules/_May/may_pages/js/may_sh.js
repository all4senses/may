(function ($) {

  Drupal.behaviors.may_sh = {
    attach: function (context, settings) {
       
       function myJsonMethod(data){console.log(data);}
       
       $(".light a").click(function(){
         
         console.log('click');
         console.log(this);
         //console.log('href = ' + $(this).attr('href'));
         //console.log('title = ' + $(this).attr('title'));

//         console.log($(this));
//         if ($(this).hasClass('on')) {
//           console.log('on');
//         }
//         else if ($(this).hasClass('off')) {
//           console.log('off');
//         }
//         else if ($(this).hasClass('switch')) {
//           console.log('switch');
//         }
//         else if ($(this).hasClass('refresh')) {
//           console.log('refresh');
//         }
//         
//         return false;
         
         (jQuery).ajax({
            
                url: '/sh-get', 
                data: {
                        type: 'button_light',
                        id: $(this).parent().attr('id'),
                        class: $(this).attr('class'),
                        access: $("#pass").val(),
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
                                console.log('The data is arrived from the middle Server!');
                                console.log(data);
                                //console.dir(data);
                                
                                if(!data.error) { 
                                                        
                                                        (jQuery).ajax({

                                                                  url: 'http://smart1977.ddns.net', 
                                                                  /*
                                                                  data: {
                                                                        access: 'xxx',
                                                                        op: 4,
                                                                        lamp: 0
                                                                        //id: $(this).attr('id'),
                                                                        //class: $(this).attr('class'),
                                                                        //click_page: window.location.href,
                                                                        //url: $(this).attr('href'),
                                                                        //title: $(this).attr('title')
                                                                        //,referer: document.referrer

                                                                  }, 
                                                                  */    
                                                                      
                                                                  data: data.data,
                                                                 
                                                                  type: 'GET', 
                                                                  //dataType: 'json'
                                                                  dataType: 'jsonp'

                                                                  , 
                                                                  jsonp: false,
                                                                  jsonpCallback: "myJsonMethod",
                                                                  success: function(data_2) 
                                                                          { 
                                                                              console.log('NEW The data is arrived from Arduino!');
                                                                              console.log(data_2);
                                                                              
                                                                              if(!data_2.error) {
                                                                                for (var key in data_2) {
                                                                                  if (data_2.hasOwnProperty(key)) {
                                                                                    console.log(key + ': ' + data_2[key]);
                                                                                    //alert(data[key].msg);
                                                                                  }
                                                                                }
                                                                              }
                                                                              return false;
                                                                          }
                                                                   ,error: function(e) { console.log(e.message); }

                                                            }); // end of (jQuery).ajax
                                    
                                }
                                return false;
                            } 
                     
            }); // end of (jQuery).ajax
        
        
        
        
        
        
            return false;

       }); // End of $(".light").click(function(){

       
    }
  };

}(jQuery));
