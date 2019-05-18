import { COMPLETE } from '../../constants/logicOps';
/**
 * Parses the ops provided to a withLogic operator and builds
 * the opsIdxMap, and optionally opsAliases & opsCounters.
 * @param {!Array<string>} ops - The array of ops that are valid
 * for the logic operator
 * @param {!Object<string, number>} opsIdxMap - For each provided op,
 * a key will be added to the opsIdxMap with the value being the
 * idx of that op in the ops array
 * @param {!Object=<string, number>} [opsCounters] - If provided, it must be an
 * object that will then be populated with the ops as keys, and 0 as
 * the initial value to aid in determining how many ops are still open
 * on the stream. Mainly useful when combined with State so that a mainInstance
 * can determine when all actions are complete for a PendingInstance.
 * @returns {Object<string, string>|undefined} opsAliases - If an object
 * is provided in the arguments to a withLogic() operator to alias a set
 * of ops, the opsAliases object will be populated with the aliased op
 * as the key, and the op relevant to the logic as the value. For example,
 * COMPLETE is a required op for every logic stream. But if the default
 * COMPLETE op name is not desired, an object can be provided mapping the
 * default COMPLETE op to the desired op. Ex: { [COMPLETE]: MY_COMPLETE_OP }.
 */
function parseLogicOps(ops, opsIdxMap, opsCounters) {
  let opsLength = ops.length, op = ops[opsLength - 1],
    opsAliases;
  if (typeof op === 'object') {
    opsAliases = ops.pop();
    opsLength--;
    op = ops[opsLength - 1];
  }
  if (op !== COMPLETE && (!opsAliases || (opsAliases && opsAliases[op] !== COMPLETE))) {
    ops.push(COMPLETE);
    opsLength++;
  }
  if (opsAliases) {
    /**
     * This is necessary so when cancel() is called it can
     * call the correct op on the logic, then convert it back
     * to the op the withLogic next() function is listening for
     */
    for(let opName in opsAliases) {
      opsAliases[opsAliases[opName]] = opName;
    }
  }
  if (opsCounters) {
    for(let i = 0; i < opsLength; i++) {
      op = ops[i];
      opsIdxMap[op] = i;
      opsCounters[op] = 0;
      if (opsAliases && !opsAliases[op]) opsAliases[op] = false;
    }
  } else {
    for(let i = 0; i < opsLength; i++) {
      op = ops[i];
      opsIdxMap[op] = i;
      if (opsAliases && !opsAliases[op]) opsAliases[op] = false;
    }
  }
  return opsAliases;
}

export default parseLogicOps;