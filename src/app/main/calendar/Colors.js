const colors = [{
    regular: 'rgb(244, 39, 39, .6)', //red
    hover: 'rgb(244, 39, 39)'
}, {
    regular: 'rgb(141, 50, 255, .6)', //purple
    hover: 'rgb(141, 50, 255)'
}, {
    regular: 'rgb(255, 59, 216, .6)', //pink
    hover: 'rgb(255, 59, 216)'
}, {
    regular: 'rgb(255, 234, 55, .6)', //yellow
    hover: 'rgb(255, 234, 55)'
}, {
    regular: 'rgb(255, 147, 20, .6)', //orange
    hover: 'rgb(255, 147, 20)'
}, {
    regular: 'rgb(12, 15, 245, .5)', // dark blue
    hover: 'rgb(12, 15, 245)'
}, {
    regular: 'rgb(48, 217, 161, .5)', // light blue
    hover: 'rgb(48, 217, 161)'
}, {
    regular: 'rgb(59, 162, 11, .6)', // green
    hover: 'rgb(59, 162, 11)'
}, {
    regular: 'rgb(79, 232, 48, .6)', // light green
    hover: 'rgb(79, 232, 48)'
}, {
    regular: 'rgb(93, 93, 93, .6)', // deep purple
    hover: 'rgb(93, 93, 93)'
}]
const stringToInt = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 1) - hash);
  }
 hash = "" + hash
  return hash.substring(1,3);
}
class Colors {
  constructor () {
    this.index = 0
  }
  register (key) {
     //console.log(stringToInt(key))
    this[key] = colors[this.index++ % colors.length]
  }
  get (key) {
    if (!this[key]) {
      this.register(key)
    }
    return this[key]
  }
}

export default new Colors()
