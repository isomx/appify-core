import { PRIORITY } from "../../constants/logicProps";

const prioritySorter = (a, b) => a[PRIORITY] - b[PRIORITY];

/**
 * Sorts an array of logic, ordering the array by priority.
 * Supports negative numbers, which will be treated as higher priority
 * (meaning it will run first). So logic with a priority of -4 will run
 * before logic with a priority of 1. And logic with a priority of 10 will
 * run before a logic with a priority of 15.
 *
 * The provided logicArray will be sorted in place, so the array
 * will be mutated.
 *
 * @param {!Array.<Object>} logicArr - The array of logic to sort
 * @returns {!Array.<Object>} The resulting sorted logic array.
 */
function sortLogic(logicArr){
  return logicArr.sort(prioritySorter);
}

export default sortLogic;