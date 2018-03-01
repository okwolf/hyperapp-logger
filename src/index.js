import defaultLog from "./defaultLog"

export default function(options) {
  var dispatchedActionDetails = {}
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
              ? function(data) {
                  return function(state, actions) {
                    var result = action(data)
                    result =
                      typeof result === "function"
                        ? result(state, actions)
                        : result

                    if (result instanceof Promise || result == null) {
                      options.log(
                        state,
                        { name: namedspacedName, data: data },
                        result
                      )
                    } else {
                      dispatchedActionDetails = {
                        name: namedspacedName,
                        data: data,
                        namespace:
                          namespace.slice(-1) === "."
                            ? namespace.slice(0, -1)
                            : namespace,
                        state: state
                      }
                    }

                    return result
                  }
                }
              : enhanceActions(action, namedspacedName)
          return otherActions
        }, {})
      }

      function enhanceView(view) {
        return function(state, actions) {
          if (dispatchedActionDetails.name) {
            options.log(
              dispatchedActionDetails.state,
              {
                name: dispatchedActionDetails.name,
                data: dispatchedActionDetails.data
              },
              dispatchedActionDetails.namespace
                .split(".")
                .reduce(
                  (nestedState, prop) =>
                    prop ? nestedState[prop] : nestedState,
                  state
                )
            )
            dispatchedActionDetails = {}
          }
          return view(state, actions)
        }
      }

      var enhancedActions = enhanceActions(actionsTemplate)
      var enhancedView = enhanceView(view)

      var appActions = app(
        initialState,
        enhancedActions,
        enhancedView,
        container
      )
      return appActions
    }
  }
}
