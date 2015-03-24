(function ($) {

  Drupal.behaviors.may_sh = {
    attach: function (context, settings) {
       
       function myJsonMethod(data){
         //console.log(data);
       }
       
       $(".light a").click(function(){
         
         console.log('click');
         console.log(this);
         //console.log('href = ' + $(this).attr('href'));
         //console.log('title = ' + $(this).attr('title'));

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
                    
                    ,success: function(data) 
                            { 
                                console.log('The data is arrived from the middle Server!');
                                console.log(data);
                                console.dir(data);
                                
                                if(!data.error && data.status) { 
                                  
                                                        console.log('Sending to arduino...');
                                                        
                                                        (jQuery).ajax({

                                                                  url: data.url,
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
                                                                              
                                                                              if(!data_2.error && data_2.status) {
                                                                                for (var key in data_2) {
                                                                                  if (data_2.hasOwnProperty(key)) {
                                                                                    console.log(key + ': ' + data_2[key]);
                                                                                    //alert(data[key].msg);
                                                                                  }
                                                                                }
                                                                                
                                                                                // Set the current lamp state.
                                                                                console.log('data_2.state = ' + data_2.state);
                                                                                $('#l-' + data.data.lamp + ' input').attr('checked', data_2.state == '1' ? true : false);
                                                                              }
                                                                              else {
                                                                                console.log('Error status False from SH...');
                                                                              }
                                                                              return false;
                                                                          }
                                                                   ,error: function(e) { 
                                                                              console.log('Error from SH...');
                                                                              console.log(e.message); 
                                                                           }

                                                            }); // end of (jQuery).ajax
                                    
                                }
                                else {
                                  console.log('Error status False from Middle server...');
                                }
                                return false;
                            } // End of Success (request to the Middle Server).
                            
                    ,error: function(e) { 
                        console.log('Error from SH...');
                        console.log(e.message); 
                     }
                     
            }); // end of (jQuery).ajax
        
        
        
        
        
            // Prevent of clicking the link event.
            return false;

       }); // End of $(".light").click(function(){

       
    }
  };

}(jQuery));
