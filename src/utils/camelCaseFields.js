import upperCaseFirstLetter from './upperCaseFirstLetter';
import lowerCaseFirstLetter from './lowerCaseFirstLetter';


/**
 * Combines two strings to a combined camelCase representation.
 * This is not a robust solution such as lodash's camel-case,
 * and is just a light-weight convenience function for a common
 * need of combining simple strings. For example, when dealing
 * with field names on a Model.
 *
 * It only calls upperCaseFirstLetter(str2) and (optionally)
 * lowerCaseFirstLetter(str1) if str1LowerCaseFirstLetter param
 * is true. Then it combines the two and returns the result.
 *
 * @param {string} str1 - the first string
 * @param {string} str2 - the second string
 * @param {?boolean=} [str1LowerCaseFirstLetter = false] - If
 * true, it will call lowerCaseFirstLetter(str1) before adding
 * str2.
 * @returns {string}
 * @example
 * console.log(camelCaseFields('User', 'address'))
 * // "UserAddress"
 *
 * console.log(camelCaseFields('User', 'address', true))
 * // "userAddress"
 */
function camelCaseFields(str1, str2, str1LowerCaseFirstLetter) {
  if (str1LowerCaseFirstLetter) {
    str1 = lowerCaseFirstLetter(str1);
  }
  return str1 + upperCaseFirstLetter(str2);
}

export default camelCaseFields;