import uniqueId from '../../utils/uniqueId';
import { DEFAULTS, NAME, ID, ACTION_TYPE } from "../../constants/logicProps";

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
 * @name logicIdFromName
 * @function
 * @param {Object|function(*, Object=)} logic - Any valid logic, either
 * object or functional.
 * @param {string} [extra = ""] - Optional extra string to attach
 * to the new id.
 * @returns {Object|FunctionalLogic} The provided logic with the
 * new logicId defined either on the logicDefaults prototype
 * key (if logic is FunctionalLogic), or on the logic object.
 */
function logicIdFromName(logic, extra = ''){
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
export default logicIdFromName;