# @hyperapp/logger

[![Travis CI](https://img.shields.io/travis/hyperapp/logger/master.svg)](https://travis-ci.org/hyperapp/logger)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/logger/master.svg)](https://codecov.io/gh/hyperapp/logger)
[![npm](https://img.shields.io/npm/v/@hyperapp/logger.svg)](https://www.npmjs.org/package/@hyperapp/logger)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

A [Hyperapp](https://github.com/hyperapp/hyperapp) [mixin](https://github.com/hyperapp/hyperapp/blob/master/docs/mixins.md) that logs state updates and action information to the console. 

[Try it Online](https://codepen.io/okwolf/pen/xLQmvW?editors=0010)

![Screenshot](https://user-images.githubusercontent.com/3735164/29865010-37eaf08e-8d29-11e7-9929-7a097b3a99a8.png)

## Installation

### Node.js

Install with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/@hyperapp/logger">@hyperapp/logger</a>
</pre>

Then with a module bundler like [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack) use as you would anything else.

```jsx
import logger from "@hyperapp/logger"
```

Or using require.

```js
const logger = require("@hyperapp/logger")
```

### Browser

Download the minified library from the [CDN](https://unpkg.com/@hyperapp/logger).

```html
<script src="https://unpkg.com/@hyperapp/logger"></script>
```

You can find the library in `window.logger`.

## Usage

```js
app({
  // ...
  mixins: [logger()]
})
```

### Options

#### `options.log`

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

@hyperapp/logger is MIT licensed. See [LICENSE](LICENSE.md).
