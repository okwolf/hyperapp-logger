import defaultLog from "./defaultLog"

export default function(options) {
  options = options || {}
  options.log = typeof options.log === "function" ? options.log : defaultLog

  return function(app) {
    return function(model, view, container) {
      function withoutFunctions(value) {
        return Object.keys(value || {}).reduce(function(otherValues, name) {
          var slice = value[name]
          if (typeof slice !== "function") {
            otherValues[name] =
              Object(slice) === slice ? withoutFunctions(slice) : slice
          }
          return otherValues
        }, {})
      }
      function enhanceActions(model, prefix) {
        var namespace = prefix ? prefix + "." : ""
        return Object.keys(model || {}).reduce(function(otherActions, name) {
          var namedspacedName = namespace + name
          var slice = model[name]
          otherActions[name] =
            typeof slice === "function"
              ? function(data) {
                  return function(store) {
                    var result = slice(data)
                    result =
                      typeof result === "function" ? result(store) : result
                    options.log(
                      withoutFunctions(store),
                      { name: namedspacedName, data: data },
                      result
                    )
                    return result
                  }
                }
              : Object(slice) === slice
                ? enhanceActions(slice, namedspacedName)
                : slice
          return otherActions
        }, {})
      }

      const enhancedModel = enhanceActions(model)

      var appActions = app(enhancedModel, view, container)
      return appActions
    }
  }
}
