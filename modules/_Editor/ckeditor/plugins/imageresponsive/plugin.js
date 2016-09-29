/**
 * @license Copyright (c) 2003-2014, Clemens Krack. All rights reserved.
 * @author Clemens Krack <info@clemenskrack.com>
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
    CKEDITOR.plugins.add( 'imageresponsive', {
        lang: 'en,de',
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

                    console.log(widget,'widget');
                if(widget.allowedContent.img.attributes.indexOf('srcset') == -1)
                    widget.allowedContent.img.attributes += ',srcset'
                if(widget.allowedContent.img.attributes.indexOf('sizes') == -1)
                    widget.allowedContent.img.attributes += ',sizes'
                
                if(widget.allowedContent.img.attributes.indexOf('data_a4s') == -1)
                    widget.allowedContent.img.attributes += ',data_a4s'
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
                    console.log(e,'e');
                    widget = e.data;
                    // keep srcset & sizes attributes only when set.
                    if(widget.srcset)
                        e.sender.parts.image.setAttribute('srcset', widget.srcset);
                    else
                        e.sender.parts.image.removeAttribute('srcset');

                    if(widget.sizes)
                        e.sender.parts.image.setAttribute('sizes', widget.sizes);
                    else
                        e.sender.parts.image.removeAttribute('sizes');
                    
                    if(widget.data_a4s)
                        e.sender.parts.image.setAttribute('data-a4s', widget.data_a4s);
                    else
                        e.sender.parts.image.removeAttribute('data-a4s');
                    
                    console.log(e.sender.parts.image, 'e.sender.parts.image');
                });

                // set data from existing variables.
                var image = widget.element;
                console.log(image,'image');
                // since the img-tag can be wrapped with a caption, make sure we use the right element.
                if(image.getName() != 'img')
                    image = image.findOne('img');

                var data = {
                    srcset: image.getAttribute( 'srcset' ) || '',
                    sizes: image.getAttribute( 'sizes' ) || '',
                    data_a4s: image.getAttribute( 'data-a4s' ) || ''
                };
                console.log(data,'data');
                widget.setData(data);
            });

            CKEDITOR.on('dialogDefinition', function(e) {
                // make sure this is the right editor (there can be more on one page) and the right dialog.
                if ((e.editor != editor) || (e.data.name != 'image2'))
                    return;

                // Get a reference to the "Link Info" tab.
                var infoTab = e.data.definition.getContents( 'info' );

                // Add text fields for srcset and sizes.
                infoTab.add({
                    id: 'srcset',
                    type: 'text',
                    requiredContent: 'img[srcset]',
                    label: e.editor.lang.imageresponsive.srcset,
                    setup: function(widget) {
                        this.setValue(widget.data.srcset);
                    },
                    commit: function (widget) {
                        widget.setData('srcset', this.getValue());
                    }
                }, 'alt');

                infoTab.add({
                    id: 'sizes',
                    type: 'text',
                    requiredContent: 'img[sizes]',
                    label: e.editor.lang.imageresponsive.sizes,
                    setup: function(widget) {
                        this.setValue(widget.data.sizes);
                    },
                    commit: function (widget) {
                        console.log(widget, 'widget on setData sizes');
                        console.log(this, 'this sizes');
                        widget.setData('sizes', this.getValue());
                    }
                }, 'alignment');
                
                
                infoTab.add({
                    id: 'data-a4s',
                    type: 'text',
                    requiredContent: 'img[data-a4s]',
                    label: e.editor.lang.imageresponsive.data_a4s,
                    setup: function(widget) {
                        this.setValue(widget.data.data_a4s);
                    },
                    commit: function (widget) {
                        console.log(widget, 'widget on setData a4s');
                        console.log(this, 'this a4s');
                        widget.setData('data_a4s', this.getValue());
                    }
                }, 'alignment');
                
                console.log(infoTab, 'infoTab');
                
            });
        }
    });
} )();
