(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.hyperappLogger = factory();
  }
})(this, function() {
  return function() {
    var firedActions = [];
    var updateActions = [];
    return {
      events: {
        action(state, actions, action) {
          firedActions.push(action);
        },
        resolve(state, actions, result) {
          var action = firedActions.pop();
          if (typeof result === 'function') {
            return function(update) {
              result(function(updateResult) {
                updateActions.push(action);
                update(updateResult);
              });
            };
          } else if (typeof result === 'object') {
            updateActions.push(action);
          }
        },
        update(state, actions, nextState) {
          var action = updateActions.pop();
          console.group(
            '%c action',
            'color: gray; font-weight: lighter;',
            action.name
          );
          console.log(
            '%c prev state',
            'color: #9E9E9E; font-weight: bold;',
            state
          );
          console.log(
            '%c data',
            'color: #03A9F4; font-weight: bold;',
            action.data
          );
          console.log(
            '%c next state',
            'color: #4CAF50; font-weight: bold;',
            nextState
          );
          console.groupEnd();
        }
      }
    };
  };
});
