

// -- HELPERS

module.exports.unique = function (array) {
  console.log(array);
  for (var i = 0; i < array.length; i++) {
    if (array.indexOf(array[i], i+1) !== -1){
      array.splice(i, 1);
      i--;
    }
  }
  return array;
}

// Lo-Dash: The cure for your async headaches
module.exports.after = function (n, func) {
  return function() {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
};