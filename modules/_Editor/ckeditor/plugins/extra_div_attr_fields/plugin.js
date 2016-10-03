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
                
                // Take the dialog name and its definition from the event data.
                var dialogName = e.data.name;
                var dialogDefinition = e.data.definition;
                
                // Alter only the editdiv dialog
                if ( dialogName != 'editdiv' ) {
                    return;
                }
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
                dialogDefinition.addContents(extra,'info');


                // Remove fields, that will be added to the Extra tab, from other tabs
                var tabs_to_check = ['info', 'advanced'];
                jQuery.each( tabs_to_check, function( index1, value1 ){  
                    console.log(value1, 'value1');
                    var checkTab = dialogDefinition.getContents( value1 );
                    jQuery.each( Drupal.settings.custom_div_attr_fields, function( index2, value2 ){
                        console.log(value2, 'value2');
                        var checkField = checkTab.get(value2);
                        console.log(checkField, 'checkField');
                        if (typeof checkField !== 'undefined' && checkField != null) {
                            console.log('removing...');
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
                });


                // Add new fields to the new tab
                /*
                extra.add({ 
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

                    }//, 'class' // 'class' is the element id before which we want to add a new one
                );
                */

//                // Move some fields from existing before tabs to a new tab
//                var advancedTab = dialogDefinition.getContents( 'advanced' );
//                var title_field = advancedTab.get( 'title' );
//                // Skip diplicates 
//                if (typeof title_field !== 'undefined' && title_field != null) {
//                    extra.add(title_field
//                            //, 'class' // 'class' is the element id before which we want to add a new one
//                    );
//                    advancedTab.remove('title');
//                }
                
                
                
                


                console.log(extra, 'extra after');
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
