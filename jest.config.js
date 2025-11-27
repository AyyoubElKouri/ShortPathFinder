/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: "ts-jest",
	testEnvironment: "jsdom", 
	roots: ["<rootDir>/src"],

	testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],

	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},

	collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};
