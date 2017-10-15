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

  logger()(app)({
    actions: {
      foo(state) {
        return state
      }
    },
    init(state, actions) {
      actions.foo()
    }
  })
})

test("custom log function", done =>
  logger({
    log(state, action, nextState) {
      expect(state).toEqual({ value: 0 })
      expect(action).toEqual({ name: "inc", data: { by: 2 } })
      expect(nextState).toEqual({ value: 2 })
      done()
    }
  })(app)({
    state: {
      value: 0
    },
    actions: {
      inc: (state, actions, { by }) => ({ value: state.value + by })
    },
    init(state, actions) {
      actions.inc({ by: 2 })
    }
  }))

test("state slices", done =>
  logger({
    log(state, action, nextState) {
      switch (action.name) {
        case "hello":
          expect(state).toEqual({ slice: { value: 0 } })
          expect(nextState).toEqual({ message: "hello" })
          break
        case "slice.up":
          expect(state).toEqual({ value: 0 })
          expect(nextState).toEqual({ value: 1 })
          break
        case "slice.upWithThunk":
          expect(state).toEqual({ value: 1 })
          expect(action.data).toBe(1)
          expect(nextState).toEqual({ value: 2 })
          done()
          break
        default:
          throw new Error(`Unexpected action: ${action.name}`)
      }
    }
  })(app)({
    state: {
      slice: {
        value: 0
      }
    },
    actions: {
      hello(state) {
        return { message: "hello" }
      },
      slice: {
        up(state) {
          return { value: state.value + 1 }
        },
        upWithThunk(state, actions, data) {
          return update => update({ value: state.value + data })
        }
      }
    },
    init(state, actions) {
      actions.hello()
      actions.slice.up()
      actions.slice.upWithThunk(1)
    }
  }))
