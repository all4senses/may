/**
 * @author all4senses
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
    
//    var img_attributes_to_exclude_from_adding = ['src', 'height', 'width', 'data-widget', 'sizes', 'srcset']; // 'sizes' and 'srcset' will be added by the imageresponsive plugin
//    // Allowed content from custom Drupal settings, set from a4s custom module via drupal_add_js()
    if (typeof Drupal.settings.custom_div_attr_fields === 'undefined') {
        Drupal.settings.custom_div_attr_fields = [];
    }
    
    CKEDITOR.plugins.add( 'extra_div_attr_fields', {
        //lang: 'en,de',
        requires: 'widget,dialog', //'widget,dialog,image2',
        beforeInit: function(editor) {
            
        },
        init: function(editor) {
            
            CKEDITOR.on('dialogDefinition', function(e) {
                
                console.log(e, 'e...');
                
                // Take the dialog name and its definition from the event data.
                var dialogName = e.data.name;
                var dialogDefinition = e.data.definition;

                // Check if the definition is from the dialog window you are interested in (the "Link" dialog window).
                if ( dialogName == 'editdiv' ) {
                    // Get a reference to the "Link Info" tab.
                    var infoTab = dialogDefinition.getContents( 'info' );
                    console.log(infoTab, 'infoTab ...');
                    if (typeof infoTab === 'undefined' || infoTab == null) {
                        return;
                    }
                    
                    console.log(dialogDefinition, 'dialogDefinition before');
                    console.log(infoTab, 'infoTab before');
                    
                    infoTab.id = 'extra';
                    infoTab.label = 'xxx  lab';
                    infoTab.title = 'xxx  title';
                    
                    //dialogDefinition.addContents(infoTab);
                    
                    console.log(infoTab, 'infoTab after');
                    
//                    var extraTab = dialogDefinition.addContents({
//                        'id':'extra',
//                        'label':'Extra label',
//                        'title':'Extra title',
//                        'hidden': false,
//                        'elements': []
//                    });
                    
                    console.log(dialogDefinition, 'dialogDefinition after');
                    
                    
                    return;
                    
                    
                    
                    
                    var infoTab = dialogDefinition.getContents( 'extra' );

                    // Set the default value for the URL field.
//                    var urlField = infoTab.get( 'url' );
//                    urlField[ 'default' ] = 'www.example.com';

                    console.log(infoTab, 'infoTab before');
                     
                    var if_attr_exists = infoTab.get( 'x1' );
                     
                    // Skip diplicates 
                    if (typeof if_attr_exists !== 'undefined' && if_attr_exists != null) {
                        return;
                    }
                     
                     
                    infoTab.add({ 
                        id: 'x1',
                        type: 'text',
                        requiredContent: 'div[x1]',
                        label: 'x1',
                        setup: function(element) {
                            console.log(element, 'element on setup');
                            console.log(element.$.attributes['x1'], 'element.$.attributes[x1]');
                            console.log(element.$.attributes['x1'].value, 'element.$.attributes[x1].value');
                            
                            this.setValue(element.$.attributes['x1'].value);
                        },
                        commit: function( element ) {
                                    console.log(element, 'element on commit');
                                    element.setAttribute( 'x1', this.getValue() );
                                }

                        
                        
                        
                    }//, 'class'
                            );
                    
                    
                    console.log(infoTab, 'infoTab afer');
                }

//                return;
                
                // make sure this is the right editor (there can be more on one page) and the right dialog.
//                if ((e.editor != editor) || (e.data.name != 'image2'))
//                    return;

                // Get a reference to the "Link Info" tab.
//                var infoTab = e.data.definition.getContents( 'info' );
             
//                console.log(infoTab, 'infoTab before');
//                
//                jQuery.each( Drupal.settings.custom_img_attr_fields, function( index, value ){    
//                    infoTab.add({
//                        id: value,
//                        type: 'text',
//                        requiredContent: 'img[' + value + ']',
//                        label: value,
//                        setup: function(widget) {
//                            this.setValue(widget.data[value]);
//                        },
//                        commit: function (widget) {
//                            widget.setData(value, this.getValue());
//                        }
//                    }, 'alignment');
//                });
//                                
//                console.log(infoTab, 'infoTab after');
                
            });
        }
    });
} )();
