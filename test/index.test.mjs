import analyse from './../index.mjs';
import 'chai/register-expect.js';

describe('analyse', () => {
	const quenyaTestCases = [
		'ai|nu|LIN|da|lë',
		'an|CA|li|ma',
		'ca|la|CIR|ya',
		'e|ä|REN|dil',
		'e|len|TÁ|ri',
		'e|RES|së|a',
		'na|MÁ|ri|ë',
		'nú|me|NÓ|rë',
		'O|ro|me',
		'ta|NI|que|til',
		'tu|RAM|bar',
	];
	const sindarinTestCases = [
		'ALPH',
		'A|man',
		'be|LE|ri|and',
		'CAIR',
		'DE|ne|thor',
		'ec|THE|li|on',
		'e|RI|a|dor',
		'FË|a|nor',
		'FIN|gon',
		'fin|GOL|fin',
		'fi|NAR|fin',
		'i|SIL|dur',
		'me|NEG|roth',
		'nar|GOTH|rond',
		'pe|ri|AN|nath',
		'si|LIV|ren',
	];
	const testCases = [
		...quenyaTestCases.map((word) => [word, 'Quenya']),
		...sindarinTestCases.map((word) => [word, 'Sindarin']),
	].sort(([word1, language1], [word2, language2]) => word1.localeCompare(word2));
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
