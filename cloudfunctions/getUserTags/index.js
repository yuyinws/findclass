// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('tag').aggregate()
  .lookup({
    from:'comment',
    localField:'class_info',
    foreignField:'class_info',
    as:'commentList'
  })
  .match({
    user_id:event.user_id
  }).limit(10000).end()
}