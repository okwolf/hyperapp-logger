import defaultLog from "./defaultLog"

export default function(options) {
  var dispatchedActionStack = []
  options = options || {}
  options.log = typeof options.log === "function" ? options.log : defaultLog

  return function(app) {
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
                        options.log(
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
                        namespace:
                          namespace.slice(-1) === "."
                            ? namespace.slice(0, -1)
                            : namespace,
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

      var appActions = app(initialState, enhancedActions, view, container)
      return appActions
    }
  }
}
