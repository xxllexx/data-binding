module.exports = function(grunt) {
 
  grunt.initConfig({
    sass: {                              
      dist: {                            
        files: {                         
          'css/style.css': 'css/style.scss'
        }
      }
    },
    connect: {
      static: {
          options: {
            hostname: 'localhost',
            port: 8001
          }
      }
    },
    watch: {
      html: {
        files: ['*.html', 'css/*.scss', 'js/**/*.js'],
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  
  grunt.registerTask('server', ['connect:static', 'watch']);
};
