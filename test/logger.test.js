import { h, app } from "hyperapp"
import logger from "../src"

const defaultConsole = console

afterEach(() => {
  console = defaultConsole
})

test("without actions", done => logger()(app)({}, () => done()))

test("log", done => {
  console = {
    log() {},
    group() {},
    groupEnd() {
      done()
    }
  }

  logger()(app)({
    foo: () => state => state
  }).foo()
})

test("custom log function", done =>
  logger({
    log(state, action, nextState) {
      expect(state).toEqual({ value: 0 })
      expect(action).toEqual({ name: "inc", data: 2 })
      expect(nextState).toEqual({ value: 2 })
      done()
    }
  })(app)({
    value: 0,
    inc: by => state => ({ value: state.value + by })
  }).inc(2))

test("state slices", done => {
  const actions = logger({
    log(state, action, nextState) {
      switch (action.name) {
        case "hello":
          expect(state).toEqual({ slice: { value: 0 } })
          expect(nextState).toEqual({ message: "hello" })
          break
        case "slice.up":
          expect(state).toEqual({ value: 0 })
          expect(action.data).toBe(1)
          expect(nextState).toEqual({ value: 1 })
          done()
          break
        default:
          throw new Error(`Unexpected action: ${action.name}`)
      }
    }
  })(app)({
    hello: () => () => ({ message: "hello" }),
    slice: {
      value: 0,
      up: by => state => ({ value: state.value + by })
    }
  })
  actions.hello()
  actions.slice.up(1)
})

test("doesn't interfere with state updates", done => {
  const model = {
    value: 0,
    get: () => ({ value }) => ({ value }),
    up: by => state => ({
      value: state.value + by
    }),
    finish: () => actions => {
      actions.exit()
    },
    exit: () => {
      done()
    }
  }
  const store = logger({
    log(state, action, nextState) {}
  })(app)(model)

  expect(store.get()).toEqual({
    value: 0
  })

  expect(store.up(2)).toEqual({
    value: 2
  })

  expect(store.get()).toEqual({
    value: 2
  })

  store.finish()
})

test("doesn't interfere with custom container", done => {
  document.body.innerHTML = "<main></main>"
  const model = {
    message: "foo"
  }
  const view = state =>
    h(
      "div",
      {
        oncreate() {
          expect(document.body.innerHTML).toBe("<main><div>foo</div></main>")
          done()
        }
      },
      "foo"
    )
  logger({
    log(state, action, nextState) {}
  })(app)(model, view, document.body.firstChild)
})
