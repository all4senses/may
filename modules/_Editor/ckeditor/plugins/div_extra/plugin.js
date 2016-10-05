﻿/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "div" plugin. It wraps the selected block level elements with a 'div' element with specified styles and attributes.
 *
 */

( function() {
    console.log('in plugins.js...');
    if (typeof Drupal === 'undefined') {
        Drupal = {settings: {cur_element_and_its_parents: []}};
    }
    else if (typeof Drupal.settings === 'undefined') {
        Drupal.settings = {cur_element_and_its_parents: []};
    }
    
    var cur_element_and_its_parents, cur_element_parent_label;
	CKEDITOR.plugins.add( 'div_extra', {
		requires: 'dialog',
		// jscs:disable maximumLineLength
		lang: 'en,ru', //'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		//icons: 'creatediv', // %REMOVE_LINE_CORE%
		//hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
                    console.log(editor, 'editor');
			if ( editor.blockless )
				return;

			var lang = editor.lang.div_extra,
				allowed = 'li(*)';

			if ( CKEDITOR.dialog.isTabEnabled( editor, 'editdiv_extra', 'advanced' ) )
				allowed += ';li[*]{*}';
                        /*
			editor.addCommand( 'creatediv', new CKEDITOR.dialogCommand( 'creatediv', {
				allowedContent: allowed,
				requiredContent: 'div',
				contextSensitive: true,
				refresh: function( editor, path ) {
					var context = editor.config.div_wrapTable ? path.root : path.blockLimit;
					this.setState( 'div' in context.getDtd() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );
				}
			} ) );
                        */
                       
//                       var com =  new CKEDITOR.dialogCommand( 'editdiv_extra', { requiredContent: 'li' } );
//                       console.log(com, 'com 1');
//                       
//                       com =  new CKEDITOR.dialogCommand( 'editdiv_extra', { requiredContent: 'li', xxx: 'xxx111' } );
//                       console.log(com, 'com 2');
                       
			editor.addCommand( 'editdiv_extra_1', new CKEDITOR.dialogCommand( 'editdiv_extra_1', { element_number: 1 } ) );
                        editor.addCommand( 'editdiv_extra_2', new CKEDITOR.dialogCommand( 'editdiv_extra_2', { element_number: 2 } ) );
                        editor.addCommand( 'editdiv_extra_3', new CKEDITOR.dialogCommand( 'editdiv_extra_3', { element_number: 3 } ) );
                        
			editor.addCommand( 'removediv_extra', {
				requiredContent: 'li',
				exec: console.log('remove event'),
                                   /*     
                                function( editor ) {
					var selection = editor.getSelection(),
						ranges = selection && selection.getRanges(),
						range,
						bookmarks = selection.createBookmarks(),
						walker,
						toRemove = [];

					function findDiv( node ) {
						var div = CKEDITOR.plugins.div_extra.getSurroundDiv( editor, node );
						if ( div && !div.data( 'cke-div-added' ) ) {
							toRemove.push( div );
							div.data( 'cke-div-added' );
						}
					}

					for ( var i = 0; i < ranges.length; i++ ) {
						range = ranges[ i ];
						if ( range.collapsed )
							findDiv( selection.getStartElement() );
						else {
							walker = new CKEDITOR.dom.walker( range );
							walker.evaluator = findDiv;
							walker.lastForward();
						}
					}

					for ( i = 0; i < toRemove.length; i++ )
						toRemove[ i ].remove( true );

					selection.selectBookmarks( bookmarks );
				}
                                */
			} );
                        
                       
                        /*
			editor.ui.addButton && editor.ui.addButton( 'CreateDiv', {
				label: lang.toolbar,
				command: 'creatediv',
				toolbar: 'blocks,50'
			} );
                        */
			if ( editor.addMenuItems ) {
                            
//                            
                                editor.addMenuGroup('edit_tag');
				editor.addMenuItems( {
					editdiv_extra_1: {
						label: 'Edit tag',// + cur_element.$.nodeName, //lang.edit,
						command: 'editdiv_extra_1',
						group: 'edit_tag',
						order: 10
					},
                                        
                                        editdiv_extra_2: {
						label: 'Edit tag',// + cur_element_and_its_parents[1].$.nodeName,
						command: 'editdiv_extra_2',
						group: 'edit_tag',
						order: 11
					},
                                        editdiv_extra_3: {
						label: 'Edit tag',// + cur_element_and_its_parents[2].$.nodeName,
						command: 'editdiv_extra_3',
						group: 'edit_tag',
						order: 12
					},
                                        
                                        
                                        
                                        /*
					removediv_extra: {
						label: lang.remove,
						command: 'removediv_extra',
						group: 'div',
						order: 5
					}
                                        */
                                        
                                        
				} );
                                
				if ( editor.contextMenu ) {
					editor.contextMenu.addListener( function( element ) {
						if ( !element || element.isReadOnly() )
							return null;

                                                console.log(element, 'element x1');
						//if ( CKEDITOR.plugins.div_extra.getSurroundDiv( editor ) ) 
                                                {
                                                    //console.log(element, 'element x2');
                                                    var mi;;
                                                    mi = editor.getMenuItem('editdiv_extra_1');
                                                    console.log(mi, 'mi 11');
                                                    
                                                    var cur_selection = editor.getSelection();
                                                    var cur_element = cur_selection.getStartElement();
                                                    console.log(cur_element,'cur_element menu');
                                                    console.log(cur_selection,'cur_selection menu');
                                                    
                                                    mi.label = 'Edit tag: ' + cur_element.$.nodeName;
                                                    if (cur_element.$.attributes.id) {
                                                        mi.label += ', id="' + cur_element.$.attributes.id.value + '"'; 
                                                    }
                                                    if (cur_element.$.attributes.class) {
                                                        mi.label += ', class="' + cur_element.$.attributes.class.value + '"'; 
                                                    }
                                                    
                                                    console.log(mi, 'mi 12');
                                                    
                                                    Drupal.settings.cur_element_and_its_parents = cur_element_and_its_parents = cur_element.getParents(true);
                                                    console.log(cur_element_and_its_parents, 'parents');
                                                    
                                                    var allowed_menu_items = new Object;
                                                    allowed_menu_items['editdiv_extra_1'] = CKEDITOR.TRISTATE_OFF;
                                                    
                                                    
                                                    // 0th element is the cur element iself
                                                    // Let's show only 2 parent elements
                                                    
                                                    for (var i = 1, j=2; i < 3; i++, j++) {
                                                        console.log(i, 'i');
                                                        console.log(cur_element_and_its_parents[i].$.nodeName, 'cur_element_and_its_parents[i].$.nodeName');
                                                        if (cur_element_and_its_parents[i].$.nodeName == 'BODY') {
                                                            break;
                                                        }
                                                        
                                                        cur_element_parent_label = 'Edit tag: ' + cur_element_and_its_parents[i].$.nodeName;
                                                        if (cur_element_and_its_parents[i].$.attributes.id) {
                                                            cur_element_parent_label += ', id="' + cur_element_and_its_parents[i].$.attributes.id.value + '"'; 
                                                        }
                                                        if (cur_element_and_its_parents[i].$.attributes.class) {
                                                            cur_element_parent_label += ', class="' + cur_element_and_its_parents[i].$.attributes.class.value + '"'; 
                                                        }
                                                        console.log(cur_element_parent_label, 'cur_element_parent_label');
                                                
                                                        
//                                                        editor.addMenuItem('editdiv_extra_' + j, {
//                                                            label: cur_element_parent_label,
//                                                            command: 'editdiv_extra_'+ j,
//                                                            group: 'div',
//                                                            order: 10+i
//                                                        });
//                                                        mi = editor.getMenuItem('editdiv_extra_' + j);
                                                        
                                                       
                                                        
                                                        mi = editor.getMenuItem('editdiv_extra_' + j);
                                                        console.log(mi, 'mi'+j + ' before');
                                                        mi.label = cur_element_parent_label;
                                                        mi.command = 'editdiv_extra_'+ j;
                                                        mi.group = 'div';
                                                        mi.order = 10+i;
                                                        
                                                        
                                                        console.log(mi, 'mi'+j+'after');
                                                        allowed_menu_items['editdiv_extra_' + j] = CKEDITOR.TRISTATE_OFF;
                                                    }
                                                    
                                                    
                                                    /*
                                                    return {
                                                            editdiv_extra: CKEDITOR.TRISTATE_OFF,
                                                            //removediv_extra: CKEDITOR.TRISTATE_OFF
                                                    };
                                                    */
                                                    return allowed_menu_items;
                                                    
						}

                                                console.log(element, 'element x3');
						return null;
					} );
				}
			}

//			CKEDITOR.dialog.add( 'creatediv', this.path + 'dialogs/div.js' );
			CKEDITOR.dialog.add( 'editdiv_extra_1', this.path + 'dialogs/div.js' );
                        CKEDITOR.dialog.add( 'editdiv_extra_2', this.path + 'dialogs/div.js' );
                        CKEDITOR.dialog.add( 'editdiv_extra_3', this.path + 'dialogs/div.js' );
		}
	} );

	CKEDITOR.plugins.div_extra = {
		getSurroundDiv: function( editor, start ) {
                    console.log(editor, 'editor in getSurroundDiv');
                    console.log(start, 'start in getSurroundDiv');
			var path = editor.elementPath( start );
                        console.log(path, 'path');
                        
                        var contains = editor.elementPath( path.blockLimit ).contains( function( node ) {
                            console.log(node, 'node');
                            console.log(node.is( 'li' ) , 'node.is(li) ');
				// Avoid read-only (i.e. contenteditable="false") divs (#11083).
				return node.is( 'li' ) && !node.isReadOnly();
			}, 1 );
                        console.log(contains, 'contains');
                        
                        
                        
			return editor.elementPath( path.blockLimit ).contains( function( node ) {
                            console.log(node, 'node');
                            console.log(node.is( 'li' ) , 'node.is(li) ');
                            if (node.is( 'li' ) && !node.isReadOnly()) {
                                console.log( 'node.is(li) && !node.isReadOnly()' + ' = TRUE');
                            }
                            else {
                                console.log( 'node.is(li) && !node.isReadOnly()' + ' = FALSE');
                            }
				// Avoid read-only (i.e. contenteditable="false") divs (#11083).
				return node.is( 'li' ) && !node.isReadOnly();
			}, 1 );
		}
	};
} )();
