/*
 * Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
        
        var current_element;
        if (typeof Drupal === 'undefined') {
            Drupal = {settings: {cur_element_and_its_parents: []}};
        }
        else if (typeof Drupal.settings === 'undefined') {
            Drupal.settings = {cur_element_and_its_parents: []};
        }
        else if (typeof Drupal.settings.cur_element_and_its_parents === 'undefined') {
            Drupal.settings.cur_element_and_its_parents = [];
        }

	// @param {Object} editor
	function divDialog( editor, current_element_or_its_parent_index ) {
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

		// Init all fields' setup/commit function.
		// @memberof divDialog
		function setupFields() {
			this.foreach( function( field ) {
				// Exclude layout container elements
        			if ( /^(?!vbox|hbox)/.test( field.type ) ) {
					if ( !field.setup ) {
						// Read the dialog fields values from the specified
						// element attributes.
						field.setup = function( element ) {
                                                    
                                                    if (!element) {
                                                        element = current_element;
                                                    }
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
			title:  'Edit tag <>', // To be overriden on onShow event
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
                
				setupFields.call( this );
                                
				// Preparing for the 'elementStyle' field.
				var dialog = this,
					stylesField = this.getContentElement( 'info', 'elementStyle' );

				// Reuse the 'stylescombo' plugin's styles definition.
				editor.getStylesSet( function( stylesDefinitions ) {
					var styleName, style;
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
                                //console.log(Drupal.settings.cur_element_and_its_parents, 'Drupal.settings.cur_element_and_its_parents');
                                //console.log(current_element_or_its_parent_index,'current_element_or_its_parent_index');
                                //console.log(current_element,'current_element onShow');
                                
                                //console.log(Drupal.settings.cur_element_and_its_parents, 'Drupal.settings.cur_element_and_its_parents---');
                                var cur_element_parent_label = 'Edit tag: ' + current_element.$.nodeName;
                                if (current_element.$.attributes.id) {
                                    cur_element_parent_label += ', id="' + current_element.$.attributes.id.value + '"'; 
                                }
                                if (current_element.$.attributes.class) {
                                    cur_element_parent_label += ', class="' + current_element.$.attributes.class.value + '"'; 
                                }
                                
                                // Alter a dialog window title
                                this.getElement().getFirst().find('.cke_dialog_title').getItem(0).setText(
                                        //cur_element_parent_label
                                        Drupal.settings.cur_element_and_its_parents_labels[current_element_or_its_parent_index - 1]
                                        );
                                
                                // Try to discover the containers that already existed in
                                // ranges
                                // update dialog field values
                                this.setupContent( this._element = CKEDITOR.plugins.div_extra.getSurroundDiv( editor ) );

                                if (!this._element) {
                                    this._element = current_element;
                                }
			},
			onOk: function() {
                                containers = [ this._element ];

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
				// Remove style only when editing existing DIV. (#6315)
                                this._element.removeCustomData( 'elementStyle' );
				delete this._element;
			}
		};
	}

	CKEDITOR.dialog.add( 'editdiv_extra_1', function( editor ) {
		return divDialog( editor, 0 );
	} );
        
        CKEDITOR.dialog.add( 'editdiv_extra_2', function( editor ) {
		return divDialog( editor, 1 );
	} );
        
        CKEDITOR.dialog.add( 'editdiv_extra_3', function( editor ) {
		return divDialog( editor, 2 );
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
