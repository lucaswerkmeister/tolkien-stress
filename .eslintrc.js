module.exports = {
	env: {
		browser: true,
		es6: true,
		mocha: true,
		node: true,
	},
	extends: [
		'airbnb-base',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 11,
		sourceType: 'module',
	},
	rules: {
		// tweak
		indent: ['error', 'tab'], // better for accessibility
		// turn off
		'default-case': 'off', // no need for default cases
		'import/extensions': 'off', // import with extension required on the web
		'no-plusplus': 'off', // index.mjs is fairly C-ish, ++/-- make sense
		'no-tabs': 'off', // see indent
	},
};
