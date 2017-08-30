# hyperapp-logger

[![Travis CI](https://img.shields.io/travis/hyperapp/logger/master.svg)](https://travis-ci.org/hyperapp/logger)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/logger/master.svg)](https://codecov.io/gh/hyperapp/logger)
[![npm](https://img.shields.io/npm/v/hyperapp.svg)](https://www.npmjs.org/package/hyperapp)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

A [Hyperapp](https://github.com/hyperapp/hyperapp) [mixin](https://github.com/hyperapp/hyperapp/blob/master/docs/mixins.md) that logs state updates and action information to the console. Heavily inspired by [redux-logger](https://github.com/evgenyrodionov/redux-logger).

![Screenshot](https://user-images.githubusercontent.com/56996/29755259-639e60d0-8bd0-11e7-9ff9-1a5216d47cfe.png)

## Installation

### Node.js

Install with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp-logger">hyperapp-logger</a>
</pre>

Then with a module bundler like [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack) use as you would anything else.

```jsx
import logger from "hyperapp-logger"
```

Or without ES6 modules.

```js
const logger = require("hyperapp-logger")
```

### Browser

Download the minified library from the [CDN](https://unpkg.com/hyperapp-logger).

```html
<script src="https://unpkg.com/hyperapp-logger"></script>
```

You can find the library in `window.logger`.

[Here](https://codepen.io/anon/pen/prOmqx?editors=0010) is an example of adding the logger to the ubiquitous counter Hyperapp example.

## Usage

```js
app({
  // ...
  mixins: [logger()]
})
```

## Options

### `options.log`

Use it to customize the log function.

```js
mixins: [
  logger({
    log(prevState, action, nextState) {
      // format and send your log messages anywhere you like
    }
  })
]
```

## License

hyperapp-logger is MIT licensed. See [LICENSE](LICENSE.md).
