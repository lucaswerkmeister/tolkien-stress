# Tolkien Stress Analyser

A website and package to determine the stressed syllable of a word in one of Tolkien’s languages.

## Website usage

Open the [website](https://lucaswerkmeister.github.io/tolkien-stress/) and enter your text into the text box.
Optionally, change the language with the radio buttons, if you know what language your text is in.

## Package usage

Install the [tolkien-stress](https://www.npmjs.com/package/tolkien-stress) package from NPM.
Two functions are available for import (as an [ECMAScript module](https://nodejs.org/api/esm.html#esm_introduction)):

```js
import { analyseWord, analyseText } from 'tolkien-stress';

const { syllableBreaks, stressedSyllable } = analyseWord('Boromir', 'Sindarin');
console.log(syllableBreaks); // 0, 2, 4, 7: |bo|ro|mir|
console.log(stressedSyllable); // 0: BOromir

const segments = analyseText('Gil-galad', 'Sindarin');
console.log(segments[0]); // { word: 'Gil', syllableBreaks: [ 0, 3 ], stressedSyllable: 0 }
console.log(segments[1]); // '-'
console.log(segments[2]); // { word: 'galad', syllableBreaks: [ 0, 2, 5 ], stressedSyllable: 0 }
```

## Resources

- The Lord of the Rings, Appendix E
- To determine whether a word is Quenya or Sindarin (for the tests and the explanation section):
  - [Quenya dictionary](https://www.ambar-eldaron.com/telechargements/quenya-engl-A4.pdf)
  - [Sindarin dictionary](https://www.jrrvf.com/hisweloke/sindar/online/sindar/dict-sd-en.html)
  - [Tolkien Gateway](http://tolkiengateway.net/), where most articles helpfully have an “Etymology” section

## License

This software is published under the ISC license,
which you may find in the [LICENSE](LICENSE) file that accompanies this repository.
By contributing to this software,
you agree to publish your contribution under that license.
