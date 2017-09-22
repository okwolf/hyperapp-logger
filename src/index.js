function defaultLog(params) {
  var prevState = params.prevState,
    action = params.action,
    nextState = params.nextState
  console.group("%c action", "color: gray; font-weight: lighter;", action.name)
  console.log("%c prev state", "color: #9E9E9E; font-weight: bold;", prevState)
  console.log("%c data", "color: #03A9F4; font-weight: bold;", action.data)
  console.log("%c next state", "color: #4CAF50; font-weight: bold;", nextState)
  console.groupEnd()
}

export default function() {
  return function(emit) {
    var actionStack = []
    return {
      events: {
        action: function(state, actions, action) {
          actionStack.push(action)
        },
        resolve: function(state, actions, result) {
          if (typeof result === "function") {
            var action = actionStack.pop()
            return function(update) {
              return result(function(result) {
                actionStack.push(action)
                return update(result)
              })
            }
          }
        },
        update: function(state, actions, nextState) {
          var params = {
            prevState: state,
            action: actionStack.pop(),
            nextState: nextState
          }
          var resultParams = emit("log", params)
          if (resultParams) {
            defaultLog(resultParams)
          }
        }
      }
    }
  }
}
