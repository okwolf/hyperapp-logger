/**
 * @jest-environment jsdom
 */
import { h, app } from "hyperapp";
import logger from "../src";

const defaultConsole = console;

afterEach(() => {
  console = defaultConsole;
});

const makeGetState = dispatch => () =>
  new Promise(resolve =>
    dispatch(state => {
      resolve(state);
      return state;
    })
  );

const NoOp = state => state;
const Inc = (state, by) => ({ ...state, value: state.value + by });

test("log", done => {
  console = {
    log() {},
    group() {},
    groupEnd() {
      done();
    }
  };

  const dispatch = app({ dispatch: logger });
  dispatch(NoOp);
});

test("options without custom log", done => {
  console = {
    log() {},
    group() {},
    groupEnd() {
      done();
    }
  };

  const dispatch = app({
    dispatch: logger({})
  });
  dispatch(NoOp);
});

test("custom log function", done => {
  const dispatch = app({
    init: { value: 0 },
    dispatch: logger({
      log(state, action, props, nextState) {
        expect(state).toEqual({ value: 0 });
        expect(action.name).toEqual("Inc");
        expect(props).toEqual(2);
        expect(nextState).toEqual({ value: 2 });
        done();
      }
    })
  });
  dispatch(Inc, 2);
});

test("doesn't interfere with state updates", async () => {
  const dispatch = app({ init: { value: 0 }, dispatch: logger });
  const getState = makeGetState(dispatch);

  expect(await getState()).toEqual({
    value: 0
  });

  dispatch(Inc, 2);

  expect(await getState()).toEqual({
    value: 2
  });
});
