
/**
 * safely access an object's deeply nested values
 * @param  {[String]} path the chain of keys we are trying to access
 * @param  {Object} object the object we want to retrieve the values from
 * @return {Object, Array, String} nested value
 */
export const get = path => object =>
  path.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, object);

export default get;
