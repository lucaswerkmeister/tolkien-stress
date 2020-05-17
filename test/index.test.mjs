import analyse from './../index.mjs';
import 'chai/register-expect.js';

describe('analyse', () => {
	const testCases = [
		['Aman', 'Sindarin', [0, 1, 4], 0],
	];
	for (const [word, language, expectedSyllableBreaks, expectedStressedSyllable] of testCases) {
		it(`correctly analyses ${word} in ${language}`, () => {
			const { syllableBreaks, stressedSyllable } = analyse(word, language);
			expect(syllableBreaks).to.eql(expectedSyllableBreaks);
			expect(stressedSyllable).to.equal(expectedStressedSyllable);
		});
	}
});
