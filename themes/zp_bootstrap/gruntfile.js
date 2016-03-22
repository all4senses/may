module.exports = function (grunt) {
  
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.loadNpmTasks('grunt-contrib-compass');
      //grunt.loadNpmTasks('grunt-autoprefixer'); // Deprecated
      grunt.loadNpmTasks('grunt-postcss');
      grunt.loadNpmTasks('grunt-contrib-uglify');
      //grunt.loadNpmTasks('grunt-w3c-markup-validation'); // Doesn't work... :( Warning: Cannot read property 'length' of undefined Use --force to continue.
      
      grunt.initConfig({
          uglify: {
              js_dev: {
                  options: {
                      preserveComments: 'all',
                      beautify: {
                        width: 80,
                        beautify: true
                      } // beautify
                  }, // options
                  files: {
                      'js/scripts.js': [
                          'bootstrap/javascripts/bootstrap/affix.js',
                          'bootstrap/javascripts/bootstrap/alert.js',
                          'bootstrap/javascripts/bootstrap/button.js',
                          'bootstrap/javascripts/bootstrap/carousel.js',
                          'bootstrap/javascripts/bootstrap/collapse.js',
                          'bootstrap/javascripts/bootstrap/dropdown.js',
                          'bootstrap/javascripts/bootstrap/modal.js',
                          'bootstrap/javascripts/bootstrap/tooltip.js',
                          'bootstrap/javascripts/bootstrap/popover.js',
                          'bootstrap/javascripts/bootstrap/scrollspy.js',
                          'bootstrap/javascripts/bootstrap/tab.js',
                          'bootstrap/javascripts/bootstrap/transition.js',
                          'assets/js/*.js'
                      ]
                  } // files
              }, // js_dev
              js_prod: {
                  files: {
                  'js/scripts.js': [
                      'bootstrap/javascripts/bootstrap/affix.js',
                      'bootstrap/javascripts/bootstrap/alert.js',
                      'bootstrap/javascripts/bootstrap/button.js',
                      'bootstrap/javascripts/bootstrap/carousel.js',
                      'bootstrap/javascripts/bootstrap/collapse.js',
                      'bootstrap/javascripts/bootstrap/dropdown.js',
                      'bootstrap/javascripts/bootstrap/modal.js',
                      'bootstrap/javascripts/bootstrap/tooltip.js',
                      'bootstrap/javascripts/bootstrap/popover.js',
                      'bootstrap/javascripts/bootstrap/scrollspy.js',
                      'bootstrap/javascripts/bootstrap/tab.js',
                      'bootstrap/javascripts/bootstrap/transition.js',
                      'assets/js/*.js'
                    ]
                  } // files
              } // js_prod
          }, // uglify
          compass: {
              prod: {
                  options: {
                      config: 'config_prod.rb',
                      environment: 'production'
                  } // options
              }, // prod
              dev: {
                  options: {
                      config: 'config.rb'
                  } // options
              } // dev
          }, // compass
          /*
          autoprefixer: {
              prod: {
                  options: {
                    // Task-specific options go here.
                  },
                  multiple_files: {
                    expand: true,
                    flatten: true,
                    src: 'css/*.css',
                    dest: 'css/ap/'
                  },
              }, // prod
              dev: {
                  options: {
                    // Task-specific options go here.
                  },
                  multiple_files: {
                    expand: true,
                    flatten: true,
                    src: 'css/*.css',
                    dest: 'css/ap/'
                  },
              } // dev
          },
          */
         
          postcss: {
                  options: {
                      //map: true, // inline sourcemaps

                      // or
                      
                      map: {
                          inline: false, // save all sourcemaps as separate files...
                          annotation: 'css/postcss/' // ...to the specified directory
                      },
                      
                      processors: [
                          require('pixrem')(), // add fallbacks for rem units
                          require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
                          //require('cssnano')() // minify the result
                      ] // processors
                  }, // options
                  
                  dist: {
                    // src: 'css/custom.css',
                    // dest: 'css/custom_postcss.css'
                    // Works.
                    files: {
                        'css/postcss/custom_postcss.css': 'css/custom.css', // This will not be actually used, cause it's added to style.css (below)
                        'css/postcss/style_postcss.css': 'css/style.css'
                    }
                  },

                  // seems doesn't work
                  /*
                  multiple_files: [{
                    //expand: true,
                    //flatten: true,
                    src: 'css/*.css', // -> src/css/file1.css, src/css/file2.css
                    dest: 'css/postcss/' // -> dest/css/file1.css, dest/css/file2.css
                  }]
                  */
          },

          // Doesn't work... :( Warning: Cannot read property 'length' of undefined Use --force to continue.
          /*
          w3c_markup_validation : {
              //failOnError : false,
              pages : ['templates/*.html'], //['templates/*.tpl.php'], //['./test-pages/fails.html', 'http://www.google.com'],
              ignore : ['no document type delaration']
          },
          */
          watch: {
              sass: {
                  files: [
                      'assets/sass/*.scss'
                  ],
                  tasks: ['compass:dev']
              }, // sass
              /*
              autoprefixer: {
                  files: [
                      'css/*.css'
                  ],
                  tasks: ['autoprefixer:dev']
              }, // autoprefixer
              */
              postcss: {
                  files: ['css/*.css'], 
                  tasks: ['postcss']
              },
              
              // Doesn't work... :( Warning: Cannot read property 'length' of undefined Use --force to continue.
              /*
              w3c_markup_validation: {
                  files: ['templates/*.html'], 
                  tasks: ['w3c_markup_validation']
              },
              */
              javascripts: {
                  files: ['assets/js/*.js'], // We only need to watch the custom js
                  tasks: ['uglify:js_dev']
              } // javascripts
          } // watch
      }); // initConfig
      grunt.registerTask('default', 'watch');
      grunt.registerTask('prod', ['uglify:js_prod', 'compass:prod', 'postcss']);
} // exports