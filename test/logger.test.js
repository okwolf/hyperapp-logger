import { h, app } from "hyperapp"
import logger from "../src"

const defaultConsole = console

afterEach(() => {
  console = defaultConsole
})

test("custom log function", done => {
  app({
    state: {
      value: 0
    },
    actions: {
      up: state => ({ value: state.value + 1 }),
      down: state => ({ value: state.value - 1 }),
      upWithThunk: (state, actions, data) => update =>
        update({ value: state.value + data })
    },
    hooks: [
      logger({
        log(prevState, action, nextState) {
          if (action.name === "up") {
            expect(prevState).toEqual({ value: 0 })
            expect(nextState).toEqual({ value: 1 })
          } else if (action.name === "upWithThunk") {
            expect(prevState).toEqual({ value: 1 })
            expect(action.data).toBe(1)
            expect(nextState).toEqual({ value: 2 })
          } else if (action.name === "down") {
            expect(prevState).toEqual({ value: 2 })
            expect(nextState).toEqual({ value: 1 })
            done()
          }
        }
      }),
      (state, actions) => {
        actions.up()
        actions.upWithThunk(1)
        actions.down()
      }
    ]
  })
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
    state: {
      works: true
    },
    actions: {
      foo(state) {
        return state
      }
    },
    hooks: [
      logger(),
      (state, actions) => {
        actions.foo()
      }
    ]
  })
})
