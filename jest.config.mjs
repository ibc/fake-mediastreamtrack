const config = {
	verbose: true,
	testEnvironment: 'node',
	testRegex: 'src/test/test.ts',
	transform: {
		'^.+\\.ts?$': ['ts-jest'],
	},
	coveragePathIgnorePatterns: ['src/test'],
	cacheDirectory: '.cache/jest',
};

export default config;
