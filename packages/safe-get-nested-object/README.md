# safe-get-nested-object


### get

##### source

```jsx
/**
 * safely access an object's deeply nested values
 * @param  {[String]} path the chain of keys we are trying to access
 * @param  {Object} object the object we want to retrieve the values from
 * @return {Object, Array, String} nested value
 */
const get = path => object =>
  path.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, object);
```

##### usage

```jsx
import get from '@mqschwanda/safe-get-nested-object';

const object = { nested: { msgs: ['it worked!'] } };
const getMsg = get(['nested', 'msgs', 0]);

console.log(getMsg(object)); // --> 'it worked!'
console.log(getMsg({})); // --> null
```
