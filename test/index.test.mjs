import analyse from './../index.mjs';
import 'chai/register-expect.js';

describe('analyse', () => {
	const quenyaTestCases = [
		'ai|nu|LIN|da|lë',
		'e|ä|REN|dil',
		'e|len|TÁ|ri',
		'e|RES|së|a',
		'na|MÁ|ri|ë',
		'nú|me|NÓ|rë',
		'tu|RAM|bar',
	];
	const sindarinTestCases = [
		'ALPH',
		'A|man',
		'be|LE|ri|and',
		'e|RI|a|dor',
		'FIN|gon',
		'fin|GOL|fin',
		'fi|NAR|fin',
		'me|NEG|roth',
		'nar|GOTH|rond',
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
