/**
 * Inspired by rxjs/isPromise utility
 * Determines whether or not a provided src is an ES6 Promise
 * @param {any} src - The source to check
 * @returns {boolean} - true if the source is a Promise,
 * false if not
 */
function isPromise(src) {
  if (src && typeof src.then === 'function' && typeof src.subscribe !== 'function') {
    return true;
  } else {
    return false;
  }
}

export default isPromise;