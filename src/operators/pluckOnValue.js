import get from '@bit/lodash.lodash.get';
import { Subscriber } from 'rxjs';
import { getOperatorFn } from "../utils/matching";

const pluckAll = (object) => object;

const pluckFn = (object, fn) => fn(object);

const getPlucker = path => {
  if (path) {
    if (typeof path === 'function') {
      return pluckFn;
    } else {
      return get;
    }
  } else {
    return pluckAll;
  }
}

/**
 * Operator that only emits a value if the provided testValue matches
 * the value pulled from the upstream value. This operator acts
 * like rxjs's filter() method until the comparison of the testValue
 * returns true, at which point it acts like rxjs's pluck() operator.
 * In addition to plucking a result from the upstream value when the
 * testValue comparison returns true, it can also pluck a value from
 * the upstream value to compare the testValue against.
 * @name pluckOnValue
 * @function
 * @param {(Array.<*>|?string|function(?, ?): ?)} pluckPath - The path
 * to the value that should be emitted from the upstream value if
 * the comparison of the testValue and the value plucked from the
 * upstream value returns true. The pluckPath can be null if the full
 * upstream value should be emitted on success, or it can be a
 * custom function which will be called with the upstream value
 * to get the value that should be emitted, or it can be any
 * string or array that follows lodash's get(object, path) path syntax.
 * @param {?=} testValue - The value to test
 * @param {(Array.<*>|?string|function(?, ?): ?)} [testValuePath = null] -
 * Same as pluckPath, but for "plucking" the value from the upstream
 * value that should be compared against the testValue.
 * @param {?string=} [operator = "="] - Use to override the default
 * "=" operator. It can be any valid operator as defined in the
 * utils/matching module.
 * @returns {function(*): (Observable<any> | WebSocketSubject<any>)}
 * @example
 * const sourceValue = {
 *  type: "GET_STATE",
 *  payload: {
 *    someKey: "someValue"
 *  }
 * }
 *
 * const source$ = of(sourceValue);
 *
 * const stream$ = source$.pipe(
 *    pluckOnValue([ 'payload', 'someKey' ], "GET_STATE", "type")
 * )
 *  .subscribe(result => {
 *    // result === "someValue"
 *  })
 *
 * const stream2$ = source$.pipe(
 *    pluckOnValue(null, "someValue", [ 'payload', 'someKey' ], "!=")
 * )
 *  .subscribe()
 *  // would not emit a "next" value, only "complete" because
 *  // sourceValue.payload.someKey === "someValue".
 *  // If the operator argument was omitted, or was "=", it would emit
 *  // the full sourceValue since resultPath === null.
 *
 */
function pluckOnValue(pluckPath, testValue, testValuePath, operator = "=") {
  const resultPlucker = getPlucker(pluckPath);
  const valuePlucker = getPlucker(testValuePath);
  const compareFn = getOperatorFn(operator);
  return source => source.lift(new PluckOnValueOperator(
    resultPlucker, pluckPath, valuePlucker, testValuePath, testValue, compareFn
  ));
}

class PluckOnValueOperator {
  constructor(resultPlucker, resultPath, valuePlucker, valuePath, testValue, compareFn) {
    this.resultPlucker = resultPlucker;
    this.resultPath = resultPath;
    this.valuePlucker = valuePlucker;
    this.valuePath = valuePath;
    this.testValue = testValue;
    this.compareFn = compareFn;
  }

  call(observer, source) {
    return source.subscribe(new PluckOnValueSubscriber(
      this.resultPlucker, this.resultPath, this.valuePlucker,
      this.valuePath, this.testValue, this.compareFn
    ));
  }
}

class PluckOnValueSubscriber extends Subscriber {
  constructor(
    destination, resultPlucker, resultPath,
    valuePlucker, valuePath, testValue, compareFn
  ) {
    super(destination);
    this.resultPlucker = resultPlucker;
    this.resultPath = resultPath;
    this.valuePlucker = valuePlucker;
    this.valuePath = valuePath;
    this.testValue = testValue;
    this.compareFn = compareFn;
  }

  _next(input) {
    if (this.compareFn(this.valuePlucker(input, this.valuePath), this.testValue)) {
      this.destination.next(this.resultPlucker(input, this.resultPath));
    }
  }
}

export default pluckOnValue;