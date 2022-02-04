# Hyperapp Logger

[![Build Status](https://github.com/okwolf/hyperapp-logger/actions/workflows/ci.yml/badge.svg)](https://github.com/okwolf/hyperapp-logger/actions)
[![Codecov](https://img.shields.io/codecov/c/github/okwolf/hyperapp-logger/master.svg)](https://codecov.io/gh/okwolf/hyperapp-logger)
[![npm](https://img.shields.io/npm/v/hyperapp-logger.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/hyperapp-logger)

A [Hyperapp](https://github.com/hyperapp/hyperapp) [dispatch initializer](https://github.com/jorgebucaran/hyperapp/blob/main/docs/architecture/dispatch.md#dispatch-initializer) that logs state updates and action information to the console.

## Getting Started

This example shows a counter that can be incremented or decremented. Go ahead and [try it online](https://codepen.io/okwolf/pen/xLQmvW?editors=0010) with your browser console open to see the log messages.

```jsx
import { app } from "hyperapp";
import logger from "hyperapp-logger";

const Up = state => state + 1;
const Down = state => state - 1;

app({
  init: 0,
  view: state => (
    <main>
      <h1>{state.count}</h1>
      <button onclick={Down}>ー</button>
      <button onclick={Up}>＋</button>
    </main>
  ),
  node: document.getElementById("app"),
  dispatch: logger
});
```

![Screenshot](https://user-images.githubusercontent.com/3735164/152481590-d18dc32a-71fa-47da-8606-742bc6fc42b1.png)

## Installation

### Node.js

Install with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/hyperapp-logger">hyperapp-logger</a>
</pre>

Then with a module bundler like [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack) use as you would anything else.

```js
import logger from "hyperapp-logger";
```

### Browser

Download the minified library from the [CDN](https://unpkg.com/hyperapp-logger).

```html
<script src="https://unpkg.com/hyperapp-logger"></script>
```

You can find the library in `window.hyperappLogger`.

## Usage

```js
import logger from "hyperapp-logger";

app({
  init,
  view,
  node,
  dispatch: logger
});

// Or if you need to pass options
app({
  init,
  view,
  node,
  dispatch: logger(options)
});
```

### Options

#### `options.log`

Use it to customize the log function.

```js
app({
  init,
  view,
  node,
  dispatch: logger({
    log(state, action, props, actionResult) {
      // format and send your log messages anywhere you like
    }
  })
});
```

## License

Hyperapp Logger is MIT licensed. See [LICENSE](LICENSE.md).
