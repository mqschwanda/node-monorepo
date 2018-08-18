# curry

```jsx
/**
 * @name curry
 * @type {Function}
 * @description recursive autocurry
 * @since 0.0.1
 * @example curry(function, arg1, arg2)(arg3)(arg4, arg5)
 */
 export const curry = (func, array = []) => (...args) => (arr) => (
   arr.length === func.length
     ? func(...arr)
     : curry(func, arr)
 )([...array, ...args]);

 // export const handleCurry = (curry, func, array) =>
 //   array.length === func.length
 //     ? func(...array)
 //     : curry(func, array);
 //
 // export const spreader = (curry, func, array) =>
 //   (...args) => handleCurry(curry, func, [...array, ...args]);
 //
 // export const curry = (func, array = []) => spreader(curry, func, array);

 export default curry;
```
