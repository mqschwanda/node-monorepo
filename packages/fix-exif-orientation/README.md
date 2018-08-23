# fix-exif-orientation

[![Build Status](https://travis-ci.org/mqschwanda/node-monorepo.svg?branch=master)](https://travis-ci.org/mqschwanda/node-monorepo)
![License](https://img.shields.io/npm/l/express.svg)
[![NPM Downlaods](https://img.shields.io/npm/dt/@mqschwanda/fix-exif-orientation.svg)](https://www.npmjs.com/package/@mqschwanda/fix-exif-orientation)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@mqschwanda/fix-exif-orientation.svg)](https://github.com/mqschwanda/node-monorepo/tree/master/packages/fix-exif-orientation)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@mqschwanda/fix-exif-orientation.svg)](https://github.com/mqschwanda/node-monorepo/tree/master/packages/fix-exif-orientation)

### fixExifOrientation

```js
import { fixExifOrientation } from 'fix-exif-orientation';

const input = document.querySelector('input#image-upload[type=file]'); // file input
const images = [];

input.files.forEach(image => {
  fixExifOrientation(image).then(images.push);
});

// do something with the images
console.log(images);


```
