/**
 * Given a string, it converts the first letter to upper-case.
 * @function upperCaseFirstLetter
 * @param {string} str - the string
 * @returns {string} the result
 * @example
 * console.log(upperCaseFirstLetter(address))
 * // "Address"
 */
function upperCaseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default upperCaseFirstLetter;