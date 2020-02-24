// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-tkxjp',
  traceUser: true
})

// 云函数入口函数
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection('user').doc(event.id).update({
    data:{
      avatarurl:event.avatarurl
    }
  })
}