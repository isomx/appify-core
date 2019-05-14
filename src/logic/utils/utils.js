import uniqueId from '../utils/uniqueId';
import { DEFAULTS, NAME, ID, ACTION_TYPE } from "../constants/logicProps";

/**
 * Creates an id for the provided logic based on its
 * defined name. If the logic has a logicActionType key,
 * it will be used as the suffix to the name. Otherwise,
 * a uniqueId will be generated and appended to the name.
 * Note that logicActionType is not a key used by Core's
 * withLogic() operator, but is used by withActionLogic()
 * operators defined by the Store implementation. And support
 * for that has been merged into Core. The idea is that
 * action logic that does not define its own id is ok with
 * being overridden by logic of the same name and action type.
 * @name createIdFromName
 * @function
 * @param {Object|function(*, Object=)} logic - Any valid logic, either
 * object or functional.
 * @param {string} [extra = ""] - Optional extra string to attach
 * to the new id.
 * @returns {Object|FunctionalLogic} The provided logic with the
 * new logicId defined either on the logicDefaults prototype
 * key (if logic is FunctionalLogic), or on the logic object.
 */
export const createIdFromName = (logic, extra = '') => {
  const defaults = typeof logic === 'function' ? logic[DEFAULTS]
    : logic;
  if (!defaults) {
    throw new Error('No defaults provided for functional logic. ' +
      'Place defaults on the functional logic\'s prototype key "' +
      DEFAULTS + '". Logic: ' + logic);
  }
  const { [ACTION_TYPE]: actionType } = defaults;
  let suffix;
  if (typeof actionType === 'string') {
    suffix = actionType;
  } else if (Array.isArray(actionType)) {
    suffix = actionType.join('-');
  } else {
    suffix = uniqueId();
  }
  defaults[ID] = `${defaults[NAME]}__${suffix}${extra}`;
  return logic;
};

const cloneLogicFn = logicFn => function() {
  return logicFn.call(this, ...arguments);
}

/**
 * Converts a functional logic into a logic object
 * using the logicDefaults provided on the function prototype.
 * Options can be provided to override any keys on
 * the logicFn's prototype's logicDefaults key.
 * @name logicFactory
 * @function
 * @param {function(*, Object?)} logicFn - The functional logic
 * that is to be converted.
 * @param {Object=} [options = null] If provided,
 * the options will take precedent over the options on
 * the logicFn's prototype's logicDefaults key.
 * @param {boolean=} [asFunction = false] If true, the
 * newly created logic will be returned as functional
 * logic. This means that the resulting logic after
 * merging the provided options and the options that
 * exist on the logicFn's prototype will then be placed
 * on a new functional logic prototype's logicDefaults key.
 * @returns {FunctionalLogic|Object} Functional logic
 * if asFunction is true, otherwise the prepared
 * logic object.
 */
export const logicFactory = (logicFn, options, asFunction) => {
  const { [DEFAULTS]: defaults } = logicFn;
  if (options === true) {
    throw new Error('Providing asFunction in place of options is no longer supported.' +
      ' Pass null for options and then true for asFunction.');
    // asFunction = options;
    // options = undefined;
  }
  let logic;
  if (defaults) {
    logic = options && typeof options === 'object' ? { ...defaults, ...options }
      : { ...defaults };
  } else if (options) {
    logic = { ...options };
  } else {
    throw new Error('There are no default options on the functional logic, nor ' +
      'were options provided as the 2nd argument. One (or both) must be ' +
      'available to create the logic.');
  }
  const { op, opsAliases } = logic;
  if (asFunction) {
    const newDefaults = logic;
    newDefaults.op = op;
    logic = cloneLogicFn(logicFn);
    logic[DEFAULTS] = newDefaults;
  } else if (typeof op === 'string') {
    if (opsAliases) {
      logic[opsAliases[op]] = logicFn;
    } else {
      logic[op] = logicFn;
    }
  } else if (opsAliases) {
    for(let singleOp of op) {
      logic[opsAliases[singleOp]] = logicFn;
    }
  } else {
    for(let singleOp of op) {
      logic[singleOp] = logicFn;
    }
  }
  return logic;
};