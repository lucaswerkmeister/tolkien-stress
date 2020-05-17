import analyse from './../index.mjs';
import 'chai/register-expect.js';

describe('analyse', () => {
	const quenyaTestCases = [
		'e|RES|së|a',
	];
	const sindarinTestCases = [
		'A|man',
	];
	const testCases = [
		...quenyaTestCases.map((word) => [word, 'Quenya']),
		...sindarinTestCases.map((word) => [word, 'Sindarin']),
	];
	for (const [testCase, language] of testCases) {
		let word = '';
		const expectedSyllableBreaks = [0];
		let expectedStressedSyllable = null;
		const syllables = testCase.split('|');
		for (let [i, syllable] of syllables.entries()) {
			word += syllable.toLowerCase();
			expectedSyllableBreaks.push(word.length);
			if (syllable.toUpperCase() === syllable) {
				expectedStressedSyllable = i;
			}
		}
		word = word.replace(/^./, (char) => char.toUpperCase());
		it(`correctly analyses ${word} in ${language} (${testCase})`, () => {
			const { syllableBreaks, stressedSyllable } = analyse(word, language);
			expect(syllableBreaks).to.eql(expectedSyllableBreaks);
			expect(stressedSyllable).to.equal(expectedStressedSyllable);
		});
	}
});
