/**
 * Inspired by rxjs/isObservable utility. Determines
 * if the provided src is an rxjs observable. This is done
 * by checking that lift exists, since just checking for
 * subscribe would not necessarily be accurate.
 * @param {*} src - The src to check
 * @returns {boolean} - true if the source is an Observable,
 * false if not.
 */
function isObservable(src) {
  if (src && typeof src.lift === 'function' && typeof src.subscribe === 'function') {
    return true;
  } else {
    return false;
  }
};

export default isObservable;