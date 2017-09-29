function log(prevState, action, nextState) {
  console.group("%c action", "color: gray; font-weight: lighter;", action.name)
  console.log("%c prev state", "color: #9E9E9E; font-weight: bold;", prevState)
  console.log("%c data", "color: #03A9F4; font-weight: bold;", action.data)
  console.log("%c next state", "color: #4CAF50; font-weight: bold;", nextState)
  console.groupEnd()
}

export default function(options) {
  options = options || {}
  options.log = typeof options.log === "function" ? options.log : log

  return function() {
    return function(action) {
      return function(result) {
        return function(update) {
          return update(function(prevState) {
            if (typeof result === "function") {
              return result(function(updateResult) {
                options.log(prevState, action, updateResult)
                return updateResult
              })
            } else {
              options.log(prevState, action, result)
              return result
            }
          })
        }
      }
    }
  }
}
