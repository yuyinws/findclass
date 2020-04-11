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
  if(event.isExist){
    return await db.collection('tag').where({
      user_id:event.user_id,
      class_info:event.class_info,
    }).update({
      data:{
        tags:event.tags
      }
    })
  } else {
    return await db.collection('tag').add({
      data:{
        user_id: event.user_id,
        class_info: event.class_info,
        tags: event.tags
      }

    })
  }
}