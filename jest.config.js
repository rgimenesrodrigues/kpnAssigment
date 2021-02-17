const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        '^lightning/button$': '<rootDir>/force-app/test/jest-mocks/lightning/button',
        '^lightning/datatable$': '<rootDir>/force-app/test/jest-mocks/lightning/datatable',
        '^lightning/platformShowToastEvent$':
            '<rootDir>/force-app/test/jest-mocks/lightning/platformShowToastEvent',
        '^lightning/messageService$':
            '<rootDir>/force-app/test/jest-mocks/lightning/messageService',
      }
};