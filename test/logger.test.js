import { h, app } from "hyperapp"
import logger from "../src"

const defaultConsole = console

afterEach(() => {
  console = defaultConsole
})

test("without actions", done =>
  logger()(app)(undefined, undefined, () => done()))

test("log", done => {
  console = {
    log() {},
    group() {},
    groupEnd() {
      done()
    }
  }

  logger()(app)(
    {},
    {
      foo: () => state => state
    }
  ).foo()
})

test("custom log function", done =>
  logger({
    log(state, action, nextState) {
      expect(state).toEqual({ value: 0 })
      expect(action).toEqual({ name: "inc", data: 2 })
      expect(nextState).toEqual({ value: 2 })
      done()
    }
  })(app)(
    {
      value: 0
    },
    {
      inc: by => state => ({ value: state.value + by })
    }
  ).inc(2))

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
  })(app)(
    {
      slice: {
        value: 0
      }
    },
    {
      hello: () => () => ({ message: "hello" }),
      slice: {
        up: by => state => ({ value: state.value + by })
      }
    }
  )
  actions.hello()
  actions.slice.up(1)
})

test("doesn't interfere with state updates", done => {
  const actions = logger({
    log(state, action, nextState) {}
  })(app)(
    {
      value: 0
    },
    {
      get: () => state => state,
      up: by => state => ({
        value: state.value + by
      }),
      finish: () => (state, actions) => {
        actions.exit()
      },
      exit: () => {
        done()
      }
    }
  )

  expect(actions.get()).toEqual({
    value: 0
  })

  expect(actions.up(2)).toEqual({
    value: 2
  })

  expect(actions.get()).toEqual({
    value: 2
  })

  actions.finish()
})

test("doesn't interfere with custom container", done => {
  document.body.innerHTML = "<main></main>"
  logger({
    log(state, action, nextState) {}
  })(app)(
    {},
    {},
    state =>
      h(
        "div",
        {
          oncreate() {
            expect(document.body.innerHTML).toBe("<main><div>foo</div></main>")
            done()
          }
        },
        "foo"
      ),
    document.body.firstChild
  )
})

test("next state of a slice", done => {
  const state = {
    counters: {
      count1: 1,
      count2: 2
    }
  }

  const actions = {
    counters: {
      inc1: () => ({ count1 }) => ({ count1: count1 + 1 })
    }
  }

  logger({
    log(prevState, action, nextState) {
      expect(prevState).toEqual({
        count1: 1,
        count2: 2
      })
      expect(nextState).toEqual({
        count1: 2,
        count2: 2
      })
    }
  })(app)(state, actions, () => done()).counters.inc1()
})

test("handle action which returns a promise", done => {
  const actions = {
    getPromise: () => () => Promise.resolve("hello")
  }

  logger({
    log(prevState, action, nextState) {
      expect(nextState instanceof Promise).toBeTruthy()
      done()
    }
  })(app)({}, actions).getPromise()
})

test("handle action which returns undefined", done => {
  const actions = {
    getUndefined: () => () => undefined
  }

  logger({
    log(prevState, action, nextState) {
      expect(typeof nextState).toEqual("undefined")
      done()
    }
  })(app)({}, actions).getUndefined()
})

test("handle action which returns null", done => {
  const actions = {
    getNull: () => () => null
  }

  logger({
    log(prevState, action, nextState) {
      expect(nextState).toEqual(null)
      done()
    }
  })(app)({}, actions).getNull()
})
