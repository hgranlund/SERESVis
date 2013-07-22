// Karma configuration
// Generated on Thu Jun 20 2013 13:09:44 GMT+0200 (CEST)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  //   MOCHA,
  //   MOCHA_ADAPTER,
  //   REQUIRE,
  // REQUIRE_ADAPTER,
  'public/js/vendor/d3.v3.js',
  'public/js/vendor/jquery.js',
  'public/js/vendor/*.js',
  'public/js/*.js',
  'test/testValues.js',
  'test/*.js', {
    pattern: 'test/*.html',
    watched: true,
    served: true,
    included: false
  }
];

frameworks = ["jasmine"];

// list of files to exclude
exclude = [
  'app.js',
  'public/js/graph.js',
  'public/js/seres-run.js',
  'karma.conf.js'
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
