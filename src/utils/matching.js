
const greaterThan = (val, value) => value > val;

const lessThan = (val, value) => value < val;

const equalTo = (val, value) => val === value;

const notEqualTo = (val, value) => value !== val;

const greaterOrEqual = (val, value) => value >= val

const lessOrEqual = (val, value) => value <= val;

const validOperators = [
  '=', 'eq', '>', 'gt', '<', 'lt',
  '>=', 'gte', '<=', 'lte', 'in', 'matches'
];

/**
 * Valid operators ("symbol", "word"):
 *  - "=", "gte" - equal
 *  - ">", "gt" - greater than
 *  - "<", "lt" - less than
 *  - ">=", "gte" - greater than or equal to
 *  - "<=", "lte" - less than or equal to
 *  - "in" - checks if a value exists in an array of values
 *  - "matches" - see isMatch()
 */


/**
 * Determines if the provided string is a recognized
 * operator.
 *
 * @name isValidOperator
 * @function
 * @param {!string} operator - The operator to check
 * @param {?string=} operatorType - optional, but if provided,
 * can be "word" or "symbol". If the provided operator is valid, it
 * will return the corresponding "word" or "symbol" for the provided
 * operator. Useful for checking if an operator is valid, while also
 * getting the operator in the required format in one step.
 * @returns {string|boolean} - return false if the operator is
 * not a recognized operator. If the provided operator is valid,
 * returns true if no operatorType is provided, otherwise returns
 * the "symbol" or "word" for the operator if operatorType is given,
 * or true if no operatorType is given.
 * @example
 * let valid;
 * valid = isValidOperator('=');
 * // valid === true
 *
 * valid = isValidOperator('=', 'word');
 * // valid === 'eq'
 *
 * valid = isValidOperator('eq', 'symbol');
 * // valid === '='
 */
export const isValidOperator = (operator, operatorType) => {
  let resp;
  switch(operator) {
    case '=':
    case 'eq':
      resp = operatorType ? (operatorType === 'symbol' ? '=' : 'eq') : true;
      break;
    case '>':
    case 'gt':
      resp = operatorType ? (operatorType === 'symbol' ? '>' : 'gt') : true;
      break;
    case '<':
    case 'lt':
      resp = operatorType ? (operatorType === 'symbol' ? '<' : 'lt') : true;
      break;
    case '>=':
    case 'gte':
      resp = operatorType ? (operatorType === 'symbol' ? '>=' : 'gte') : true;
      break;
    case '<=':
    case 'lte':
      resp = operatorType ? (operatorType === 'symbol' ? '<=' : 'lte') : true;
      break;
    case 'in':
      resp = 'in';
      break;
    case 'matches':
      resp = 'matches';
      break;
    default:
      resp = false;
  }
  return resp;
};

/**
 * Gets the "word" operator equivalent for a given operator.
 * The operator may already be the "word" for the operator,
 * or it can be the "symbol" for the operator.
 *
 * @name getWordOperator
 * @function
 * @param {!string} operator - the operator to convert/check
 * @returns {string|boolean} - the "word" equivalent for
 * the operator if the operator is valid, otherwise false.
 * @example
 * let wordOperator
 * wordOperator = getWordOperator('>=');
 * // wordOperator === 'gte'
 *
 * wordOperator = getWordOperator('gte');
 * // wordOperator === 'gte'
 *
 * wordOperator = getWordOperator('gteq');
 * // wordOperator === false ('gteq' is not a valid operator)
 */
export const getWordOperator = (operator) =>
  isValidOperator(operator, 'word');

/**
 * Same as getWordOperator, except returns the "symbol"
 * for the operator
 * @name getSymbolOperator
 * @function
 * @param {!string} operator - The operator to convert/check
 * @returns {string|boolean} - the "symbol" for the
 * operator if the operator is valid, otherwise false
 */
export const getSymbolOperator = (operator) =>
  isValidOperator(operator, 'symbol');


/**
 * Given an operator, it returns the function that
 * will perform the comparison/match.
 * @name getOperatorFn
 * @function
 * @param {!string} operator - The operator to determine
 * the function to return
 * @param {?boolean=} [not = false] - If true, returns the opposite
 * of the provided operator
 * @returns {function(*, *): boolean}
 * @example
 * let operatorFn;
 * operatorFn = getOperatorFn('<=');
 * operatorFn(2, 4) // returns true
 * operatorFn(4, 2) // returns false
 *
 * operatorFn = getOperatorFn('<=', true);
 * operatorFn(4, 2) // returns true
 * operatorFn(2, 4) // returns false
 * operatorFn(2, 2) // returns true
 */
export const getOperatorFn = (operator, not) => {
  let fn;
  switch(operator) {
    case '=':
    case 'eq':
      fn = not ? notEqualTo : equalTo;
      break;
    case '>':
    case 'gt':
      fn = not ? lessOrEqual : greaterThan;
      break;
    case '<':
    case 'lt':
      fn = not ? greaterOrEqual : lessThan;
      break;
    case '>=':
    case 'gte':
      fn = not ? lessThan : greaterOrEqual;
      break;
    case '<=':
    case 'lte':
      fn = not ? greaterThan : lessOrEqual;
      break;
    case 'in':
      fn = not ? isNotMatch : isMatch;
      break;
    case 'matches':
      fn = not ? isNotMatch : isMatch;
      break;
    default:
      throw new Error(`Invalid operator "${operator}" passed to where clause`);
  }
  return fn;
};

/**
 * Given tStrArrRe and a value, it determines if the value "matches".
 *
 * @name isMatch
 * @function
 * @param {(string|Array.<*>|function(?): boolean|RegExp)} tStrArrRe -
 * If string, "*" matches anything, otherwise does equality check. If function,
 * the function is called with the value as the argument. If array, the array
 * it iterated and isMatch() is called on each array element to check for
 * a match. If regex, the regex is tested with the value.
 * @param {?} value - The value to check. Can be anything
 * @returns {boolean} - true if the match passes, false if not
 */
export const isMatch = (tStrArrRe, value) => {
  const typeofArg = typeof tStrArrRe;
  let match;
  switch(typeofArg) {
    case 'undefined':
    case 'number':
    case 'boolean':
      match = tStrArrRe === value;
      break;
    case 'string':
      match = (tStrArrRe === value || tStrArrRe === '*');
      break;
    case 'function':
      match = tStrArrRe(value);
      break;
    default:
      // First check if null. Then if not null,
      // check if array since both array and regex
      // return typeof 'object'.
      if (tStrArrRe === null) {
        match = tStrArrRe === value;
      } else if (Array.isArray(tStrArrRe)) {
        for(let t of tStrArrRe) {
          if (isMatch(t, value)) {
            match = true;
            break;
          }
        }
      } else {
        match = tStrArrRe.test(value);
      }
  }
  return match;
};

/**
 * Same as isMatch(), but returns the opposite boolean
 * @name isNotMatch
 * @function
 * @param {(string|Array.<*>|function(?): boolean|RegExp)} tStrArrRe
 * @param {?} value
 * @returns {boolean} - true if the value is not a match, false if
 * it is a match
 */
export const isNotMatch = (tStrArrRe, value) => {
  return !isMatch(tStrArrRe, value);
};