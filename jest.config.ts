import type {Config} from "jest";

const config: Config = {
    collectCoverage: true,
    coverageReporters: ["text", "html"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
    coverageDirectory: "./coverage/",
    setupFiles: [
        "<rootDir>/jest.mocks.ts"
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testEnvironment: "node",
    testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    verbose: true
};

export default config;