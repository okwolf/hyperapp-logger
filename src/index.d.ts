export as namespace hyperappLogger

import { ActionsType, View } from 'hyperapp'

export interface LoggerFunction<PrevState = {}, Action = {}, NextState = {}> {
  (prevState: PrevState, action: Action, nextState: NextState): void
}

export interface LoggerOptions {
  log?: LoggerFunction
}

export interface App<State, Actions> {
  (
    state: State,
    actions: ActionsType<State, Actions>,
    view: View<State, Actions>,
    container: Element | null,
  ): Actions
}

export function withLogger<App>(app: App): App
export function withLogger<App, LoggerOptions>(opts: LoggerOptions): (app: App) => App
