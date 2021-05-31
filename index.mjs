/**
 * Analyse the word in the given language (Quenya or Sindarin).
 *
 * Returns the list of syllable breaks and the index of the stressed syllable.
 * The syllable breaks are char indices in the word string,
 * and include both the beginning and the end of the word.
 *
 * @param {string} word The word to analyse. Must be in NFC form.
 * @param {'Quenya'|'Sindarin'} language The language of the word.
 * @returns {{ syllableBreaks: number[], stressedSyllable: number}}
 */
export function analyseWord(word, language) {
	/** Is the word in Sindarin? */
	const sindarin = language === 'Sindarin';
	/** Is the word in Quenya? */
	const quenya = !sindarin;

	/** Char indices where the word is broken up into syllables, in reverse order. */
	const syllableBreaks = [];
	/** Have we already found the vowel of the current syllable? */
	let haveVowel = false;
	/** Char index of the last vowel we saw, which may or may not become a syllable break. */
	let lastVowel = null;
	/** How many consonants have we seen since the last vowel? */
	let consonantsSinceLastVowel = 0;
	/** The index of the stressed syllable, counting from the end. */
	let stressedSyllable = null;
	for (let i = word.length - 1; i >= 0; i--) {
		// note: we iterate over chars, not code points;
		// should make no difference since all needed characters are BMP
		const letter = word[i].toLowerCase();
		let previousLetter = i > 0 ? word[i - 1].toLowerCase() : undefined;
		if (previousLetter === 'u' && i > 1 && word[i - 2].toLowerCase() === 'q') {
			previousLetter = 'w'; // for cw, see below
		}
		/** Does this position count as a vowel for the purposes of syllabification? */
		let vowel = false;
		/** If yes, is it a long vowel or diphthong? */
		let long = false;
		/** Is it specifically a diphthong? (This flag is only used temporarily.) */
		let diphthong = false;
		switch (letter) {
		case 'i':
			vowel = true;
			switch (previousLetter) {
			case 'u':
			case 'a':
				diphthong = true;
				break;
			case 'o':
				diphthong = quenya;
				break;
			case 'e':
				diphthong = sindarin;
				break;
			}
			break;
		case 'e':
			vowel = true;
			switch (previousLetter) {
			case 'a':
			case 'o':
				diphthong = sindarin;
				break;
			}
			break;
		case 'u':
			vowel = true;
			switch (previousLetter) {
			case 'q':
				// qu stands for cw in Quenya (and never occurs in Sindarin) – two consonants
				vowel = false;
				i--;
				consonantsSinceLastVowel++;
				break;
			case 'i':
			case 'e':
				diphthong = quenya;
				break;
			case 'a':
				diphthong = true;
				break;
			}
			break;
		case 'a':
		case 'o':
		case 'ï':
		case 'ë':
		case 'ä':
		case 'ö':
		case 'ü':
			vowel = true;
			break;
		case 'y':
			vowel = sindarin;
			break;
		case 'í':
		case 'î':
		case 'é':
		case 'ê':
		case 'á':
		case 'â':
		case 'ó':
		case 'ô':
		case 'ú':
		case 'û':
			vowel = true;
			long = true;
			break;
		case 'ý':
		case 'ŷ':
			vowel = sindarin;
			long = vowel;
			break;
		case 'h':
			switch (previousLetter) {
			case 'c':
			case 'd':
			case 't':
				i--;
				break;
			}
		}
		if (diphthong) {
			long = true;
			i--;
		}

		if (haveVowel) {
			syllableBreaks.push(vowel ? lastVowel : i);
		}
		haveVowel = vowel;
		if (vowel) {
			lastVowel = i;
		}

		if (stressedSyllable === null && vowel) {
			if (long || consonantsSinceLastVowel > 1) {
				if (syllableBreaks.length > 0) {
					stressedSyllable = syllableBreaks.length;
				}
			} else {
				if (syllableBreaks.length > 1) { // eslint-disable-line no-lonely-if
					stressedSyllable = syllableBreaks.length;
				}
			}
		}

		if (vowel) {
			consonantsSinceLastVowel = 0;
		} else {
			consonantsSinceLastVowel++;
		}
	}

	// push the syllable break at the beginning, if it didn’t close already
	if (!(syllableBreaks[syllableBreaks.length - 1] === 0)) {
		if (!haveVowel && syllableBreaks.length > 0) {
			// move last syllable break to beginning
			syllableBreaks[syllableBreaks.length - 1] = 0;
		} else {
			// push a new one
			syllableBreaks.push(0);
		}
	}

	if (stressedSyllable === null) {
		stressedSyllable = syllableBreaks.length - 1;
	}

	// all this analysis was end-to-beginning, but now reverse the results for the caller
	syllableBreaks.reverse();
	stressedSyllable = syllableBreaks.length - stressedSyllable - 1;

	// push the syllable break at the end, too
	syllableBreaks.push(word.length);

	return { syllableBreaks, stressedSyllable };
}

/**
 * Analyse the text in the given language (Quenya or Sindarin).
 *
 * Returns a list of alternating word and non-word segments.
 * Non-word segments are simply strings (e.g. spaces or hyphens between words),
 * whereas words segments are objects with the word as a string
 * and the syllable information as returned by {@link analyseWord}.
 *
 * @param {string} text The text to analyse.
 * @param {'Quenya'|'Sindarin'} language The language of the word.
 * @returns {({ word: string, syllableBreaks: number[], stressedSyllable: number}|string)[]}
 */
export function analyseText(text, language) {
	text = text.normalize('NFC'); // eslint-disable-line no-param-reassign
	// regex that yields words and non-words alternatingly:
	// letter characters until non-letter / EOL (word),
	// or non-letters until letter / EOL (non-word);
	// the sticky flag (y) ensures we don’t skip any characters between matches
	const wordRegexp = /\p{L}+(?=\P{L}|$)|\P{L}+(?=\p{L}|$)/guy;
	let match;
	let endOfLastMatch;
	let matchIsWord = true;
	const segments = [];
	// eslint-disable-next-line no-cond-assign
	while ((match = wordRegexp.exec(text)) !== null) {
		const [segment] = match;
		const { index } = match;
		if (segments.length === 0 && index > 0) {
			segments.push(text.substr(0, index));
		}
		endOfLastMatch = index + segment.length;
		if (matchIsWord) {
			segments.push({ word: segment, ...analyseWord(segment, language) });
		} else {
			segments.push(segment);
		}
		matchIsWord = !matchIsWord;
	}
	if (endOfLastMatch < text.length) {
		segments.push(text.substr(endOfLastMatch));
	}
	return segments;
}
