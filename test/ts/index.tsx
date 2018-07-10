import { h, app, ActionsType, View } from 'hyperapp'
import { withLogger, App, LoggerFunction, LoggerOptions } from '../../src/index'

interface State {
  count: number
}

interface Actions {
  down(): State
  up(): State
}

const state: State = {
  count: 0,
}

const actions: ActionsType<State, Actions> = {
  down: () => state => ({ count: state.count - 1 }),
  up: () => state => ({ count: state.count + 1 })
}

const view: View<State, Actions> = (state, actions) => (
  <main>
    <h1>{state.count}</h1>
    <button onclick={actions.down} disabled={state.count <= 0}>
      ー
    </button>
    <button onclick={actions.up}>＋</button>
  </main>
)

// 1. Default logger example
withLogger<App<State, Actions>>(app)(
  state,
  actions,
  view,
  document.body
)

// 2. Custom logger example
const customLogger: LoggerFunction = (
  prevState,
  state,
  nextState
) => console.log(prevState, state, nextState)

const opts: LoggerOptions = {
  log: customLogger
}

withLogger<App<State, Actions>, LoggerOptions>(opts)(app)(
  state,
  actions,
  view,
  document.body
)
