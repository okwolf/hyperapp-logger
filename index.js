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
  var defaultLog = function(prevState, action, nextState) {
    console.group(
      '%c action',
      'color: gray; font-weight: lighter;',
      action.name
    );
    console.log(
      '%c prev state',
      'color: #9E9E9E; font-weight: bold;',
      prevState
    );
    console.log('%c data', 'color: #03A9F4; font-weight: bold;', action.data);
    console.log(
      '%c next state',
      'color: #4CAF50; font-weight: bold;',
      nextState
    );
    console.groupEnd();
  };
  var logger = function(options) {
    options = options || {};
    options.log = typeof options.log === 'function' ? options.log : defaultLog;
    return function(emit) {
      var actionStack = [];
      return {
        events: {
          action(state, actions, action) {
            actionStack.push(action);
          },
          resolve(state, actions, result) {
            if (typeof result === 'function') {
              var action = actionStack.pop();
              return function(update) {
                result(function(updateResult) {
                  actionStack.push(action);
                  update(updateResult);
                });
              };
            }
          },
          update(state, actions, nextState) {
            var action = actionStack.pop();
            options.log(state, action, nextState);
          }
        }
      };
    };
  };

  return logger;
});
