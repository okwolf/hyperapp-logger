# <img height=24 src=https://cdn.rawgit.com/jorgebucaran/f53d2c00bafcf36e84ffd862f0dc2950/raw/882f20c970ff7d61aa04d44b92fc3530fa758bc0/Hyperapp.svg> Hyperapp Logger

[![Travis CI](https://img.shields.io/travis/hyperapp/logger/master.svg)](https://travis-ci.org/hyperapp/logger)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/logger/master.svg)](https://codecov.io/gh/hyperapp/logger)
[![npm](https://img.shields.io/npm/v/@hyperapp/logger.svg)](https://www.npmjs.org/package/@hyperapp/logger)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

A [Hyperapp](https://github.com/hyperapp/hyperapp) higher-order `app` that logs state updates and action information to the console.

## Getting Started

This example shows a counter that can be incremented or decremented. Go ahead and [try it online](https://codepen.io/okwolf/pen/xLQmvW?editors=0010) with your browser console open to see the log messages.

```js
import { h, app } from "hyperapp"
import { withLogger } from "@hyperapp/logger"

const state = {
  count: 0
}

const actions = {
  down: () => state => ({ count: state.count - 1 }),
  up: () => state => ({ count: state.count + 1 })
}

const view = (state, actions) => (
  <main>
    <h1>{state.count}</h1>
    <button onclick={actions.down} disabled={state.count <= 0}>
      ー
    </button>
    <button onclick={actions.up}>＋</button>
  </main>
)

withLogger(app)(state, actions, view, document.body)
```

![Screenshot](https://user-images.githubusercontent.com/3735164/36941306-d7233132-1f0c-11e8-9b97-335f7957a685.png)

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

Compose the `withLogger` function with your `app` before calling it with the usual arguments.

```js
import { withLogger } from "@hyperapp/logger"

withLogger(app)(state, actions, view, document.body)

// Or if you need to pass options
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
