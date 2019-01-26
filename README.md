# state-machine

## usage
```js
import { machine, utils } from '@leofcoin/state-machine';

machine.set('hello', 'world')
machine.get('hello'); // world
machine.remove('hello');


const globalArr = utils.array('hello', ['world']);
globalArr.set(1, 'world2');
globalArr.get(0); // world
globalArr.get(1); // world2
globalArr.remove(0); ['world2']
globalArr.remove('world2'); []

const globalObject = utils.array('hello', {'world': true});
globalObject.get('world'); // true
globalObject.set('world', false);
globalObject.get(0); // false
globalObject.remove('world'); {}
```
