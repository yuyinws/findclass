// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-tkxjp',
  traceUser: true
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection('comment').add({
    data:{
      user_id:event.userId,
      class_info:event.classInfo,
      rate:event.rate,
      comment:event.comment,
      timestamp:event.timestamp
    }
  })
}