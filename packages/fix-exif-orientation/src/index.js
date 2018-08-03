import process from 'process';
import exif from 'exif-component';
import rotate from 'rotate-component';
import dataUriToU8 from 'data-uri-to-u8';
import imageSize from 'image-size';

/**
 * [resizeCanvas description]
 * @param  {[type]} canvas [description]
 * @param  {[type]} width  [description]
 * @param  {[type]} height [description]
 * @return {[type]}        [description]
 */
function resizeCanvas(canvas, { width, height }) {
  const context = canvas.getContext('2d');
  const data = context.getImageData(0, 0, width, height);
  canvas.width = width;
  canvas.height = height;
  context.putImageData(data, 0, 0);
}

/**
 * [getImageFromUrl description]
 * @param  {[type]}   url      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
const getImageFromUrl = (url, callback) => {
  const image = new Image();
  if (callback) image.onload = callback.bind(null, image);
  image.src = url;
  return image;
};

/**
 * [fixOrientation description]
 * @param  {[type]}   url      [description]
 * @param  {[type]}   options  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function fixOrientation(url, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  const buf = dataUriToU8(url);
  let tags = {};
  try {
    tags = exif(buf.buffer);
  } catch (err) { /* ignore error */ }

  const toRotate = tags.Orientation
    && typeof tags.Orientation.value === 'number'
    && (
      tags.Orientation.value === 3 ||
      tags.Orientation.value === 6 ||
      tags.Orientation.value === 8
    );

  if (!toRotate) {
    return process.nextTick(() =>
      callback(url, options.image && getImageFromUrl(url))
    );
  }

  const { width, height } = imageSize(buf);
  const max = Math.max(width, height);
  const half = max / 2;
  const orientation = { 3: 2, 6: 1, 8: -1 }[tags.Orientation.value];
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = canvas.height = max;

  rotate(context, { x: half, y: half, degrees: orientation * 90 });

  getImageFromUrl(url, (image) => {
    if (orientation === 1 || orientation === 2) {
      context.drawImage(image, 0, max - height);
    } else {
      context.drawImage(image, max - width, 0);
    }

    rotate(context, { x: half, y: half, degrees: -1 * orientation * 90 });
    if (orientation === 2 || orientation === -2) {
      resizeCanvas(canvas, { width, height });
    } else {
      resizeCanvas(canvas, { width: height, height: width });
    }

    const dataURL = buf.type === 'image/png'
      ? canvas.toDataURL()
      : canvas.toDataURL('image/jpeg', 1);

    callback(dataURL, options.image && getImageFromUrl(dataURL));
  });
}

/**
 * convert a file into a data url and fix the orientation during the load
 * process
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
export const readFileAsDataURL = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ({ target: { result } }) => {
      fixOrientation(result, { image: true }, resolve);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * convert a data url into a file
 * @param  {[type]} dataURL  [description]
 * @param  {[type]} fileName [description]
 * @return {[type]}          [description]
 */
export const readDataURLAsFile = (dataURL, fileName) =>
  new Promise((resolve, reject) => {
    try {
      const dataArray = dataURL.split(',');
      const mime = dataArray[0].match(/:(.*?);/)[1];
      const decodedString = atob(dataArray[1]); // decodes a base-64 encoded string
      let n = decodedString.length;
      const bitArray = new Uint8Array(n); // array of 8-bit unsigned integers
      while (n--) bitArray[n] = decodedString.charCodeAt(n);

      const file = new File([bitArray], fileName, { type: mime });
      resolve(file);
    } catch (error) { reject(error); }
  });

/**
 * [fixExifOrientation description]
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
export const fixExifOrientation = file =>
  readFileAsDataURL(file)
    .then(dataURL => readDataURLAsFile(dataURL, file.name));
