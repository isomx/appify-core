import { scheduled, asapScheduler, Subscriber, Observable } from 'rxjs';
import {
  NAME, ID, ARGS, ACTION_TYPE, PRIORITY, DEFAULTS, THIS_ARG
} from '../constants/logicProps';

const nextTick$ = scheduled([], asapScheduler);
const byTime = (time) => new Observable(observer => {
  setTimeout(() => observer.complete(), time);
});

class BatchSubscriber extends Subscriber {
  constructor(op, opState, nxtLogic, thisArg) {
    super();
    this.op = op;
    this.opState = opState;
    this.nxtLogic = nxtLogic;
    this.thisArg = thisArg;
  }

  _complete() {
    const { op, opState, nxtLogic, thisArg } = this;
    const { actions, observers } = opState;
    opState.actions = undefined;
    opState.observers = undefined;
    const logic = typeof nxtLogic === 'function' ? nxtLogic : nxtLogic[op];
    if (nxtLogic[ARGS]) {
      logic.call(thisArg, actions, observers, ...nxtLogic[ARGS]);
    } else {
      logic.call(thisArg, actions, observers);
    }
    this.unsubscribe();
  }
}


function batchPassThrough(action, observer, logic, thisArg) {
  const op = observer.op;
  return logic[ARGS] ? logic[op].call(thisArg, action, observer, ...logic[ARGS])
    : logic[op].call(thisArg, action, observer);
}

function batchFn(action, observer, callLogic, thisArg, stateKey, batch$) {
  const op = observer.op;
  let stateObj = observer.getLogicState(true), state, opState;
  if (!stateObj) {
    opState = {
      actions: [ action ],
      observers: [ observer ]
    };
    stateObj = {
      [stateKey]: {
        [op]: opState
      }
    };
    // console.log('NO stateObj = ', stateObj);
    observer.setLogicState(stateObj, true);
  } else {
    ({ [stateKey]: state } = stateObj);
    if (!state) {
      opState = {
        actions: [ action ],
        observers: [ observer ]
      };
      stateObj[stateKey] = {
        [op]: opState
      };
      // console.log('not StateKey!');
    } else {
      ({ [op]: opState } = state);
      if (!opState) {
        opState = {
          actions: [ action ],
          observers: [ observer ]
        };
        state[op] = opState;
        // console.log('no opState');
      } else {
        const { actions, observers } = opState;
        if (actions) {
          actions.push(action);
          observers.push(observer);
          // console.log('adding to state for op ' + op);
          return;
        }
        opState.actions = [ action ];
        opState.observers = [ observer ];
      }
    }
  }
  batch$.subscribe(new BatchSubscriber(op, opState, callLogic, thisArg));
}

/**
 * Higher-order logic that collects inputs on the stream
 * and once the provided time has passed (or the next process
 * tick if no time is provided), the higher-order logic
 * will call the provided logic with 2 arrays: values & observers.
 * Each value's corresponding observer will be at the same
 * index in the observers array. Any additional arguments that
 * the provided logic defines will be preserved and included as
 * arguments following the observers array.
 * @param {Object|function(*, Object=)} logic - Any valid logic.
 * @param {Array<string>} ops - An array of ops that the higher-order
 * logic should support.
 * @param {number} [time = 0] - The time in milliseconds that the
 * batch should be open before calling the provided logic with
 * an array of collected actions and observers. Defaults to 0
 * for next process tick.
 * @param {Array<string>=} [batchOps] - If provided, only these ops
 * will be batched. Other ops will pass through to the
 * provided logic without being batched.
 * @param {string=} [stateKey = batchState] - The key in the
 * logic's global state to keep track of batches. Defaults
 * to batchState, but if your logic uses that key for another
 * reason, a custom key can be provided and this higher-order
 * logic will use that key instead to store it's global state.
 * @returns {Object} The resulting higher-order logic
 */
const batch = (logic, ops, time, batchOps, stateKey) => {
  if (!stateKey) {
    stateKey = 'batchState';
  }
  // if time === 0, we treat that as nextTick.
  const batch$ = time ? byTime(time) : nextTick$;
  if (!batchOps) {
    batchOps = ops;
  }
  const thisArg = logic[THIS_ARG] || logic;
  const args = [
    logic,
    thisArg,
    stateKey,
    batch$
  ];
  const defaults = !logic[ID] && !logic[NAME] && logic[DEFAULTS] ?
    logic[DEFAULTS] : logic;
  const newLogic = {
    [ID]: defaults[ID],
    [NAME]: defaults[NAME],
    [PRIORITY]: defaults[PRIORITY],
    [ARGS]: args,
    [ACTION_TYPE]: defaults[ACTION_TYPE]
  };
  for(let op of ops) {
    if (batchOps.indexOf(op) < 0) {
      newLogic[op] = batchPassThrough;
    } else {
      newLogic[op] = batchFn;
    }
  }
  return newLogic;
};

export default batch;