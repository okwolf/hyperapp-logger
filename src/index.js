import defaultLog from "./defaultLog"

function isFn(value) {
  return typeof value === "function"
}

// Same as clone function in Hyperapp
// but with names I can understand better
// https://github.com/hyperapp/hyperapp/blob/62feb73302da9c02d04c16670804b472609c566f/src/index.js#L83-L90
function assign(from, assignments) {
  var i,
    obj = {}

  for (i in from) obj[i] = from[i]
  for (i in assignments) obj[i] = assignments[i]

  return obj
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
                  var nextState =
                    // same check as Hyperapp for determining if state should update
                    // https://github.com/hyperapp/hyperapp/blob/62feb73302da9c02d04c16670804b472609c566f/src/index.js#L121-L123
                    result && !result.then ? assign(state, result) : state
                  log(state, { name: namedspacedName, data: data }, nextState)
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
