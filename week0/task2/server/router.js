["GET", "POST", "DELETE"].forEach(function (method) {
  exports[method.toLowerCase()] = function (url, handler) {
    return {method: method, url: url, handler: handler}
  }
});