
let scheduleBreak = true;
const handleLineBreak = () => {
  if (scheduleBreak) {
    scheduleBreak = false;
    setTimeout(() => {
      console.log(' ')
      scheduleBreak = true;
    }, 0);
  }
}
const logVerbose = (key, hook, obj, headerExtras) => {
  if (headerExtras) {
    console.log(key, ' --> ', hook, ' (' + headerExtras + ')');
  } else {
    console.log(key, ' --> ', hook)
  }
  for(let k in obj) {
    console.log('   ' + k + ':', obj[k]);
  }
  handleLineBreak();
};

const logMinimal = (key, hook, obj, headerExtras) => {
  if (headerExtras) {
    console.log(key, ' --> ', hook, '(' + headerExtras + ')');
  } else {
    console.log(key, ' --> ', hook);
  }
  handleLineBreak();
}

const log = (key, hook, obj, headerExtras) => {
  if (headerExtras) {
    console.log(key, ' --> ', hook, ' (' + headerExtras + ')', obj);
  } else {
    console.log(key, ' --> ', hook, obj);
  }
  handleLineBreak();
}

let _registerOpDependencyPrintId = 0;
export const registerOpDependency = (value, subscriber, hook, params, log) => {
  const [ opDependency, otherOpDependency, otherManager ] = params;
  let opPending, opCurrent, otherOpPending, otherOpCurrent;
  if (subscriber.isPendingOp) {
    opPending = subscriber.op;
    opCurrent = subscriber.prevOp;
  } else {
    opPending = false;
    opCurrent = subscriber.op;
  }
  if (otherManager.isPendingOp) {
    otherOpPending = otherManager.op;
    otherOpCurrent = otherManager.prevOp;
  } else {
    otherOpPending = false;
    otherOpCurrent = otherManager.op;
  }
  /**
   const { waitingFor, ready } = otherManager._sharedSync[otherOpDependency];
   const needs = [];
   for(let i = 0; i < waitingFor.length; i++) {
    if (ready.indexOf(waitingFor[i]) < 0) {
      needs.push(waitingFor[i]);
    }
  }
   **/
  const obj = {
    printId: ++_registerOpDependencyPrintId,
    opDependency,
    opPending,
    opCurrent,
    otherOpDependency,
    otherOpPending,
    otherOpCurrent,
  };
  /**
   opSync$.subscribe({
    complete: () => {
      obj.note = 'NOT CURRENT. Copy of the "WAITING" event only.';
      // const idx = waitingArr.indexOf(obj.printId);
      // waitingArr.splice(idx, 1);
      // waitingArrData.splice(idx, 1);
      log(subscriber.logic.logicName, hook, obj, 'READY-' + obj.printId);
      // console.log('still waiting: ', waitingArrData);
      // console.log(' ');
    }
  });
   **/
  // waitingArr.push(obj.printId);
  // waitingArrData.push(subscriber.logic.logicName + ' --> ' + hook);
  log(subscriber.logic.logicName, hook, obj, 'WAITING-' + obj.printId);
  // console.log('waiting: ', waitingArrData);
  // console.log(' ');
}

export const callLogic = (value, subscriber, _, __, log)  => {
  log(subscriber.logic.logicName, subscriber.op, {
    priority: subscriber.logic.logicPriority,
    value
  });
}

const _formatNextErrorComplete = (value, subscriber, hook, params) => {
  const [ async, cancelIfCompleteBeforeNext, queuedValue ] = params;
  let obj;
  if (async) {
    obj = {
      async: async ? true : false,
      cancelIfCompleteBeforeNext,
      queuedValue: queuedValue ? true : false,
      value
    };
  } else {
    obj = { async, value };
  }
  return obj;
}
export const next = (value, subscriber, hook, params, log) => {
  const obj = _formatNextErrorComplete(value, subscriber, hook, params);
  const headerExtras = obj.async ? 'NEXT-ASYNC' : 'NEXT';
  log(
    subscriber.logic.logicName, subscriber.op,
    obj,
    headerExtras
  );
}

export const error = (value, subscriber, hook, params, log) => {
  const obj = _formatNextErrorComplete(value, subscriber, hook, params);
  const { value: error } = obj;
  obj.value = subscriber.innerValue;
  obj.error = error;
  log(
    subscriber.logic.logicName, subscriber.op,
    _formatNextErrorComplete(value, subscriber, hook, params),
    'ERROR'
  );
}

export const complete = (value, subscriber, hook, params, log) =>
  unsubscribe(value, subscriber, hook, params, log);

export const unsubscribe = (value, subscriber, _, __, log) => {
  log(subscriber.logic.logicName, 'complete', {
    isError: subscriber.isErrorOp(),
    isCancel: subscriber.isCancelOp(),
    value
  });
}

export const cancel = (value, subscriber, hook, params, log) => {
  log(
    subscriber.logic.logicName, subscriber.op,
    _formatNextErrorComplete(value, subscriber, hook, params, log),
    'CANCEL'
  );
}

export const setOp = (value, subscriber, hook, params, log) => {
  log(
    subscriber.logic.logicName, hook,
    { newOp: params[0], newValue: value }
  );
}

export const addLogic = (value, subscriber, hook, params, log) => {
  log(
    subscriber.logic.logicName, hook,
    { toAdd: params[0] }
  );
}

export const removeLogic = (value, subscriber, hook, params, log) => {
  log(
    subscriber.logic.logicName, hook,
    { toRemove: params[0] }
  );
}


export const hookMap = {
  registerOpDependency,
  callLogic,
  next,
  error,
  complete,
  unsubscribe,
  cancel,
  setOp,
  addLogic,
  removeLogic,
};


export const logToConsole = (...hooks) => {
  if (hooks.length === 1 && hooks[0] === true) {
    return debugPrint(log, 'next', 'error', 'unsubscribe', 'cancel');
  } else {
    return debugPrint(log, hooks);
  }
}

export const logToConsoleVerbose = (...hooks) => {
  if (hooks.length === 1 && hooks[0] === true) {
    return debugPrint(logVerbose, 'next', 'error', 'unsubscribe', 'cancel');
  } else {
    return debugPrint(logVerbose, hooks);
  }
}

export const logToConsoleMinimal = (...hooks) => {
  if (hooks.length === 1 && hooks[0] === true) {
    return debugPrint(logMinimal, 'next', 'error', 'unsubscribe', 'cancel');
  } else {
    return debugPrint(logMinimal, hooks);
  }

}

const debugPrint = (log, hooks) => {
  let except = false, all = false;
  if (hooks[hooks.length - 1] === true) {
    except = hooks.pop();
  }
  if (hooks.length === 0) {
    all = true;
  }
  return (value, subscriber, hook, ...params) => {
    if (
      all
      || (except && hooks.indexOf(hook) < 0)
      || (!except && hooks.indexOf(hook) > -1)
    ) {
      const { logic } = subscriber;
      if (except && logic.logicPriority < 0) return;
      if (hookMap[hook]) {
        hookMap[hook](value, subscriber, hook, params, log);
      } else {
        console.warn('unknown hook: ', hook);
      }
    }
  }
}

export function debugPrintNonPending(...params) {
  const fn = debugPrint(...params);
  return (value, subscriber) => {
    if (subscriber.logic.logicPriority >= 0) {
      fn(value, subscriber);
    }
  }
}

export function debugPrintPending(...params) {
  const fn = debugPrint(...params);
  return (value, subscriber) => {
    if (subscriber.logic.logicPriority < 0) {
      fn(value, subscriber);
    }
  }
}