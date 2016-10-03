/**
 * @author all4senses
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
    
    var img_attributes_to_exclude_from_adding = ['src', 'height', 'width', 'data-widget', 'sizes', 'srcset']; // 'sizes' and 'srcset' will be added by the imageresponsive plugin
    // Allowed content from custom Drupal settings, set from a4s custom module via drupal_add_js()
    if (typeof Drupal.settings.custom_img_attr_fields === 'undefined') {
        Drupal.settings.custom_img_attr_fields = [];
    }
    
    CKEDITOR.plugins.add( 'extra_img_attr_fields', {
        //lang: 'en,de',
        requires: 'widget,dialog,image2',
        beforeInit: function(editor) {
            editor.on('widgetDefinition', function(e) {
                var widget = e.data;
                // figure out if this is the image dialog.
                if(widget.name != 'image')
                    return;

                // should not happen but anyway...
                if(!widget.allowedContent.img || !widget.allowedContent.img.attributes)
                    return;
                
                // a4s
                // Add to allowed content from custom Drupal settings, set from a4s custom module via drupal_add_js()
                jQuery.each( Drupal.settings.custom_img_attr_fields, function( index, value ){
                    if(widget.allowedContent.img.attributes.indexOf(value) == -1)
                        widget.allowedContent.img.attributes += ',' + value;
                });

            });
        },
        init: function(editor) {
            // Bind to widget#instanceCreated so we can see when the image widget is about to be initiated
            editor.widgets.on('instanceCreated', function(e) {
                var widget = e.data;

                // figure out if this is the image dialog.
                if(widget.name != 'image')
                    return;

                // register handler for data
                widget.on('data', function(e) {

                    widget = e.data;
                    
                    // keep extra attributes only when set.
                    jQuery.each( Drupal.settings.custom_img_attr_fields, function( index, value ){
                        if(widget[value])
                            e.sender.parts.image.setAttribute(value, widget[value]);
                        else
                            e.sender.parts.image.removeAttribute(value); 
                    });
                });

                // set data from existing variables.
                var image = widget.element;
                // since the img-tag can be wrapped with a caption, make sure we use the right element.
                if(image.getName() != 'img')
                    image = image.findOne('img');

                //  a4s get all img attributes
                var data = {};
                // Add to allowed / newly added for editing content attributes names from a specific img tag (also added manually)
                jQuery.each( image.$.attributes, function( index, value ){
                    if(value.name.indexOf('data-cke') == -1 && img_attributes_to_exclude_from_adding.indexOf(value.name) == -1 && Drupal.settings.custom_img_attr_fields.indexOf(value.name) == -1) {
                        Drupal.settings.custom_img_attr_fields.push(value.name);
                    }
                });
               
                jQuery.each( Drupal.settings.custom_img_attr_fields, function( index, value ){
                    data[value] = image.getAttribute(value);
                });
                widget.setData(data);
            });

            CKEDITOR.on('dialogDefinition', function(e) {
                // make sure this is the right editor (there can be more on one page) and the right dialog.
                if ((e.editor != editor) || (e.data.name != 'image2'))
                    return;

                var dialogDefinition = e.data.definition;
                
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
                infoTab.label = 'Image basics'
                
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
                var tabs_to_check = ['info'];
                var checkTab = null;
                var checkField = null;
                jQuery.each( tabs_to_check, function( index1, value1 ){  
                    checkTab = dialogDefinition.getContents( value1 );
                    jQuery.each( Drupal.settings.custom_img_attr_fields, function( index2, value2 ){
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
                
                var fieldtype;
                var texttype_fields = ['id', 'class', 'alt', 'title'];
                // Add extra attributes fields
                jQuery.each( Drupal.settings.custom_img_attr_fields, function( index, value ){   
                    // Skip duplicates 
                    checkField = extra.get(value);
                    if (typeof checkField === 'undefined' || checkField == null) {
                        if(texttype_fields.indexOf(value) == -1) {
                            fieldtype = 'textarea';
                        }
                        else {
                            fieldtype = 'text';
                        }
                        extra.add({
                            id: value,
                            type: fieldtype,
                            requiredContent: 'img[' + value + ']',
                            label: value,
                            setup: function(widget) {
                                this.setValue(widget.data[value]);
                            },
                            commit: function (widget) {
                                widget.setData(value, this.getValue());
                            }
                        });
                    }
                }); // jQuery.each( Drupal.settings.custom_img_attr_fields, function( index, value ){   
                
                
            });
        }
    });
} )();
