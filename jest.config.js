/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  watchman: false,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

