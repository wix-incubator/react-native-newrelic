require('babel-register');
require('babel-polyfill');

const Jasmine = require('jasmine');
const jrunner = new Jasmine();

jrunner.loadConfig(
  {
    spec_dir: "test",
    spec_files: [
      "**/*.[sS]pec.js"
    ],
    helpers: [
      "../node_modules/jasmine-expect/index.js"
    ]
  }
);

jrunner.execute();
