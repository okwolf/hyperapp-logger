import defaultLog from './defaultLog'

export default function(options) {
  options = options || {}
  options.log = typeof options.log === "function" ? options.log : defaultLog

  return function(app) {
    return function(props) {
      function enhance(actions) {
        return Object.keys(actions).reduce(function(otherActions, name) {
          var action = actions[name]
          otherActions[name] =
            typeof action === "function"
              ? function(state, actions, data) {
                  var result = action(state, actions, data)
                  if (typeof result === "function") {
                    return function(update) {
                      return result(function(withState) {
                        options.log(
                          state,
                          { name: name, data: data },
                          withState
                        )
                        return update(withState)
                      })
                    }
                  } else {
                    options.log(state, { name: name, data: data }, result)
                    return result
                  }
                }
              : enhance(action)
          return otherActions
        }, {})
      }

      props.actions = enhance(props.actions)
      var appActions = app(props)

      return appActions
    }
  }
}
