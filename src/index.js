import defaultLog from "./defaultLog"

export default function(options) {
  options = options || {}
  options.log = typeof options.log === "function" ? options.log : defaultLog

  return function(app) {
    return function(props) {
      function enhanceActions(actions, prefix) {
        var namespace = prefix ? prefix + "." : ""
        return Object.keys(actions || {}).reduce(function(otherActions, name) {
          var namedspacedName = namespace + name
          var action = actions[name]
          otherActions[name] =
            typeof action === "function"
              ? function(state, actions) {
                  return function(data) {
                    var result = action(state, actions)
                    var nextState =
                      typeof result === "function" ? result(data) : result
                    options.log(
                      state,
                      { name: namedspacedName, data: data },
                      nextState
                    )
                    return nextState
                  }
                }
              : enhanceActions(action, namedspacedName)
          return otherActions
        }, {})
      }

      function enhanceModules(module, prefix) {
        var namespace = prefix ? prefix + "." : ""
        module.actions = enhanceActions(module.actions, prefix)

        Object.keys(module.modules || {}).map(function(name) {
          enhanceModules(module.modules[name], namespace + name)
        })
      }

      enhanceModules(props)
      var appActions = app(props)

      return appActions
    }
  }
}
