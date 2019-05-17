import { DEFAULTS } from "../../constants/logicProps";



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
function logicFactory(logicFn, options, asFunction) {
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
}

export default logicFactory;