// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:'test-tkxjp',
  traceUser:true
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('user').add({
    data:{
      openid: wxContext.OPENID,
      nickname:event.nickname,
      avatarurl:event.avatarurl,
      country:event.country,
      gender:event.gender,
      province:event.province,
      city:event.city
    }
  })
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}