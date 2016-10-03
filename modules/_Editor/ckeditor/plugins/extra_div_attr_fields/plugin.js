/**
 * @author all4senses
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
    
    // var img_attributes_to_exclude_from_adding = ['src', 'height', 'width', 'data-widget', 'sizes', 'srcset']; // 'sizes' and 'srcset' will be added by the imageresponsive plugin
    // Allowed content from custom Drupal settings, set from a4s custom module via drupal_add_js()
    if (typeof Drupal.settings.custom_div_attr_fields === 'undefined') {
        Drupal.settings.custom_div_attr_fields = [];
    }
    
    CKEDITOR.plugins.add( 'extra_div_attr_fields', {
        //lang: 'en,de',
        requires: 'widget,dialog', //'widget,dialog,image2',
        init: function(editor) {
            
            CKEDITOR.on('dialogDefinition', function(e) {
                
                // Take the dialog name and its definition from the event data.
                var dialogName = e.data.name;
                var dialogDefinition = e.data.definition;
                
                // make sure this is the right editor (there can be more on one page) and the right dialog.
                if ((e.editor != editor) || (dialogName != 'editdiv'))
                    return;
             
                // Create an extra tab    
                var extra = dialogDefinition.getContents( 'extra' );
                // Skip If it already exists
                if (typeof extra !== 'undefined' && extra != null) {
                    return;
                }

                // Copy the info tab and based on it create a new extra tab 
                var infoTab = dialogDefinition.getContents( 'info' );
                if (typeof infoTab === 'undefined' || infoTab == null) {
                    return;
                }
                // Clone object of existing tab "info" to a new tab "extra"
                extra = jQuery.extend(true, {}, infoTab);
                // And set new properties
                extra.id = 'extra';
                extra.label = 'Extra attributes';
                extra.title = 'Extra attributes';
                extra.elements = [];
                // Add it to the dialog
                dialogDefinition.addContents(extra,'info'); // Add a new tab before the Info tab

                // Remove fields, that will be added to the Extra tab, from other tabs
                var tabs_to_check = ['info', 'advanced'];
                var checkTab = null;
                var checkField = null;
                jQuery.each( tabs_to_check, function( index1, value1 ){  
                    checkTab = dialogDefinition.getContents( value1 );
                    jQuery.each( Drupal.settings.custom_div_attr_fields, function( index2, value2 ){
                        checkField = checkTab.get(value2);
                        if (typeof checkField !== 'undefined' && checkField != null) {
                            // We could add this field to a new tab right now, but we won't
                            /*
                            extra.add(checkField
                                    //, 'class' // 'class' is the element id before which we want to add a new one
                            );
                            */
                            checkTab.remove(value2);
                        }
                    });
                });
                
                // Add extra attributes fields
                jQuery.each( Drupal.settings.custom_div_attr_fields, function( index, value ){   
                    // Skip diplicates 
                    checkField = extra.get(value);
                    if (typeof checkField === 'undefined' || checkField == null) {
                        extra.add({ 
                                id: value,
                                type: 'text',
                                requiredContent: 'div[' + value + ']',
                                label: value,
                                // Works but we don't need it here
                                /*
                                setup: function(element) {
                                            // So we chack for this
                                            if (typeof element.$.attributes[value] === 'undefined' || element.$.attributes[value].value == 'undefined') {
                                                this.setValue('');
                                            }
                                            else {
                                                this.setValue(element.$.attributes[value].value);
                                            }
                                },
                                commit: function( element ) {
                                            element.setAttribute( value, this.getValue() );
                                }
                                */
                            }//, 'class' // 'class' is the element id before which we want to add a new one
                        );
                    }
                }); // jQuery.each( Drupal.settings.custom_div_attr_fields, function( index, value ){   
                
                var advanced = dialogDefinition.getContents( 'advanced' );
                checkField = advanced.get('style');
                console.log(checkField, 'checkField');
                advanced.remove('style');
                extra.add(checkField);
                  
                
                var info = dialogDefinition.getContents( 'info' );
                //info.remove('elementStyle');
                
                //dialogDefinition.removeContents( 'advanced' );
                //dialogDefinition.removeContents( 'info' );
                
                
            }); // End of CKEDITOR.on('dialogDefinition', function(e) {
        }
    }); // End of CKEDITOR.plugins.add( 'extra_div_attr_fields', {
    
} )();
