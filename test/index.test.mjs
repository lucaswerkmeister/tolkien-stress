import analyse from './../index.mjs';
import 'chai/register-expect.js';

describe('analyse', () => {
	const quenyaTestCases = [
		'ai|nu|LIN|da|lë',
		'an|CA|li|ma',
		'an|DÚ|ril',
		'a|TA|que',
		'ca|la|CIR|ya',
		'cui|vi|É|nen',
		'e|ä|REN|dil',
		'e|LEN|dil',
		'e|len|TÁ|ri',
		'e|LES|sar',
		'e|ÖN|we',
		'e|RES|së|a',
		'HYAR|men',
		'i|SIL|dur',
		'na|MÁ|ri|ë',
		'nú|me|NÓ|rë',
		'O|ro|me',
		'o|TO|que',
		'pe|LÓ|ri',
		'SAU|ron',
		'ta|NI|que|til',
		'tu|RAM|bar',
		'u|TUM|no',
	];
	const sindarinTestCases = [
		'ALPH',
		'A|man',
		'A|marth',
		'A|mon',
		'A|ra|gorn',
		'be|LE|ri|and',
		'BO|ro|mir',
		'bra|GOL|lach',
		'BRE|thil',
		'bri|THOM|bar',
		'BRUI|nen',
		'CAIR',
		'ca|RADH|ras',
		'ce|leb|RÍ|an',
		'cris|SAEG|rim',
		'DE|ne|thor',
		'DREN|gist',
		'ec|THE|li|on',
		'E|myn',
		'e|RI|a|dor',
		'FË|a|nor',
		'fin|DUI|las',
		'FIN|gon',
		'fin|GOL|fin',
		'fi|NAR|fin',
		'FO|ro|chel',
		'GA|la|dhon',
		'GWAI|hir',
		'GROND',
		'i|THI|li|en',
		'me|NEG|roth',
		'mi|THEI|thel',
		'mith|RAN|dir',
		'mo|RAN|non',
		'MO|ri|a',
		'MUIL',
		'nar|GOTH|rond',
		'ne|NUI|al',
		'os|GI|li|ath',
		'pe|LEN|nor',
		'pe|ri|AN|nath',
		'si|LIV|ren',
		'tho|RON|dor',
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
