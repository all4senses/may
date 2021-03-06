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

         var wait = $(this).parent().find('.wait');
         $(wait).show();
         
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
                                //console.dir(data);
                                
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
                                                                                
//                                                                                for (var key in data_2) {
//                                                                                  if (data_2.hasOwnProperty(key)) {
//                                                                                    console.log(key + ': ' + data_2[key]);
//                                                                                    //alert(data[key].msg);
//                                                                                  }
//                                                                                }
                                                                                
                                                                                // Set the current lamp state.
                                                                                //console.log('data_2.state = ' + data_2.state);
                                                                                //$('#l-' + data.data.lamp + ' input').attr('checked', data_2.state == '1' ? true : false);
                                                                                
                                                                                
                                                                                if (data_2.state !== null && typeof data_2.state === 'object') {
                                                                                      // All lamp set/read results
                                                                                      //console.log('Object!');
                                                                                      $.each(data_2.state, function(index, value) {
                                                                                          //console.log(index + ":" + value);
                                                                                          update_light_state_on_page (index, value);
                                                                                      }); 
                                                                                }
                                                                                else {
                                                                                      // One lamp set/read results
                                                                                      //console.log('String!');
                                                                                      
                                                                                      /*
                                                                                      if (data_2.state == '1') {
                                                                                        $('#l-' + data.data.lamp + ' .state').addClass('on');
                                                                                      }
                                                                                      else {
                                                                                        $('#l-' + data.data.lamp + ' .state').removeClass('on');
                                                                                      }

                                                                                       // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Getter
                                                                                       // http://stackoverflow.com/questions/20456712/how-to-get-current-time-with-jquery
                                                                                       // http://stackoverflow.com/questions/14529381/leading-zeros-in-minutes
                                                                                       // http://stackoverflow.com/questions/17996874/leading-0-missing-from-data-and-time
                                                                                       // http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
                                                                                      var dNow = new Date(); 
                                                                                      //var localdate = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' + dNow.getFullYear() + ', ' + dNow.getHours() + ':' + dNow.getMinutes() + ':' + dNow.getSeconds(); 
                                                                                      var localdate = dNow.getDate() + '/' + ('0' + (dNow.getMonth()+1)).slice(-2) + '/' + dNow.getFullYear() + ', ' + dNow.getHours() + ':' + ('0' + (dNow.getMinutes())).slice(-2) + ':' + ('0' + (dNow.getSeconds())).slice(-2); 
                                                                                      $('#l-' + data.data.lamp + ' .description span').text(localdate);                                                                              
                                                                                      */
                                                                                      
                                                                                      update_light_state_on_page(data.data.target_1, data_2.state);
                                                                                }
                                                                                
                                                                                
                                                                                
                                                                              }
                                                                              else {
                                                                                console.log('Error status False from SH...');
                                                                              }
                                                                              
                                                                              $(wait).hide();
                                                                              
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
                                  alert('Password?');
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

       
       
       
       function update_light_state_on_page (lamp_num, state) {
         
          if (lamp_num != 0 ) {
            // Skip setting a state for l-0 as it's not connected to electricity.sensor.
            
            if (lamp_num == 16 ) {
              // Skip l-16 at all as it's not connetcet to anything at all.
              return;
            }
            
            if (state == '1') {
              $('#l-' + lamp_num + ' .state').addClass('on');
            }
            else {
              $('#l-' + lamp_num + ' .state').removeClass('on');
            }
          }

           // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Getter
           // http://stackoverflow.com/questions/20456712/how-to-get-current-time-with-jquery
           // http://stackoverflow.com/questions/14529381/leading-zeros-in-minutes
           // http://stackoverflow.com/questions/17996874/leading-0-missing-from-data-and-time
           // http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
          var dNow = new Date(); 
          //var localdate = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' + dNow.getFullYear() + ', ' + dNow.getHours() + ':' + dNow.getMinutes() + ':' + dNow.getSeconds(); 
          var localdate = dNow.getDate() + '/' + ('0' + (dNow.getMonth()+1)).slice(-2) + '/' + dNow.getFullYear() + ', ' + dNow.getHours() + ':' + ('0' + (dNow.getMinutes())).slice(-2) + ':' + ('0' + (dNow.getSeconds())).slice(-2); 
          $('#l-' + lamp_num + ' .description span').text(localdate);                                                                              
       }
       
       
       
    }
  };

}(jQuery));
