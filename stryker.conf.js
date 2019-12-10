module.exports = function (config) {
	config.set({
		mutator: 'typescript',
		packageManager: 'npm',
		reporters: ['clear-text', 'progress'],
		testRunner: 'mocha',
		transpilers: ['typescript'],
		testFramework: 'mocha',
		coverageAnalysis: 'off',
		tsconfigFile: 'tsconfig.json',
		mutate: ['src/**/*.ts'],
		mochaOptions: {
			config: '.mocharc.json',
			opts: 'mocha.opts',
		},
	});
};
