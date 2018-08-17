# compose

`compose(...functions)`

Composes functions from right to left.

This is a functional programming utility, and is included in Redux as a convenience.  
You might want to use it to apply several functions in a row.

#### Arguments

1. (*arguments*): The functions to compose. Each function is expected to accept a single parameter. Its return value will be provided as an argument to the function standing to the left, and so on. The exception is the right-most argument which can accept multiple parameters, as it will provide the signature for the resulting composed function.

#### Returns

(*Function*): The final function obtained by composing the given functions from right to left.

#### Example

This example demonstrates how to use `compose` to enhance a [store](Store.md) with [`applyMiddleware`](applyMiddleware.md) and a few developer tools from the [redux-devtools](https://github.com/reduxjs/redux-devtools) package.

```js
import compose from '@mqschwanda/compose';
import { connect } from 'redux'; // redux connect container
import passthrough from 'react-passthrough'; // react passthrough container

const container = compose(
  connect((store) => ({ store })),
  passthrough({ omit: ['dispatch'] }),
);
```

#### Tips

* All `compose` does is let you write deeply nested function transformations without the rightward drift of the code. Don't give it too much credit!