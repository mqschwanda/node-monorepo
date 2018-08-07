/**
 * handle situations in which a function may need to be called with props to get
 * data but at the same time allow a raw data object to be returned directly
 * @param  {[type]} dataOrFunction   [description]
 * @param  {[type]} [params = null]  [description]
 * @return {[type]}                  [description]
 */
export const getDataOrCallFunction = (dataOrFunction, params = null) =>
  typeof dataOrFunction === 'function'
    ? dataOrFunction(params) // call function with props
    : dataOrFunction; // object, array, string... whatever

 export const getDisplayName = (containerName, Component) =>
   `${containerName}(${Component.displayName || Component.name || 'Component'})`;
