/**
 * @property {string} NEXT - The name of the
 * op that will trigger an emission on the stream
 * once all logic for this op has run. It is
 * not required if the logic stream should never
 * emit a value to a subscriber.
 */
export const NEXT = 'next';

/**
 * @property {string} COMPLETE - The name of
 * the op that all logic streams must implement.
 * It can be aliased. Once all logic for this
 * op has run, the stream will trigger its
 * complete routine, cleaning up outstanding
 * resources, etc, as well as emit a
 * COMPLETE notification to any subscriber(s).
 */
export const COMPLETE = 'complete';


/**
 * @property {string} CANCEL - The name of
 * the op that logic can hook into to be
 * notified if the ops cycle is to be cancelled.
 * It may be aliased to another name, or it
 * can be omitted entirely.
 */
export const CANCEL = 'cancel';

/**
 * @property {string} ERROR - The name of
 * the op that logic can hook into to be
 * notified if the stream is going to emit
 * an error. It may be aliased. If there
 * is no logic registered for an ERROR op, the error
 * will be emitted on the stream as an error
 * to any subscribers. Otherwise, logic can
 * capture the error and continue the stream.
 */
export const ERROR = 'error';

/**
 * Represents the default ops for a logic stream.
 * Custom ops can be added, but these ops represent
 * special meaning for the withLogic operator. Other
 * than CANCEL, these ops correlate to the same hooks
 * as an RxJs subscriber.
 * @type {{NEXT: string, ERROR: string, COMPLETE: string, CANCEL: string }}
 */
const LOGIC_OPS = {
  NEXT: NEXT,
  ERROR: ERROR,
  COMPLETE: COMPLETE,
  CANCEL: CANCEL
};

export default LOGIC_OPS;