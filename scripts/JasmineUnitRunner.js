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

jrunner.configureDefaultReporter({
  print: () => {
    // do nothing
  }
});
if (process.env.IS_BUILD_AGENT) {
  const JasmineReporters = require('jasmine-reporters');
  jrunner.addReporter(new JasmineReporters.TeamCityReporter());
} else {
  const SpecReporter = require('jasmine-spec-reporter');
  jrunner.addReporter(new SpecReporter());
}

jrunner.execute();
