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
                
                // Take the dialog name and its definition from the event data.
                var dialogName = e.data.name;
                var dialogDefinition = e.data.definition;

                // Check if the definition is from the dialog window you are interested in (the "Link" dialog window).
                if ( dialogName == 'editdiv' ) {
                    // Get a reference to the "Link Info" tab.
                    var infoTab = dialogDefinition.getContents( 'info' );

                    // Set the default value for the URL field.
//                    var urlField = infoTab.get( 'url' );
//                    urlField[ 'default' ] = 'www.example.com';
                    
                    infoTab.add({
                        id: 'x1',
                        type: 'text',
                        requiredContent: 'div[x1]',
                        label: 'x1',
                        setup: function(widget) {
                            this.setValue(widget.data['x1']);
                        },
                        commit: function (widget) {
                            widget.setData(value, this.getValue());
                        }
                    }, 'class');
                }


                // make sure this is the right editor (there can be more on one page) and the right dialog.
                if ((e.editor != editor) || (e.data.name != 'image2'))
                    return;

                // Get a reference to the "Link Info" tab.
                var infoTab = e.data.definition.getContents( 'info' );
             
                console.log(infoTab, 'infoTab before');
                
                jQuery.each( Drupal.settings.custom_img_attr_fields, function( index, value ){    
                    infoTab.add({
                        id: value,
                        type: 'text',
                        requiredContent: 'img[' + value + ']',
                        label: value,
                        setup: function(widget) {
                            this.setValue(widget.data[value]);
                        },
                        commit: function (widget) {
                            widget.setData(value, this.getValue());
                        }
                    }, 'alignment');
                });
                                
                console.log(infoTab, 'infoTab after');
                
            });
        }
    });
} )();
