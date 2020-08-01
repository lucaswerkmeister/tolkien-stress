import { analyseText } from './index.mjs';

function languageCode(language) {
	switch (language) {
	case 'Quenya': return 'qya';
	case 'Sindarin': return 'sjn';
	default: throw new Error(`Unknown language ${language}!`);
	}
}

function placeholderText(language) {
	switch (language) {
	case 'Quenya': return 'Elessar';
	case 'Sindarin': return 'Mithrandir';
	default: throw new Error(`Unknown language ${language}!`);
	}
}

function displayWord({ word, syllableBreaks, stressedSyllable }, language) {
	const span = document.createElement('span');
	span.classList.add('word');
	if (language) {
		span.lang = languageCode(language);
	}
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

function displayText(text, language) {
	const segments = analyseText(text, language);
	const span = document.createElement('span');
	span.classList.add('text');
	span.lang = languageCode(language);
	for (const segment of segments) {
		if (typeof segment === 'string') {
			span.append(segment);
		} else {
			span.append(displayWord(segment));
		}
	}
	return span;
}

function languageValue() {
	return document.querySelector('input[name=language]:checked').value;
}

document.addEventListener('DOMContentLoaded', () => {
	const textInput = document.getElementById('text-input');
	function updateText() {
		const text = textInput.value;
		const language = languageValue();
		const oldText = document.getElementById('text');
		if (oldText.textContent === text && oldText.lang === languageCode(language)) {
			return;
		}
		const newText = displayText(text, language);
		newText.id = oldText.id;
		oldText.replaceWith(newText);
		textInput.lang = newText.lang;
	}
	function updatePlaceholder() {
		textInput.placeholder = placeholderText(languageValue());
	}
	const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	function listenOnTextInput() {
		textInput.removeEventListener('change', updateText);
		textInput.removeEventListener('input', updateText);
		textInput.addEventListener(prefersReducedMotionQuery.matches ? 'change' : 'input', updateText);
	}
	prefersReducedMotionQuery.addListener(listenOnTextInput);
	listenOnTextInput();
	document.getElementById('analyse').addEventListener('click', updateText);
	document.querySelectorAll('input[name=language]').forEach((languageInput) => {
		languageInput.addEventListener('input', updateText);
		languageInput.addEventListener('input', updatePlaceholder);
	});
	updateText();
	updatePlaceholder();
	const showSyllableBreaks = document.getElementById('show-syllable-breaks');
	function updateShowSyllableBreaks() {
		document.body.classList.toggle('show-syllable-breaks', showSyllableBreaks.checked);
	}
	showSyllableBreaks.addEventListener('input', updateShowSyllableBreaks);
	updateShowSyllableBreaks();
});
