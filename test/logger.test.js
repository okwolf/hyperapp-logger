import { h, app } from "hyperapp"
import logger from "../src"

const defaultConsole = console

afterEach(() => {
  console = defaultConsole
})

test("custom log function", done => {
  const appActions = logger({
    log(state, action, nextState) {
      if (action.name === "up") {
        expect(state).toEqual({ value: 0 })
        expect(nextState).toEqual({ value: 1 })
      } else if (action.name === "upWithThunk") {
        expect(state).toEqual({ value: 1 })
        expect(action.data).toBe(1)
        expect(nextState).toEqual({ value: 2 })
        done()
      }
    }
  })(app)({
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
    }
  })
  appActions.up()
  appActions.upWithThunk(1)
})

test("log", done => {
  console = {
    log() {},
    group() {},
    groupEnd() {
      done()
    }
  }

  const appActions = logger()(app)({
    actions: {
      foo(state) {
        return state
      }
    }
  })
  appActions.foo()
})
