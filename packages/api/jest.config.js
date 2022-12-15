const jestConfig = require('../../jest.config');

module.exports = {
  ...jestConfig,

  // The test environment that will be used for testing
  testEnvironment: 'node',
};
