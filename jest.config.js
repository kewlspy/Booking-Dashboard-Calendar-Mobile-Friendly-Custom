export const testEnvironment = "jest-environment-jsdom";
export const transform = {
  "^.+\\.jsx?$": "babel-jest", // Support for JSX and JS
};
export const setupFilesAfterEnv = [
  "@testing-library/jest-dom", // Enable custom jest matchers
  "./jest.setup.js",
];
export const collectCoverage = true;
export const collectCoverageFrom = [
  "src/**/*.{js,jsx}", // Collect coverage from all .js and .jsx files in the 'src' folder
  "!src/**/*.test.{js,jsx}",
];
