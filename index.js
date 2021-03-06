var checkinFunc = require('./autoscripts/checkin')
var givebounsFunc = require('./autoscripts/givebonus')
var getbingurlFunc = require('./autoscripts/getbingurl')
var highlightFunc = require('./autoscripts/highlight')

setInterval(() => {
  // 获取时分秒
  var tHours = new Date().getHours()
  var tMins = new Date().getMinutes()
  var tSecs = new Date().getSeconds()

  if (tHours == 6 && tMins == 0 && tSecs == 0) {
    checkinFunc()
  }
  if (tHours == 7 && tMins == 0 && tSecs == 0) {
    highlightFunc()
  }
  if (tHours == 12 && tMins == 0 && tSecs == 0) {
    getbingurlFunc()
  }
  if (tHours == 16 && tMins == 0 && tSecs == 0) {
    givebounsFunc()
  }

}, 1000);

console.log('scripts start\n')
