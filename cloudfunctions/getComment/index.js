// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-tkxjp',
  traceUser: true
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection('comment').aggregate().sort({ timestamp: -1 }).match({
    class_info: event.classInfo
  }).lookup({
    from: 'user',
    localField: 'user_id',
    foreignField: '_id',
    as: 'user_info'
  }).limit(5).end()
}