/**
 * Given a string, it converts the first letter to upper-case.
 * @function lowerCaseFirstLetter
 * @param {string} str - the string
 * @returns {string} the result
 * @example
 * console.log(lowerCaseFirstLetter(Address))
 * // "address"
 */
function lowerCaseFirstLetter(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export default lowerCaseFirstLetter;