# <img height=24 src=https://cdn.rawgit.com/JorgeBucaran/f53d2c00bafcf36e84ffd862f0dc2950/raw/882f20c970ff7d61aa04d44b92fc3530fa758bc0/Hyperapp.svg> Hyperapp Logger

[![Build Status](https://travis-ci.org/HyperappCommunity/hyperapp-logger.svg?branch=master)](https://travis-ci.org/HyperappCommunity/hyperapp-logger)
[![codecov](https://codecov.io/gh/HyperappCommunity/hyperapp-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/HyperappCommunity/hyperapp-logger)
[![npm](https://img.shields.io/npm/v/hyperapp-logger.svg)](https://www.npmjs.org/package/hyperapp-logger)

A [Hyperapp](https://github.com/hyperapp/hyperapp) higher-order `app` that logs state updates and action information to the console.

[Try it Online](https://codepen.io/okwolf/pen/xLQmvW?editors=0010)

![Screenshot](https://user-images.githubusercontent.com/3735164/34082934-657f864c-e31c-11e7-93d2-d70f190aa928.png)

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

### Browser

Download the minified library from the [CDN](https://unpkg.com/hyperapp-logger).

```html
<script src="https://unpkg.com/hyperapp-logger"></script>
```

You can find the library in `window.logger`.

## Usage

```js
logger(options)(app)(state, actions, view, document.body)
```

### Options

#### `options.log`

Use it to customize the log function.

```js
logger({
  log(prevState, action, nextState) {
    // format and send your log messages anywhere you like
  }
})(app)(state, actions, view, document.body)
```

## License

Hyperapp Logger is MIT licensed. See [LICENSE](LICENSE.md).
