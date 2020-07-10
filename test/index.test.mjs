import { analyseWord, analyseText } from './../index.mjs';
import 'chai/register-expect.js';

describe('analyseWord', () => {
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
		'EN|qui|ë',
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
		'ar|NOE|di|ad',
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
		'NAUG|rim',
		'NAUG|la|mír',
		'ne|NUI|al',
		'os|GI|li|ath',
		'pa|LAN|tír',
		'pa|lan|TÍ|ri',
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
			const { syllableBreaks, stressedSyllable } = analyseWord(word, language);
			expect(syllableBreaks).to.eql(expectedSyllableBreaks);
			expect(stressedSyllable).to.equal(expectedStressedSyllable);
		});
	}

	const quenyaDiphthongs = [
		'ui',
		'oi',
		'ai',
		'iu',
		'eu',
		'au',
	];
	const sindarinDiphthongs = [
		'ae',
		'ai',
		'ei',
		'oe',
		'ui',
		'au',
	];
	const diphthongs = [
		...quenyaDiphthongs.map((diphthong) => [diphthong, 'Quenya']),
		...sindarinDiphthongs.map((diphthong) => [diphthong, 'Sindarin']),
	];
	for (const [diphthong, language] of diphthongs) {
		it(`correctly analyses diphthong ${diphthong} in ${language}`, () => {
			const { syllableBreaks, stressedSyllable } = analyseWord(diphthong, language);
			expect(syllableBreaks).to.eql([0, 2]);
			expect(stressedSyllable).to.equal(0);
		});
	}
});

describe('analyseText', () => {
	it('correctly analyses “Namárië” in Quenya', () => {
		const Namárië = `
Ai! laurië lantar lassi súrinen,
yéni unótimë ve rámar aldaron!
Yéni ve lintë yuldar avánier
mi oromardi lisse-miruvóreva
Andúnë pella, Vardo tellumar
nu luini yassen tintilar i eleni
ómaryo airetári-lírinen.
`.trim();
		const expected = [
			{ word: 'Ai', syllableBreaks: [0, 2], stressedSyllable: 0 },
			'! ',
			{ word: 'laurië', syllableBreaks: [0, 3, 5, 6], stressedSyllable: 0 },
			' ',
			{ word: 'lantar', syllableBreaks: [0, 3, 6], stressedSyllable: 0 },
			' ',
			{ word: 'lassi', syllableBreaks: [0, 3, 5], stressedSyllable: 0 },
			' ',
			{ word: 'súrinen', syllableBreaks: [0, 2, 4, 7], stressedSyllable: 0 },
			',\n',
			{ word: 'yéni', syllableBreaks: [0, 2, 4], stressedSyllable: 0 },
			' ',
			{ word: 'unótimë', syllableBreaks: [0, 1, 3, 5, 7], stressedSyllable: 1 },
			' ',
			{ word: 've', syllableBreaks: [0, 2], stressedSyllable: 0 },
			' ',
			{ word: 'rámar', syllableBreaks: [0, 2, 5], stressedSyllable: 0 },
			' ',
			{ word: 'aldaron', syllableBreaks: [0, 2, 4, 7], stressedSyllable: 0 },
			'!\n',
			{ word: 'Yéni', syllableBreaks: [0, 2, 4], stressedSyllable: 0 },
			' ',
			{ word: 've', syllableBreaks: [0, 2], stressedSyllable: 0 },
			' ',
			{ word: 'lintë', syllableBreaks: [0, 3, 5], stressedSyllable: 0 },
			' ',
			{ word: 'yuldar', syllableBreaks: [0, 3, 6], stressedSyllable: 0 },
			' ',
			{ word: 'avánier', syllableBreaks: [0, 1, 3, 5, 7], stressedSyllable: 1 },
			'\n',
			{ word: 'mi', syllableBreaks: [0, 2], stressedSyllable: 0 },
			' ',
			{ word: 'oromardi', syllableBreaks: [0, 1, 3, 6, 8], stressedSyllable: 2 },
			' ',
			{ word: 'lisse', syllableBreaks: [0, 3, 5], stressedSyllable: 0 },
			'-',
			{ word: 'miruvóreva', syllableBreaks: [0, 2, 4, 6, 8, 10], stressedSyllable: 2 },
			'\n',
			{ word: 'Andúnë', syllableBreaks: [0, 2, 4, 6], stressedSyllable: 1 },
			' ',
			{ word: 'pella', syllableBreaks: [0, 3, 5], stressedSyllable: 0 },
			', ',
			{ word: 'Vardo', syllableBreaks: [0, 3, 5], stressedSyllable: 0 },
			' ',
			{ word: 'tellumar', syllableBreaks: [0, 3, 5, 8], stressedSyllable: 0 },
			'\n',
			{ word: 'nu', syllableBreaks: [0, 2], stressedSyllable: 0 },
			' ',
			{ word: 'luini', syllableBreaks: [0, 3, 5], stressedSyllable: 0 },
			' ',
			{ word: 'yassen', syllableBreaks: [0, 3, 6], stressedSyllable: 0 },
			' ',
			{ word: 'tintilar', syllableBreaks: [0, 3, 5, 8], stressedSyllable: 0 },
			' ',
			{ word: 'i', syllableBreaks: [0, 1], stressedSyllable: 0 },
			' ',
			{ word: 'eleni', syllableBreaks: [0, 1, 3, 5], stressedSyllable: 0 },
			'\n',
			{ word: 'ómaryo', syllableBreaks: [0, 1, 4, 6], stressedSyllable: 1 },
			' ',
			{ word: 'airetári', syllableBreaks: [0, 2, 4, 6, 8], stressedSyllable: 2 },
			'-',
			{ word: 'lírinen', syllableBreaks: [0, 2, 4, 7], stressedSyllable: 0 },
			'.',
		];
		const actual = analyseText(Namárië, 'Quenya');
		expect(actual).to.eql(expected);
	});

	it('correctly analyses “A Elbereth Gilthoniel” in Sindarin', () => {
		const Elbereth = `
A Elbereth Gilthoniel
silivren penna míriel
o menel aglar elenath!
Na-chaered palan-díriel
o galadhremmin ennorath,
Fanuilos, le linnathon
nef aear, sí nef aearon!

A Elbereth Gilthoniel
o menel palan-díriel,
le nallon sí di'nguruthos!
A tiro nin, Fanuilos!
`.trim();
		const expected = [
			{ word: 'A', syllableBreaks: [0, 1], stressedSyllable: 0 },
			' ',
			{ word: 'Elbereth', syllableBreaks: [0, 2, 4, 8], stressedSyllable: 0 },
			' ',
			{ word: 'Gilthoniel', syllableBreaks: [0, 3, 6, 8, 10], stressedSyllable: 1 },
			'\n',
			{ word: 'silivren', syllableBreaks: [0, 2, 5, 8], stressedSyllable: 1 },
			' ',
			{ word: 'penna', syllableBreaks: [0, 3, 5], stressedSyllable: 0 },
			' ',
			{ word: 'míriel', syllableBreaks: [0, 2, 4, 6], stressedSyllable: 0 },
			'\n',
			{ word: 'o', syllableBreaks: [0, 1], stressedSyllable: 0 },
			' ',
			{ word: 'menel', syllableBreaks: [0, 2, 5], stressedSyllable: 0 },
			' ',
			{ word: 'aglar', syllableBreaks: [0, 2, 5], stressedSyllable: 0 },
			' ',
			{ word: 'elenath', syllableBreaks: [0, 1, 3, 7], stressedSyllable: 0 },
			'!\n',
			{ word: 'Na', syllableBreaks: [0, 2], stressedSyllable: 0 },
			'-',
			{ word: 'chaered', syllableBreaks: [0, 4, 7], stressedSyllable: 0 },
			' ',
			{ word: 'palan', syllableBreaks: [0, 2, 5], stressedSyllable: 0 },
			'-',
			{ word: 'díriel', syllableBreaks: [0, 2, 4, 6], stressedSyllable: 0 },
			'\n',
			{ word: 'o', syllableBreaks: [0, 1], stressedSyllable: 0 },
			' ',
			{ word: 'galadhremmin', syllableBreaks: [0, 2, 6, 9, 12], stressedSyllable: 2 },
			' ',
			{ word: 'ennorath', syllableBreaks: [0, 2, 4, 8], stressedSyllable: 0 },
			',\n',
			{ word: 'Fanuilos', syllableBreaks: [0, 2, 5, 8], stressedSyllable: 1 },
			', ',
			{ word: 'le', syllableBreaks: [0, 2], stressedSyllable: 0 },
			' ',
			{ word: 'linnathon', syllableBreaks: [0, 3, 5, 9], stressedSyllable: 0 },
			'\n',
			{ word: 'nef', syllableBreaks: [0, 3], stressedSyllable: 0 },
			' ',
			{ word: 'aear', syllableBreaks: [0, 2, 4], stressedSyllable: 0 },
			', ',
			{ word: 'sí', syllableBreaks: [0, 2], stressedSyllable: 0 },
			' ',
			{ word: 'nef', syllableBreaks: [0, 3], stressedSyllable: 0 },
			' ',
			{ word: 'aearon', syllableBreaks: [0, 2, 3, 6], stressedSyllable: 0 },
			'!\n\n',
			{ word: 'A', syllableBreaks: [0, 1], stressedSyllable: 0 },
			' ',
			{ word: 'Elbereth', syllableBreaks: [0, 2, 4, 8], stressedSyllable: 0 },
			' ',
			{ word: 'Gilthoniel', syllableBreaks: [0, 3, 6, 8, 10], stressedSyllable: 1 },
			'\n',
			{ word: 'o', syllableBreaks: [0, 1], stressedSyllable: 0 },
			' ',
			{ word: 'menel', syllableBreaks: [0, 2, 5], stressedSyllable: 0 },
			' ',
			{ word: 'palan', syllableBreaks: [0, 2, 5], stressedSyllable: 0 },
			'-',
			{ word: 'díriel', syllableBreaks: [0, 2, 4, 6], stressedSyllable: 0 },
			',\n',
			{ word: 'le', syllableBreaks: [0, 2], stressedSyllable: 0 },
			' ',
			{ word: 'nallon', syllableBreaks: [0, 3, 6], stressedSyllable: 0 },
			' ',
			{ word: 'sí', syllableBreaks: [0, 2], stressedSyllable: 0 },
			' ',
			{ word: 'di', syllableBreaks: [0, 2], stressedSyllable: 0 },
			'\'',
			{ word: 'nguruthos', syllableBreaks: [0, 3, 5, 9], stressedSyllable: 0 },
			'!\n',
			{ word: 'A', syllableBreaks: [0, 1], stressedSyllable: 0 },
			' ',
			{ word: 'tiro', syllableBreaks: [0, 2, 4], stressedSyllable: 0 },
			' ',
			{ word: 'nin', syllableBreaks: [0, 3], stressedSyllable: 0 },
			', ',
			{ word: 'Fanuilos', syllableBreaks: [0, 2, 5, 8], stressedSyllable: 1 },
			'!',
		]
		const actual = analyseText(Elbereth, 'Sindarin');
		expect(actual).to.eql(expected);
	});

	it('correctly analyses “Gil-galad” in Sindarin', () => {
		const expected = [
			{ word: 'Gil', syllableBreaks: [0, 3], stressedSyllable: 0 },
			'-',
			{ word: 'galad', syllableBreaks: [0, 2, 5], stressedSyllable: 0 },
		];
		const actual = analyseText('Gil-galad', 'Sindarin');
		expect(actual).to.eql(expected);
	});

	it('correctly analyses “Barad-dûr” in Sindarin', () => {
		const expected = [
			{ word: 'Barad', syllableBreaks: [0, 2, 5], stressedSyllable: 0 },
			'-',
			{ word: 'dûr', syllableBreaks: [0, 3], stressedSyllable: 0 },
		];
		const actual = analyseText('Barad-dûr', 'Sindarin');
		expect(actual).to.eql(expected);
	});
});
