/*eslint-disable*/
'use strict';

process.env.BABEL_ENV = 'test';
module.exports = function(wallaby) {
  return {
    env: {
      type: 'node'
    },

    testFramework: 'jasmine',

    files: [
      {pattern: 'node_modules/jasmine-expect/**/*.*', instrument: false, load: true},
      'src/**/*.js'
    ],

    tests: [
      'test/**/*.[Ss]pec.js'
    ],

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    setup: (w) => {
      require('babel-polyfill');
      require('app-root-path').setPath(w.projectCacheDir);
    }
  };
};
