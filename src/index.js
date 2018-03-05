import defaultLog from "./defaultLog"

var isFn = function(value) {
  return typeof value === "function"
}

function makeLoggerApp(log, nextApp) {
  var dispatchedActionStack = []
  return function(initialState, actionsTemplate, view, container) {
    function enhanceActions(actions, prefix) {
      var namespace = prefix ? prefix + "." : ""
      return Object.keys(actions || {}).reduce(function(otherActions, name) {
        var namedspacedName = namespace + name
        var action = actions[name]
        otherActions[name] =
          typeof action === "function"
            ? (function() {
                var rename = "_" + name

                if (!otherActions._logWithUpdatedState) {
                  otherActions._logWithUpdatedState = function() {
                    return function(state) {
                      var dispatchedActionDetails = dispatchedActionStack.pop()
                      log(
                        dispatchedActionDetails.state,
                        {
                          name: dispatchedActionDetails.name,
                          data: dispatchedActionDetails.data
                        },
                        state
                      )
                    }
                  }
                }

                otherActions[rename] = function(data) {
                  return function(state, actions) {
                    var result = action(data)

                    result =
                      typeof result === "function"
                        ? result(state, actions)
                        : result

                    dispatchedActionStack.push({
                      name: namedspacedName,
                      data: data,
                      state: state
                    })

                    return result
                  }
                }

                return function(data) {
                  return function(state, actions) {
                    var result = actions[rename](data)
                    actions._logWithUpdatedState()
                    return result
                  }
                }
              })()
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
