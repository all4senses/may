/*
 * Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
        
        var current_element;
        var current_selection;
        if (typeof Drupal === 'undefined') {
            Drupal = {settings: {cur_element_and_its_parents: []}};
        }
        else if (typeof Drupal.settings === 'undefined') {
            Drupal.settings = {cur_element_and_its_parents: []};
        }
        else if (typeof Drupal.settings.cur_element_and_its_parents === 'undefined') {
            Drupal.settings.cur_element_and_its_parents = [];
        }

        
        //console.log(some_pass, 'some_pass in div.js');
        console.log('in div.js');
	// Add to collection with DUP examination.
	// @param {Object} collection
	// @param {Object} element
	// @param {Object} database
	function addSafely( collection, element, database ) {
		// 1. IE doesn't support customData on text nodes;
		// 2. Text nodes never get chance to appear twice;
		if ( !element.is || !element.getCustomData( 'block_processed' ) ) {
			element.is && CKEDITOR.dom.element.setMarker( database, element, 'block_processed', true );
			collection.push( element );
		}
	}

	// Dialog reused by both 'creatediv' and 'editdiv' commands.
	// @param {Object} editor
	// @param {String} command	The command name which indicate what the current command is.
	function divDialog( editor, command, current_element_or_its_parent_index ) {
		// Definition of elements at which div operation should stopped.
		var divLimitDefinition = ( function() {

			// Customzie from specialize blockLimit elements
			var definition = CKEDITOR.tools.extend( {}, CKEDITOR.dtd.$blockLimit );

			if ( editor.config.div_wrapTable ) {
				delete definition.td;
				delete definition.th;
			}
			return definition;
		} )();

		// DTD of 'div' element
		var dtd = CKEDITOR.dtd.li;

                console.log(dtd, 'dtd');
                
                
           
                
                
		// Get the first div limit element on the element's path.
		// @param {Object} element
		function getDivContainer( element ) {
			var container = editor.elementPath( element ).blockLimit;

                        console.log(element, 'element 1');
                        console.log(container, 'container 1');
                        
			// Never consider read-only (i.e. contenteditable=false) element as
			// a first div limit (#11083).
			if ( container.isReadOnly() )
				container = container.getParent();

                        console.log(container, 'container 2');
                        
			// Dont stop at 'td' and 'th' when div should wrap entire table.
			if ( editor.config.div_wrapTable && container.is( [ 'td', 'th' ] ) ) {
				var parentPath = editor.elementPath( container.getParent() );
				container = parentPath.blockLimit;
			}

                        
                        console.log(container, 'container 3');
			return container;
		}

		// Init all fields' setup/commit function.
		// @memberof divDialog
		function setupFields() {
			this.foreach( function( field ) {
                            console.log(field, 'field');
				// Exclude layout container elements
                                 if(/^(?!vbox|hbox)/.test( field.type )) {
                                     console.log('/^(?!vbox|hbox)/.test( field.type ) TRUE');
                                 }
                                 else {
                                     console.log('/^(?!vbox|hbox)/.test( field.type ) FALSE');
                                 }
                                 
                                 
				if ( /^(?!vbox|hbox)/.test( field.type ) ) {
					if ( !field.setup ) {
						// Read the dialog fields values from the specified
						// element attributes.
						field.setup = function( element ) {
                                                    
                                                    if (!element) {
                                                        element = current_element;
                                                    }
                                                        console.log(element, 'element in setupFields');
                                                        console.log(field, 'field in setupFields');
                                                        field.setValue( element.getAttribute( field.id ) || '', 1 );
						};
					}
					if ( !field.commit ) {
						// Set element attributes assigned by the dialog
						// fields.
						field.commit = function( element ) {
                                                    if (!element) {
                                                        element = current_element;
                                                    }
                                                    console.log(element, 'element in setupFields 2');
							var fieldValue = this.getValue();
							// ignore default element attribute values
							if ( field.id == 'dir' && element.getComputedStyle( 'direction' ) == fieldValue ) {
								return;
							}

							if ( fieldValue )
								element.setAttribute( field.id, fieldValue );
							else
								element.removeAttribute( field.id );
						};
					}
				}
			} );
		}

		// Wrapping 'div' element around appropriate blocks among the selected ranges.
		// @param {Object} editor
                
		function createDiv( editor ) {
			// new adding containers OR detected pre-existed containers.
			var containers = [];
			// node markers store.
			var database = {};
			// All block level elements which contained by the ranges.
			var containedBlocks = [],
				block;

			// Get all ranges from the selection.
			var selection = editor.getSelection(),
				ranges = selection.getRanges();
			var bookmarks = selection.createBookmarks();
			var i, iterator;

			// collect all included elements from dom-iterator
			for ( i = 0; i < ranges.length; i++ ) {
				iterator = ranges[ i ].createIterator();
				while ( ( block = iterator.getNextParagraph() ) ) {
					// include contents of blockLimit elements.
					if ( block.getName() in divLimitDefinition && !block.isReadOnly() ) {
						var j,
							childNodes = block.getChildren();
						for ( j = 0; j < childNodes.count(); j++ )
							addSafely( containedBlocks, childNodes.getItem( j ), database );
					} else {
						while ( !dtd[ block.getName() ] && !block.equals( ranges[ i ].root ) )
							block = block.getParent();
						addSafely( containedBlocks, block, database );
					}
				}
			}

			CKEDITOR.dom.element.clearAllMarkers( database );

			var blockGroups = groupByDivLimit( containedBlocks );
			var ancestor, divElement;

			for ( i = 0; i < blockGroups.length; i++ ) {
				var currentNode = blockGroups[ i ][ 0 ];

				// Calculate the common parent node of all contained elements.
				ancestor = currentNode.getParent();
				for ( j = 1; j < blockGroups[ i ].length; j++ )
					ancestor = ancestor.getCommonAncestor( blockGroups[ i ][ j ] );

				divElement = new CKEDITOR.dom.element( 'li', editor.document );

				// Normalize the blocks in each group to a common parent.
				for ( j = 0; j < blockGroups[ i ].length; j++ ) {
					currentNode = blockGroups[ i ][ j ];

					while ( !currentNode.getParent().equals( ancestor ) )
						currentNode = currentNode.getParent();

					// This could introduce some duplicated elements in array.
					blockGroups[ i ][ j ] = currentNode;
				}

				// Wrapped blocks counting
				for ( j = 0; j < blockGroups[ i ].length; j++ ) {
					currentNode = blockGroups[ i ][ j ];

					// Avoid DUP elements introduced by grouping.
					if ( !( currentNode.getCustomData && currentNode.getCustomData( 'block_processed' ) ) ) {
						currentNode.is && CKEDITOR.dom.element.setMarker( database, currentNode, 'block_processed', true );

						// Establish new container, wrapping all elements in this group.
						if ( !j )
							divElement.insertBefore( currentNode );

						divElement.append( currentNode );
					}
				}

				CKEDITOR.dom.element.clearAllMarkers( database );
				containers.push( divElement );
			}

			selection.selectBookmarks( bookmarks );
			return containers;
		}
                
		// Divide a set of nodes to different groups by their path's blocklimit element.
		// Note: the specified nodes should be in source order naturally, which mean they are supposed to producea by following class:
		//  * CKEDITOR.dom.range.Iterator
		//  * CKEDITOR.dom.domWalker
		// @returns {Array[]} the grouped nodes
		function groupByDivLimit( nodes ) {
                    console.log(nodes, 'nodes');
			var groups = [],
				lastDivLimit = null,
				block;

			for ( var i = 0; i < nodes.length; i++ ) {
				block = nodes[ i ];
				var limit = getDivContainer( block );
				if ( !limit.equals( lastDivLimit ) ) {
					lastDivLimit = limit;
					groups.push( [] );
				}
				groups[ groups.length - 1 ].push( block );
			}
                        console.log(groups, 'groups');
			return groups;
		}

		// Synchronous field values to other impacted fields is required, e.g. div styles
		// change should also alter inline-style text.
		function commitInternally( targetFields ) {
			var dialog = this.getDialog(),
				element = dialog._element && dialog._element.clone();// || new CKEDITOR.dom.element( 'li', editor.document );

			// Commit this field and broadcast to target fields.
			this.commit( element, true );

			targetFields = [].concat( targetFields );
			var length = targetFields.length,
				field;
			for ( var i = 0; i < length; i++ ) {
				field = dialog.getContentElement.apply( dialog, targetFields[ i ].split( ':' ) );
				field && field.setup && field.setup( element, true );
			}
		}


		// Registered 'CKEDITOR.style' instances.
		var styles = {};

		// Hold a collection of created block container elements.
		var containers = [];
                    
		// @type divDialog
		return {
			title: editor.lang.div_extra.title,
			minWidth: 400,
			minHeight: 165,
			contents: [ {
				id: 'info',
				label: editor.lang.common.generalTab,
				title: editor.lang.common.generalTab,
				elements: [ {
					type: 'hbox',
					widths: [ '50%', '50%' ],
					children: [ {
						id: 'elementStyle',
						type: 'select',
						style: 'width: 100%;',
						label: editor.lang.div_extra.styleSelectLabel,
						'default': '',
						// Options are loaded dynamically.
						items: [
							[ editor.lang.common.notSet, '' ]
						],
						onChange: function() {
							commitInternally.call( this, [ 'info:elementStyle', 'info:class', 'advanced:dir', 'advanced:style' ] );
						},
						setup: function( element ) {
							for ( var name in styles )
								styles[ name ].checkElementRemovable( element, true, editor ) && this.setValue( name, 1 );
						},
						commit: function( element ) {
							var styleName;
							if ( ( styleName = this.getValue() ) ) {
								var style = styles[ styleName ];
								style.applyToObject( element, editor );
							}
							else {
								//element.removeAttribute( 'style' );
							}
						}
					},
					{
						id: 'class',
						type: 'text',
						//requiredContent: 'li(cke-xyz)', // Random text like 'xyz' will check if all are allowed.
						label: editor.lang.common.cssClass,
						'default': '',
                                                
                                                
//                                                setup: function( element ) {
//                                                    if (!element) {
//                                                        element = current_element;
//                                                    }
//                                                    console.log(element, 'element in setupField class');
//                                                    console.log(element.getAttribute( 'class'),'new class');
//                                                            this.setValue(element.getAttribute( 'class') );
//                                                        },
					} ]
				} ]
			},
			{
				id: 'advanced',
				label: editor.lang.common.advancedTab,
				title: editor.lang.common.advancedTab,
				elements: [ {
					type: 'vbox',
					padding: 1,
					children: [ {
						type: 'hbox',
						widths: [ '50%', '50%' ],
						children: [ {
							type: 'text',
							id: 'id',
							//requiredContent: 'li[id]',
							label: editor.lang.common.id,
							'default': ''
						},
						{
							type: 'text',
							id: 'lang',
							//requiredContent: 'li[lang]',
							label: editor.lang.common.langCode,
							'default': ''
						} ]
					},
					{
						type: 'hbox',
						children: [ {
							type: 'text',
							id: 'style',
							//requiredContent: 'li{cke-xyz}', // Random text like 'xyz' will check if all are allowed.
							style: 'width: 100%;',
							label: editor.lang.common.cssStyle,
							'default': '',
//							commit: function( element ) {
//								element.setAttribute( 'style', this.getValue() );
//							}
						} ]
					},
					{
						type: 'hbox',
						children: [ {
							type: 'text',
							id: 'title',
							requiredContent: 'li[title]',
							style: 'width: 100%;',
							label: editor.lang.common.advisoryTitle,
							'default': ''
						} ]
					},
					{
						type: 'select',
						id: 'dir',
						requiredContent: 'li[dir]',
						style: 'width: 100%;',
						label: editor.lang.common.langDir,
						'default': '',
						items: [
							[ editor.lang.common.notSet, '' ],
							[ editor.lang.common.langDirLtr, 'ltr' ],
							[ editor.lang.common.langDirRtl, 'rtl' ]
						]
					} ] }
				]
			} ],
			onLoad: function() {
                            
//                                current_selection = editor.getSelection();
//                                current_element = current_selection.getStartElement();
//                                console.log(current_element,'current_element onLoad');
//                                console.log(current_selection,'current_selection onLoad');
                
				setupFields.call( this );

				// Preparing for the 'elementStyle' field.
				var dialog = this,
					stylesField = this.getContentElement( 'info', 'elementStyle' );

				// Reuse the 'stylescombo' plugin's styles definition.
				editor.getStylesSet( function( stylesDefinitions ) {
					var styleName, style;

                                        console.log(stylesDefinitions, 'stylesDefinitions');
                                        
					if ( stylesDefinitions ) {
						// Digg only those styles that apply to 'div'.
						for ( var i = 0; i < stylesDefinitions.length; i++ ) {
							var styleDefinition = stylesDefinitions[ i ];
							if ( styleDefinition.element && styleDefinition.element == 'li' ) {
								styleName = styleDefinition.name;
								styles[ styleName ] = style = new CKEDITOR.style( styleDefinition );

								if ( editor.filter.check( style ) ) {
									// Populate the styles field options with style name.
									stylesField.items.push( [ styleName, styleName ] );
									stylesField.add( styleName, styleName );
								}
							}
						}
					}

					// We should disable the content element
					// it if no options are available at all.
					stylesField[ stylesField.items.length > 1 ? 'enable' : 'disable' ]();

					// Now setup the field value manually if dialog was opened on element. (#9689)
					setTimeout( function() {
						dialog._element && stylesField.setup( dialog._element );
					}, 0 );
				} );
			},
			onShow: function() {
				// Whether always create new container regardless of existed
				// ones.
                                
                                //current_element = editor.getSelection().getStartElement();
                                current_element = Drupal.settings.cur_element_and_its_parents[current_element_or_its_parent_index];
                                console.log(current_element,'current_element onShow');
                                
                                console.log(command, 'command');
				if ( command == 'editdiv_extra' ) {
					// Try to discover the containers that already existed in
					// ranges
					// update dialog field values
					this.setupContent( this._element = CKEDITOR.plugins.div_extra.getSurroundDiv( editor ) );
                                        
                                        if (!this._element) {
                                            console.log('this._element init from none');
                                            this._element = current_element;
                                        }
                                        
                                        console.log(this._element, 'this._element');
				}
			},
			onOk: function() {
				if ( command == 'editdiv_extra' )
					containers = [ this._element ];
				else
					containers = createDiv( editor, true );

                                console.log(containers, 'containers');
				// Update elements attributes
				var size = containers.length;
				for ( var i = 0; i < size; i++ ) {
					this.commitContent( containers[ i ] );

					// Remove empty 'style' attribute.
					!containers[ i ].getAttribute( 'style' ) && containers[ i ].removeAttribute( 'style' );
				}

				this.hide();
			},
			onHide: function() {
                            console.log(this._element, 'this._element');
				// Remove style only when editing existing DIV. (#6315)
				if ( command == 'editdiv_extra' ) {
					this._element.removeCustomData( 'elementStyle' );
                                    }
				delete this._element;
			}
		};
	}

//	CKEDITOR.dialog.add( 'creatediv', function( editor ) {
//		return divDialog( editor, 'creatediv' );
//	} );

	CKEDITOR.dialog.add( 'editdiv_extra_1', function( editor ) {
            console.log(editor, 'editor ddd1');
                
		return divDialog( editor, 'editdiv_extra', 0 );
	} );
        
        
        CKEDITOR.dialog.add( 'editdiv_extra_2', function( editor ) {
            console.log(editor, 'editor ddd1222');
		return divDialog( editor, 'editdiv_extra', 1 );
	} );
        
        
        CKEDITOR.dialog.add( 'editdiv_extra_3', function( editor ) {
            console.log(editor, 'editor ddd1333');
		return divDialog( editor, 'editdiv_extra', 2 );
	} ); 
        
        

} )();

/**
 * Whether to wrap the whole table instead of individual cells when created `<div>` in table cell.
 *
 *		config.div_wrapTable = true;
 *
 * @cfg {Boolean} [div_wrapTable=false]
 * @member CKEDITOR.config
 */
