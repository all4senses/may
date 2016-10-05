/**
 * all4senses
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "div" plugin. It wraps the selected block level elements with a 'div' element with specified styles and attributes.
 *
 */

( function() {
    
    if (typeof Drupal === 'undefined') {
        Drupal = {settings: {cur_element_and_its_parents: []}};
    }
    else if (typeof Drupal.settings === 'undefined') {
        Drupal.settings = {cur_element_and_its_parents: []};
    }
    Drupal.settings.cur_element_and_its_parents_labels = [];
    
    var cur_element_and_its_parents, cur_element_parent_label;
	CKEDITOR.plugins.add( 'div_extra', {
		requires: 'dialog',
		lang: 'en,ru', //'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		init: function( editor ) {
			if ( editor.blockless )
				return;

			var lang = editor.lang.div_extra,
				allowed = 'li(*)';

			if ( CKEDITOR.dialog.isTabEnabled( editor, 'editdiv_extra', 'advanced' ) )
				allowed += ';li[*]{*}';
                          
			editor.addCommand( 'editdiv_extra_1', new CKEDITOR.dialogCommand( 'editdiv_extra_1', { element_number: 1 } ) );
                        editor.addCommand( 'editdiv_extra_2', new CKEDITOR.dialogCommand( 'editdiv_extra_2', { element_number: 2 } ) );
                        editor.addCommand( 'editdiv_extra_3', new CKEDITOR.dialogCommand( 'editdiv_extra_3', { element_number: 3 } ) );
                        
			if ( editor.addMenuItems ) {
                            
                                editor.addMenuGroup('edit_tag');
				editor.addMenuItems( {
					editdiv_extra_1: {
						label: 'Edit tag',// + cur_element.$.nodeName,
						command: 'editdiv_extra_1',
						group: 'edit_tag',
						order: 10
					},
                                        
                                        editdiv_extra_2: {
						label: 'Edit tag',
						command: 'editdiv_extra_2',
						group: 'edit_tag',
						order: 11
					},
                                        editdiv_extra_3: {
						label: 'Edit tag',
						command: 'editdiv_extra_3',
						group: 'edit_tag',
						order: 12
					},
                                    
                                        
				} );
                                
				if ( editor.contextMenu ) {
					editor.contextMenu.addListener( function( element ) {
						if ( !element || element.isReadOnly() )
							return null;

						//if ( CKEDITOR.plugins.div_extra.getSurroundDiv( editor ) ) 
                                                {
                                                    //console.log(element, 'element x2');
                                                    
                                                    var mi = editor.getMenuItem('editdiv_extra_1');
                                                    
                                                    var cur_element = editor.getSelection().getStartElement();
                                                    
                                                    mi.label = 'Edit tag: ' + cur_element.$.nodeName;
                                                    if (cur_element.$.attributes.id) {
                                                        mi.label += ', id="' + cur_element.$.attributes.id.value + '"'; 
                                                    }
                                                    if (cur_element.$.attributes.class) {
                                                        mi.label += ', class="' + cur_element.$.attributes.class.value + '"'; 
                                                    }
                                                    
                                                    Drupal.settings.cur_element_and_its_parents_labels[0] = mi.label;
                                                    
                                                    Drupal.settings.cur_element_and_its_parents = cur_element_and_its_parents = cur_element.getParents(true);
                                                    
                                                    var allowed_menu_items = new Object;
                                                    allowed_menu_items['editdiv_extra_1'] = CKEDITOR.TRISTATE_OFF;
                                                    
                                                    
                                                    // 0-th element is the cur element iself
                                                    // Let's show only 2 parent elements
                                                    
                                                    for (var i = 1, j=2; i < 3; i++, j++) {
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
                                                        
                                                        Drupal.settings.cur_element_and_its_parents_labels[i] = cur_element_parent_label;
                                                        
                                                        mi = editor.getMenuItem('editdiv_extra_' + j);
                                                        mi.label = cur_element_parent_label;
                                                        mi.command = 'editdiv_extra_'+ j;
                                                        mi.group = 'div';
                                                        mi.order = 10+i;
                                                        allowed_menu_items['editdiv_extra_' + j] = CKEDITOR.TRISTATE_OFF;
                                                    }
                                                    
                                                    return allowed_menu_items;
						}

						return null;
					} );
				}
			}

			CKEDITOR.dialog.add( 'editdiv_extra_1', this.path + 'dialogs/div.js' );
                        CKEDITOR.dialog.add( 'editdiv_extra_2', this.path + 'dialogs/div.js' );
                        CKEDITOR.dialog.add( 'editdiv_extra_3', this.path + 'dialogs/div.js' );
		}
	} );

	CKEDITOR.plugins.div_extra = {
		getSurroundDiv: function( editor, start ) {
                            var path = editor.elementPath( start );
                            var contains = editor.elementPath( path.blockLimit ).contains( function( node ) {
                            // Avoid read-only (i.e. contenteditable="false") divs (#11083).
                            return node.is( 'li' ) && !node.isReadOnly();
			}, 1 );
                        
			return editor.elementPath( path.blockLimit ).contains( function( node ) {
                            // Avoid read-only (i.e. contenteditable="false") divs (#11083).
                            return node.is( 'li' ) && !node.isReadOnly();
			}, 1 );
		}
	};
} )();
