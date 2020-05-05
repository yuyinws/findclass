// 云函数入口文件

const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection("post").add({
    data:{
      user_id:event.user_id,
      post_type:event.post_type,
      post_target_id:event.post_target_id,
      timestamp:new Date().getTime()
    }
  })
}