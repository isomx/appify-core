/**
 * Determine if a provided value is a function or
 * implements one or more of the Observable
 * Subscriber methods (next|error|complete).
 * @param {?=} [value] - Any value
 * @returns {string|boolean} - Returns
 * "callback" if the provided value is a function,
 * "subscriber" if it is an object that implements
 * one or more of the Subscriber methods (next|error|complete),
 * false in for all other values.
 */
function isCallbackOrSubscriber(value){
  if (!value) {
    return false;
  }
  if (typeof value === 'function') {
    return 'callback';
  }
  if (typeof value === 'object') {
    if (typeof value.next === 'function') {
      return 'subscriber';
    }
    if (typeof value.error === 'function') {
      return 'subscriber';
    }
    if (typeof value.complete === 'function') {
      return 'subscriber';
    }
  }
  return false;
}

export default isCallbackOrSubscriber;