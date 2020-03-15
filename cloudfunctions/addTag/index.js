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
  const isExist = await db.collection('tag').where({
    class_info:event.class_info,
    user_id:event.user_id
  }).count()
  return isExist;
}