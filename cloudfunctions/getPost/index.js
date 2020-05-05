// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection("post").aggregate().lookup({
    from:'sell',
    localField:'post_target_id',
    foreignField:'_id',
    as:'sellList'
  })
  .match({
    user_id:event.user_id
  })
  .sort({
    timestamp:-1
  })
  .skip(event.skip)
  .limit(10)
  .end()
}