# <img height=24 src=https://cdn.rawgit.com/JorgeBucaran/f53d2c00bafcf36e84ffd862f0dc2950/raw/882f20c970ff7d61aa04d44b92fc3530fa758bc0/Hyperapp.svg> Hyperapp Logger

[![Travis CI](https://img.shields.io/travis/hyperapp/logger/master.svg)](https://travis-ci.org/hyperapp/logger)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/logger/master.svg)](https://codecov.io/gh/hyperapp/logger)
[![npm](https://img.shields.io/npm/v/@hyperapp/logger.svg)](https://www.npmjs.org/package/@hyperapp/logger)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

A [Hyperapp](https://github.com/hyperapp/hyperapp) higher-order `app` that logs state updates and action information to the console.

[Try it Online](https://codepen.io/okwolf/pen/xLQmvW?editors=0010)

![Screenshot](https://user-images.githubusercontent.com/3735164/34082934-657f864c-e31c-11e7-93d2-d70f190aa928.png)

## Installation

### Node.js

Install with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/@hyperapp/logger">@hyperapp/logger</a>
</pre>

Then with a module bundler like [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack) use as you would anything else.

```js
import { withLogger } from "@hyperapp/logger"
```

### Browser

Download the minified library from the [CDN](https://unpkg.com/@hyperapp/logger).

```html
<script src="https://unpkg.com/@hyperapp/logger"></script>
```

You can find the library in `window.hyperappLogger`.

```js
const { withLogger } = hyperappLogger
```

## Usage

```js
withLogger(options)(app)(state, actions, view, document.body)
```

### Options

#### `options.log`

Use it to customize the log function.

```js
withLogger({
  log(prevState, action, nextState) {
    // format and send your log messages anywhere you like
  }
})(app)(state, actions, view, document.body)
```

## License

Hyperapp Logger is MIT licensed. See [LICENSE](LICENSE.md).
