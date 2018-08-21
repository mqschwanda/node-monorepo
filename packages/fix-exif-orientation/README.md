# fix-exif-orientation

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
