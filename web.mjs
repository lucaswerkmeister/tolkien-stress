import analyse from './index.mjs';

function languageCode(language) {
	switch (language) {
	case 'Quenya': return 'qya';
	case 'Sindarin': return 'sjn';
	default: throw new Error(`Unknown language ${language}!`);
	}
}

function display(word, language) {
	const { syllableBreaks, stressedSyllable } = analyse(word, language);
	const span = document.createElement('span');
	span.classList.add('word', `word-${language}`);
	span.lang = languageCode(language);
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

document.addEventListener('DOMContentLoaded', () => {
	const wordInput = document.getElementById('word-input');
	function updateWord() {
		const word = wordInput.value.normalize('NFC');
		const language = document.querySelector('input[name=language]:checked').value;
		const oldWord = document.getElementById('word');
		if (oldWord.textContent === word && oldWord.lang === languageCode(language)) {
			return;
		}
		const newWord = display(word, language);
		newWord.id = oldWord.id;
		oldWord.replaceWith(newWord);
	}
	const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	function listenOnWordInput() {
		wordInput.removeEventListener('change', updateWord);
		wordInput.removeEventListener('input', updateWord);
		wordInput.addEventListener(prefersReducedMotionQuery.matches ? 'change' : 'input', updateWord);
	}
	prefersReducedMotionQuery.addListener(listenOnWordInput);
	listenOnWordInput();
	document.getElementById('analyse').addEventListener('click', updateWord);
	document.querySelectorAll('input[name=language]').forEach((languageInput) => {
		languageInput.addEventListener('input', updateWord);
	});
	updateWord();
});
