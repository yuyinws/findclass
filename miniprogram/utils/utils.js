const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
function timetrans(date){
  var date = new Date(date);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
}

function getMyTags(user_id){
  var test = ""
  db.collection('tag').aggregate().match({
    user_id:user_id
  }).end().then(res => {
    test = res
    return test
  }).catch(res => {
    console.log(res)
  })
}

module.exports = {
  timestampToDate: timetrans,
  getMyTags: getMyTags
}