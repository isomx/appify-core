class ObjectIterator {
  constructor(source) {
    this.source = source;
    this.keys = Object.keys(source);
    this.length = this.keys.length;
    this.idx = 0;
  }

  next() {
    if (this.idx < this.length) {
      this.done = false;
      this.value = this.source[this.keys[this.idx]];
      this.idx++;
    } else {
      this.idx = 0;
      this.value = undefined;
      this.done = true;
    }
    return this;
  }

  return() {
    this.idx = 0;
    this.done = true;
    this.value = undefined;
    return this;
  }
}

function objectWithIteratorSetter(obj, prop, value) {
  if (obj.__iterator && !obj.hasOwnProperty(prop)) {
    obj.__iterator.keys.push(prop);
    obj.__iterator.length++;
  }
  obj[prop] = value;
  return true;
}

const objectWithIteratorProxy = {
  set: objectWithIteratorSetter
};

class ObjectWithIterator {
  constructor(source, inOrder) {
    if (source) {
      if (source === true) {
        this[Symbol.iterator]();
      } else {
        if (inOrder) {
          this[Symbol.iterator]();
          const { __iterator: iterator } = this;
          const { keys } = iterator;
          for(let k in source) {
            keys.push(k);
            iterator.length++;
            this[k] = source[k];
          }
        } else {
          for(let k in source) {
            this[k] = source[k];
          }
        }

      }
    }
  }

  [Symbol.iterator]() {
    if (!this.__iterator) {
      Object.defineProperty(this, '__iterator', {
        enumerable: false,
        writable: true,
        configurable: true,
        value: new ObjectIterator(this)
      });
    }
    return this.__iterator;
  }
}


/**
 * Creates an object that also implements Symbol.iterator
 * so the object can be iterated like an Array. The iterator
 * is only created if the Object is iterated via a for-of loop.
 * Otherwise, the Object acts like a plain Object.
 * It can also keep track of the order in which keys are defined
 * on the Object. This is useful for Store implementations,
 * such as CREATE, where the data may need to be stored by
 * its primary key, but the order of the data needs to be
 * maintained.
 *
 * Unless param inOrder = true, there isn't a difference
 * between this and using a plain Object with Object.keys().
 * In fact, that's all this does under the hood when
 * Symbol.iterator() is invoked on the Object.
 * The benefit is that functions that have to deal with either
 * an Array or an Object can avoid having to differentiate
 * between the two, and can just loop over both like an Array.
 * And it also memoizes the keys so that a new Array does not
 * get created on every iteration as it would if using a
 * plain Object and Object.keys().
 * Again, this is mainly used in Store implementations when
 * dealing with CREATE events.
 *
 * @function objectWithIterator
 * @param {?Object=} obj - If provided, the ObjectWithIterator
 * will be populated with the provided object's key:value pairs
 * @param {?boolean=} [inOrder = false] - If true, the iterator
 * will be created immediately, and all new keys will be added
 * to the iterator in the order they are defined on the Object
 * @returns {ObjectWithIterator}
 * @example
 * const iterableObject = objectWithIterator();
 * iterableObject.key = 'value';
 * iterableObject.key2 = 'value2';
 * for(let value of iterableObject) {
 *   console.log(value);
 * }
 * // "value"
 * // "value2"
 *
 * // accessing key:value pairs remains the same as any Object
 * console.log(iterableObject.key2 === 'value2')
 * // true
 *
 * // iterating as an Object works the same as any Object.
 * for(let key in iterableObject) {
 *
 * }
 *
 * // accessing the array of keys
 * const { keys } = iterableObject[Symbol.iterator]();
 */
function objectWithIterator(obj, inOrder){
  return new Proxy(new ObjectWithIterator(obj, inOrder), objectWithIteratorProxy);
}

/**
 * Utility to determine if a provided value is either an
 * Array or an instance of ObjectWithIterator. Use when
 * your function can accept either
 * @function isIterable
 * @param {?=} value - Any value
 * @returns {boolean} - true if it is safe to use
 * for-of loop, false if not.
 */
export function isIterable(value) {
  if (value && (Array.isArray(value) || value instanceof ObjectWithIterator)) {
    return true;
  } else {
    return false;
  }
}

export default objectWithIterator;