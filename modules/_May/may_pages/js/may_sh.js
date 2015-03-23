(function ($) {

  Drupal.behaviors.may_sh = {
    attach: function (context, settings) {
       
       function myJsonMethod(data){console.log(data);}
       
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
                                console.log(data);
                                //console.dir(data);
                                
                                if(!data.error) { 
                                                  
                                                        console.log('The data is arrived from the middle Server!');
                                                        
                                                        console.log(data.data);
                                                        //return;
                                                        
                                                        
                                    
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
                                                                  success: function(data) 
                                                                          { 
                                                                              console.dir(data);
                                                                              //data = JSON.parse(data);
                                                                              console.log(data);
                                                                              console.log(data.status);

                                                                              for (var key in data) {
                                                                                if (data.hasOwnProperty(key)) {
                                                                                  console.log(key + ': ' + data[key]);
                                                                                  //alert(data[key].msg);
                                                                                }
                                                                              }

                                                                              if(!data.error) {
                                                                                  console.log('NEW The data is arrived from Arduino!');
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
