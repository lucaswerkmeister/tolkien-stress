import analyse from './index.mjs';

function display(word, language) {
	const { syllableBreaks, stressedSyllable } = analyse(word, language);
	const span = document.createElement('span');
	span.classList.add('word', `word-${language}`);
	for (let i = 0; i < syllableBreaks.length - 1; i++) {
		const start = syllableBreaks[i];
		const end = syllableBreaks[i + 1];
		const syllable = document.createElement('span');
		syllable.classList.add('syllable');
		syllable.textContent = word.substring(start, end);
		if (i === stressedSyllable) {
			syllable.classList.add('syllable-stressed');
		}
		span.append(syllable);
	}
	return span;
}

function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

document.addEventListener('DOMContentLoaded', () => {
	const wordInput = document.getElementById('word-input');
	function updateWord() {
		const language = document.querySelector('input[name=language]:checked').value;
		const newWord = display(wordInput.value.normalize('NFC'), language);
		newWord.id = 'word';
		document.getElementById('word').replaceWith(newWord);
	}
	wordInput.addEventListener(prefersReducedMotion() ? 'change' : 'input', updateWord);
	document.getElementById('analyse').addEventListener('click', updateWord);
	document.querySelectorAll('input[name=language]').forEach((languageInput) => {
		languageInput.addEventListener('input', updateWord);
	});
	updateWord();
});
