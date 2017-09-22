import { h, app } from "hyperapp"
import logger from "../src"

const defaultConsole = console

afterEach(() => {
  console = defaultConsole
})

test("log", done => {
  console = {
    log() {},
    group() {},
    groupEnd() {
      done()
    }
  }

  app({
    actions: {
      foo(state) {
        return state
      }
    },
    events: {
      load(state, actions) {
        actions.foo()
      }
    },
    mixins: [logger()]
  })
})

test("log event handler filtering actions", done => {
  console = {
    log() {},
    group(message, format, param) {
      expect(param).toBe("bar")
    },
    groupEnd() {
      done()
    }
  }

  app({
    actions: {
      foo: state => state,
      bar: state => state
    },
    events: {
      load(state, actions) {
        actions.foo()
        actions.bar()
      },
      log(state, actions, { prevState, action, nextState }) {
        if (action.name === "foo") {
          return false
        }
      }
    },
    mixins: [logger()]
  })
})

test("log event handler overriding default log", done => {
  app({
    state: {
      value: 0
    },
    actions: {
      up(state) {
        return { value: state.value + 1 }
      },
      upWithThunk(state, actions, data) {
        return update => update({ value: state.value + data })
      }
    },
    events: {
      load(state, actions) {
        actions.up()
        actions.upWithThunk(1)
      },
      log(state, actions, { prevState, action, nextState }) {
        if (action.name === "up") {
          expect(state).toEqual({ value: 0 })
          expect(nextState).toEqual({ value: 1 })
        } else if (action.name === "upWithThunk") {
          expect(state).toEqual({ value: 1 })
          expect(action.data).toBe(1)
          expect(nextState).toEqual({ value: 2 })
          done()
        }
        return false
      }
    },
    mixins: [logger()]
  })
})
