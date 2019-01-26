import globals from './machine.js';
import PubSub from './node_modules/little-pubsub/src/index.js';
const pubsub = new PubSub();

const events = ['change', 'set', 'remove']

const validEvent = (name, aditional = []) => {
  const arr = [...events, ...aditional]
  if (arr.indexOf(name) === -1) return false;
  return true;
}

const publishEvent = (root, path, value, type) => {
  pubsub.publish(`${root}.change`, {  path, value, type });
  pubsub.publish(`${root}.${type}`, {  path, value });
}

const array = (root = 'globalArray', initial = []) => {
  if (globals.get(root) === undefined) globals.set(root, initial);
  const get = name => {
    if (name === undefined) return globals.get(root);
    const arr = globals.get(root);
    return arr[name];
  }
  /**
   * {string} name -
   * {string|boolean|number|array|object|map} val - when not defined name will be threated as value and pushed (like normal array)
   */
  const set = (name, value) => {
    const arr = globals.get(root);
    if (value) arr[name] = value;
    else if (arr.indexOf(name) === -1) arr.push(name);
    globals.set(root, arr);
    publishEvent(root, value ? name : arr.indexOf(value), value, 'set');
  }
  const remove = val => {
    const arr = globals.get(root);
    if (typeof val === 'string') val = arr.indexOf(val);
    const value = arr.slice(val, 1);

    globals.set(root, arr);
    publishEvent(root, val, undefined, 'remove');
  }
  return {
    get,
    set,
    remove,
    on: (name, cb) => {
      if (!validEvent(name)) throw Error(`invalid event, expected: change add or remove instead got ${name}`);
      pubsub.subscribe(`${root}.${name}`, cb)
    },
    reduce: cb => {
      console.log([globals.get(root)]);
      return globals.get(root).reduce(cb)
    }
  }
}

const object = (root = 'globalObject', initial = {}) => {
  if (globals.get(root) === undefined) globals.set(root, initial);
  const get = name => {
    if (name === undefined) return globals.get(root);
    const o = globals.get(root);
    return o[name];
  }
  const set = (name, value) => {
    const o = globals.get(root);
    o[name] = value;

    globals.set(root, o);
    publishEvent(root, name, value, 'set');
  }
  const remove = name => {
    const o = globals.get(root);
    delete o[name];

    globals.set(root, o);
    publishEvent(root, name, undefined, 'remove')
  }
  return {
    get,
    set,
    remove,
    on: (name, cb) => {
      if (!validEvent(name)) throw Error(`invalid event, expected: change add or remove instead got ${name}`);
      pubsub.subscribe(`${root}.${name}`, cb)
    }
  }
}

const boolean = (root = 'globalBoolean', initial = false) => {
  if (globals.get(root) === undefined) globals.set(root, initial);
  return {
    get: () => globals.get(root),
    set: val => {
      globals.set(root, val)
      publishEvent(root, root, val, 'set')
    },
    remove: () => {
      globals.delete(root);
      publishEvent(root, root, undefined, 'remove');
    },
    on: (name, cb) => {
      if (!validEvent(name)) throw Error(`invalid event, expected: change add or remove instead got ${name}`);
      pubsub.subscribe(`${root}.${name}`, cb)
    }
  }
}

const string = (root = 'globalString', initial = null) => {
  if (globals.get(root) === undefined) globals.set(root, initial);
  return {
    get: () => globals.get(root),
    set: val => {
      globals.set(root, val);
      publishEvent(root, root, val, 'set');
    },
    remove: () => {
      globals.delete(root);
      publishEvent(root, root, val, 'remove')
    },
    on: (name, cb) => {
      if (!validEvent(name)) throw Error(`invalid event, expected: change add or remove instead got ${name}`);
      pubsub.subscribe(`${root}.${name}`, cb);
    }
  }
}

const number = (root = 'globalNumber', initial = 0) => {
  if (globals.get(root) === undefined) globals.set(root, initial);
  const set = val => {
    globals.set(root, val);
    publishEvent(root, root, val, 'set');
  }
  return {
    get: () => globals.get(root),
    set,
    remove: () => {
      globals.delete(root);
      publishEvent(root, root, val, 'remove')
    },
    increase: (num = 1) => set(globals.get(root) + num),
    decrease: (num = 1) => set(globals.get(root) - num),
    on: (name, cb) => {
      if (!validEvent(name, ['increase', 'decrease'])) throw Error(`invalid event, expected: change add or remove instead got ${name}`);
      pubsub.subscribe(`${root}.${name}`, cb)
    }
  }
}

export {
  array,
  object,
  boolean,
  string,
  number
}
