if (!global.globals) global.globals = new Map();
const globals = global.globals;

const set = (name, val) => {
  globals.set(name, val);
}

const get = name => {
  return globals.get(name);
}

const remove = name => {
  globals.delete(name);
}

const increase = name => {
  const val = globals.get(name);
  globals.set(name, val++);
}

const decrease = name => {
  const val = globals.get(name);
  globals.set(name, val--);
}

export default {
  set,
  get,
  remove,
  increase,
  decrease
}
