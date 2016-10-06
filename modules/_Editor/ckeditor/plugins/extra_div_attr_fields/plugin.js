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
    if (typeof Drupal.settings.custom_attr_fields_textarea_type === 'undefined') {
        Drupal.settings.custom_attr_fields_textarea_type = [];
    }
    
    CKEDITOR.plugins.add( 'extra_div_attr_fields', {
        //lang: 'en,de',
        requires: 'widget,dialog', //'widget,dialog,image2',
        init: function(editor) {
            
            CKEDITOR.on('dialogDefinition', function(e) {
                
                // Take the dialog name and its definition from the event data.
                var dialogName = e.data.name;
                var dialogDefinition = e.data.definition;
                
                //console.log(dialogName, 'dialogName');
                //console.log(dialogDefinition,'dialogDefinition');
                
                // make sure this is the right editor (there can be more on one page) and the right dialog.
                
                //if ((e.editor != editor) || (dialogName != 'editdiv' && dialogName != 'editdiv_extra_1'))
                if ((e.editor != editor) || (dialogName != 'editdiv' && dialogName.indexOf('editdiv_extra') == -1))
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
                
                console.log(infoTab, 'infoTab');
                
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
                                type: (Drupal.settings.custom_attr_fields_textarea_type.indexOf(value) == -1) ? 'text' : 'textarea',
                                //requiredContent: 'div[' + value + ']',
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
                
                
                // Alter a bit a elementStyle field, so it wouldn't cause a problem with moved Style field (from advanced to extra tab)
                
                // All this functions below is to recreate all needed functions in new commit/onCange functions that are being altered
                var elementStyleField = infoTab.get('elementStyle');
                // Reuse the 'stylescombo' plugin's styles definition.
                // Registered 'CKEDITOR.style' instances.
		var styles = {};
                editor.getStylesSet( function( stylesDefinitions ) {
                        var styleName, style;

                        if ( stylesDefinitions ) {
                                // Digg only those styles that apply to 'div'.
                                for ( var i = 0; i < stylesDefinitions.length; i++ ) {
                                        var styleDefinition = stylesDefinitions[ i ];
                                        //if ( styleDefinition.element && styleDefinition.element == 'div' ) 
                                        {
                                                styleName = styleDefinition.name;
                                                styles[ styleName ] = style = new CKEDITOR.style( styleDefinition );

//                                                if ( editor.filter.check( style ) ) {
//                                                        // Populate the styles field options with style name.
//                                                        stylesField.items.push( [ styleName, styleName ] );
//                                                        stylesField.add( styleName, styleName );
//                                                }
                                        }
                                }
                        }

//                        // We should disable the content element
//                        // it if no options are available at all.
//                        stylesField[ stylesField.items.length > 1 ? 'enable' : 'disable' ]();
//
//                        // Now setup the field value manually if dialog was opened on element. (#9689)
//                        setTimeout( function() {
//                                dialog._element && stylesField.setup( dialog._element );
//                        }, 0 );
                } );
                           
                // Synchronous field values to other impacted fields is required, e.g. div styles
		// change should also alter inline-style text.
		function commitInternally( targetFields ) {
			var dialog = this.getDialog(),
				element = dialog._element && dialog._element.clone() || new CKEDITOR.dom.element( 'div', editor.document );

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
                
                elementStyleField.onChange = function() {
                                    commitInternally.call( this, [ 'info:elementStyle', 'extra:class', 'advanced:dir', 'extra:style' ] );
                                    };
                elementStyleField.setup = function( element ) {
                                                            if (!element && typeof Drupal.settings.cur_element_and_its_parents !== 'undefined' && typeof Drupal.settings.current_element_or_its_parent_index !== 'undefined') {
//                                                                console.log(Drupal.settings.cur_element_and_its_parents, 'Drupal.settings.cur_element_and_its_parents---');
//                                                                console.log(Drupal.settings.current_element_or_its_parent_index, 'Drupal.settings.current_element_or_its_parent_index---');
                                                                //console.log(current_element, 'current_element---');
                                                                element = Drupal.settings.cur_element_and_its_parents[Drupal.settings.current_element_or_its_parent_index];
                                                            }
                                                            //console.log(element, 'element----');
                                                            //console.log(styles, 'styles-----');
                                                            for ( var name in styles ) {
                                                                console.log(name, 'name');
                                                                console.log(styles[ name ], 'styles[ name ]');
                                                                console.log(this, 'this-------');
                                                                if (styles[ name ].checkElementRemovable( element, true, editor )) {
                                                                    console.log('styles[ name ].checkElementRemovable( element, true, editor ) TRUE');
                                                                }
                                                                else {
                                                                    console.log('styles[ name ].checkElementRemovable( element, true, editor ) FALSE');
                                                                }
                                                                styles[ name ].checkElementRemovable( element, true, editor ) && this.setValue( name, 1 );
                                                                
                                                                //this.setValue( name, 0 );
                                                            }
                                                        
                                                        };
                                                      
                elementStyleField.commit = function( element ) {
							var styleName;
							if ( ( styleName = this.getValue() ) ) {
								var style = styles[ styleName ];
								style.applyToObject( element, editor );
							}
							else {
                                                                // a4s This caused empty style attribute after submitting
								//element.removeAttribute( 'style' );
							}
                                                    };
                
                
            }); // End of CKEDITOR.on('dialogDefinition', function(e) {
        }
    }); // End of CKEDITOR.plugins.add( 'extra_div_attr_fields', {
    
} )();
