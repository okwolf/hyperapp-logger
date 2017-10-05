function defaultLog(prevState, action, nextState) {
  console.group("%c action", "color: gray; font-weight: lighter;", action.name)
  console.log("%c prev state", "color: #9E9E9E; font-weight: bold;", prevState)
  console.log("%c data", "color: #03A9F4; font-weight: bold;", action.data)
  console.log("%c next state", "color: #4CAF50; font-weight: bold;", nextState)
  console.groupEnd()
}

export default function(options) {
  options = options || {}
  options.log = typeof options.log === "function" ? options.log : defaultLog

  return function(app) {
    return function(props) {
      function enhance(actions) {
        return Object.keys(actions).reduce(function(otherActions, name) {
          const action = actions[name]
          otherActions[name] =
            typeof action === "function"
              ? function(state, actions, data) {
                  const result = action(state, actions, data)
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
      const appActions = app(props)

      return appActions
    }
  }
}
