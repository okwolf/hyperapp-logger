import defaultLog from "./defaultLog"

export default function(options) {
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
                    options.log(
                      state,
                      { name: namedspacedName, data: data },
                      result
                    )
                    return result
                  }
                }
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
