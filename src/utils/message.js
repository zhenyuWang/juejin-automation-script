const serverNotify = require('./serverNotify.js')

module.exports = function message(msg) {
  console.log(msg)
  serverNotify(msg)
}
