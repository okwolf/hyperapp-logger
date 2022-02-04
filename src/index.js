import defaultLog from "./defaultLog";

var isFn = function (value) {
  return typeof value === "function";
};

function makeLoggerDispatch(log, dispatch) {
  return function loggerDispatch(action, props) {
    if (isFn(action)) {
      return dispatch(function (state) {
        var actionResult = action(state, props);
        log(state, action, props, actionResult);
        return actionResult;
      });
    } else {
      return dispatch(action, props);
    }
  };
}

export default function logger(optionsOrDispatch) {
  if (isFn(optionsOrDispatch)) {
    return makeLoggerDispatch(defaultLog, optionsOrDispatch);
  } else {
    var log = isFn(optionsOrDispatch.log) ? optionsOrDispatch.log : defaultLog;
    return function (dispatch) {
      return makeLoggerDispatch(log, dispatch);
    };
  }
}
