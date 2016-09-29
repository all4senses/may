/**
 * @license Copyright (c) 2003-2014, Clemens Krack. All rights reserved.
 * @author all4senses
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
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

//                if(widget.allowedContent.img.attributes.indexOf('srcset') == -1)
//                    widget.allowedContent.img.attributes += ',srcset'
//                if(widget.allowedContent.img.attributes.indexOf('sizes') == -1)
//                    widget.allowedContent.img.attributes += ',sizes'
                
                if(widget.allowedContent.img.attributes.indexOf('data-a4s') == -1)
                    widget.allowedContent.img.attributes += ',data-a4s'
            });
        },
        init: function(editor) {
            // bind to widget#instanceCreated so we can see when the image widget is about to be initiated
            editor.widgets.on('instanceCreated', function(e) {
                var widget = e.data;

                // figure out if this is the image dialog.
                if(widget.name != 'image')
                    return;

                // register handler for data
                widget.on('data', function(e) {

                    widget = e.data;
                    // keep srcset & sizes attributes only when set.
//                    if(widget.srcset)
//                        e.sender.parts.image.setAttribute('srcset', widget.srcset);
//                    else
//                        e.sender.parts.image.removeAttribute('srcset');
//
//                    if(widget.sizes)
//                        e.sender.parts.image.setAttribute('sizes', widget.sizes);
//                    else
//                        e.sender.parts.image.removeAttribute('sizes');
                    
                    //if(widget.data_a4s)
                    if(widget['data-a4s'])
                        //e.sender.parts.image.setAttribute('data-a4s', widget.data_a4s);
                        e.sender.parts.image.setAttribute('data-a4s', widget['data-a4s']);
                    else
                        e.sender.parts.image.removeAttribute('data-a4s');
                    
                    console.log(widget, 'widget');
                    //console.log(widget.data_a4s, 'widget.data_a4s');
                    console.log(widget['data-a4s'], 'widget[data-a4s]');
                });

                // set data from existing variables.
                var image = widget.element;
                // since the img-tag can be wrapped with a caption, make sure we use the right element.
                if(image.getName() != 'img')
                    image = image.findOne('img');

                var data = {
//                    srcset: image.getAttribute( 'srcset' ) || '',
//                    sizes: image.getAttribute( 'sizes' ) || '',
                    //data_a4s: image.getAttribute( 'data-a4s' ) || ''
                    'data-a4s': image.getAttribute( 'data-a4s' ) || ''
                };
                console.log(data,'source data');
                widget.setData(data);
            });

            CKEDITOR.on('dialogDefinition', function(e) {
                // make sure this is the right editor (there can be more on one page) and the right dialog.
                if ((e.editor != editor) || (e.data.name != 'image2'))
                    return;

                // Get a reference to the "Link Info" tab.
                var infoTab = e.data.definition.getContents( 'info' );

                // Add text fields for srcset and sizes.
//                infoTab.add({
//                    id: 'srcset',
//                    type: 'text',
//                    requiredContent: 'img[srcset]',
//                    label: e.editor.lang.imageresponsive.srcset,
//                    setup: function(widget) {
//                        this.setValue(widget.data.srcset);
//                    },
//                    commit: function (widget) {
//                        widget.setData('srcset', this.getValue());
//                    }
//                }, 'alt');
//
//                infoTab.add({
//                    id: 'sizes',
//                    type: 'text',
//                    requiredContent: 'img[sizes]',
//                    label: e.editor.lang.imageresponsive.sizes,
//                    setup: function(widget) {
//                        this.setValue(widget.data.sizes);
//                    },
//                    commit: function (widget) {
//                        widget.setData('sizes', this.getValue());
//                    }
//                }, 'alignment');
                
                
                infoTab.add({
                    id: 'data-a4s',
                    type: 'text',
                    requiredContent: 'img[data-a4s]',
                    //label: e.editor.lang.imageresponsive.data_a4s,
                    //label: e.editor.lang.imageresponsive['data-a4s'],
                    label: 'data-a4s',
                    setup: function(widget) {
                        //this.setValue(widget.data.data_a4s);
                        this.setValue(widget.data['data-a4s']);
                    },
                    commit: function (widget) {
                        //widget.setData('data_a4s', this.getValue());
                        widget.setData('data-a4s', this.getValue());
                    }
                }, 'alignment');
                
                console.log(infoTab, 'infoTab');
                
            });
        }
    });
} )();
