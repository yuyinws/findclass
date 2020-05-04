// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var info = { course_name: "高等数学综合", teacher_name: "柴惠文" }
  var str = JSON.stringify(info)
  return await
  //event.class_info
  db.collection('comment').aggregate().match({
    class_info: event.class_info
  }).end()
}