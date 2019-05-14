
/**
 * @property {string} ID - {*} the key that is used to
 * define the id of the logic. An ID is not required
 * if a NAME is provided instead. In which case, the
 * ID will be generated from the NAME and ACTION_TYPE
 * if the logic is for an action, otherwise the NAME
 * and a uniqueId in the format.
 */
export const ID = 'logicId';

/**
 * @property {string} NAME - {string} the key that is used to define
 * the name of the logic. Not required if the ID is provided,
 * but a NAME makes it easier to add/remove the logic.
 */
export const NAME = 'logicName';

/**
 * @property {string} PRIORITY - {number} the key that is used to
 * define the priority of the logic. Defaults to 10.
 */
export const PRIORITY = 'logicPriority';

/**
 * @property {string} ACTION_TYPE - the key that is used to
 * define the action type(s) the logic
 * should apply to. Only applies Store
 * action logic.
 */
export const ACTION_TYPE = 'logicActionType';

/**
 * @property {string} ARGS - the key that is used
 * to define an {Array} of additional arguments that should
 * be passed to the logic when it is called.
 * Any additional arguments will follow
 * the value and Observer (unless the logic
 * is Pure Logic, in which case there will
 * be no Observer and additional arguments
 * will follow the value argument). Defaults to null.
 */
export const ARGS = 'logicArgs';

/**
 * @property {string} PURE_LOGIC - The key that is used to
 * define whether or not the logic is
 * Pure Logic. Defaults to false.
 * If the logic is designated as Pure Logic,
 * no Observer will be generated for the logic,
 * and the logic cannot be async. Defaults to false.
 */
export const PURE_LOGIC = 'pureLogic';

/**
 * @property {string} DEFAULTS - The key that is used to
 * define a single defaults object, which
 * should then contain all of the props
 * for the logic as defined with these
 * properties. For example, if the logic
 * is functional logic, a single function
 * can be provided with this key defined
 * on its prototype containing the props
 * for the logic when it is converted into
 * executable logic. This is useful so that
 * functional logic can be easily extended
 * (see logicFactory). The DEFAULTS prop will
 * be ignored if the logic already has the minimal
 * props defined when added to a stream. Defaults to null.
 */
export const DEFAULTS = 'logicDefaults';
/**
 * @property {string} INIT - The key that is used
 * to define an init function that should
 * be called before the first op. Defaults to null.
 */
export const INIT = 'logicInit';
/**
 * @property {string} INIT_ARGS - The key that is used
 * to define an array of additional arguments that should
 * be passed to the INIT function for the
 * logic. Only applies if the logic defines
 * an INIT function. Defaults to null.
 */
export const INIT_ARGS = 'logicInitArgs';
/**
 * @property {string} CALL_INIT - {boolean} The key that is used
 * to signify an INIT function is being
 * provided and should be called before
 * the first op. This is in case the
 * provided logic has a method already
 * defined at the INIT key, but is not
 * meant to be part of the logic. Defaults to false
 */
export const CALL_INIT = 'callLogicInit';
/**
 * @property {string} THIS_ARG - The key that is
 * used to provide a thisArg that will be used
 * when calling each op's function defined
 * on the logic. Defaults to the provided logic,
 * or if functional logic is provided, the object
 * representation of the functional logic will be used.
 */
export const THIS_ARG = 'logicThisArg';
/**
 * @property {string} DEBUG - Not fully integrated,
 * but it is the key that is used to provide a debug function
 * that will be called through the various
 * life cycles of the ops. Defaults to null.
 */
export const DEBUG = 'debugFn';

/**
 * The props for logic that can be provided with
 * each logic to alter its behavior. The props listed
 * are in addition to any ops the logic should hook
 * into.
 */
const LOGIC_PROPS = {
  NAME: NAME,
  PRIORITY: PRIORITY,
  ID: ID,
  ACTION_TYPE: ACTION_TYPE,
  ARGS: ARGS,
  PURE_LOGIC: PURE_LOGIC,
  DEFAULTS: DEFAULTS,
  INIT: INIT,
  INIT_ARGS: INIT_ARGS,
  CALL_INIT: CALL_INIT,
  THIS_ARG: THIS_ARG,
  DEBUG: DEBUG
};

export default LOGIC_PROPS;