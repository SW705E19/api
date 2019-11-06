module.exports = {
  "preset": 'ts-jest',
  "globalSetup": "<rootDir>/node_modules/@databases/pg-test/jest/globalSetup.js",
    "roots": [
      "<rootDir>/src"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
  }
