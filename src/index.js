import defaultLog from "./defaultLog"

var isFn = function(value) {
  return typeof value === "function"
}

function makeLoggerApp(log, nextApp) {
  return function(initialState, actionsTemplate, view, container) {
    function enhanceActions(actions, prefix) {
      var namespace = prefix ? prefix + "." : ""
      return Object.keys(actions || {}).reduce(function(otherActions, name) {
        var namedspacedName = namespace + name
        var action = actions[name]
        otherActions[name] =
          typeof action === "function"
            ? function(data) {
                return function(state, actions) {
                  var result = action(data)
                  result =
                    typeof result === "function"
                      ? result(state, actions)
                      : result
                  log(state, { name: namedspacedName, data: data }, result)
                  return result
                }
              }
            : enhanceActions(action, namedspacedName)
        return otherActions
      }, {})
    }

    var enhancedActions = enhanceActions(actionsTemplate)

    var appActions = nextApp(initialState, enhancedActions, view, container)
    return appActions
  }
}

export function withLogger(optionsOrApp) {
  if (isFn(optionsOrApp)) {
    return makeLoggerApp(defaultLog, optionsOrApp)
  } else {
    var log = isFn(optionsOrApp.log) ? optionsOrApp.log : defaultLog
    return function(nextApp) {
      return makeLoggerApp(log, nextApp)
    }
  }
}
