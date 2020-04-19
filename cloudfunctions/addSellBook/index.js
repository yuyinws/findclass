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

  return await db.collection('sell').add({
    data:{
      openid:event.openid,
      imgList:event.imgList,
      timestamp: event.timestamp,
      bookName:event.bookName,
      originalPrice: event.originalPrice,
      sellPrice:event.sellPrice,
      contactType:event.contactType,
      contact:event.contact,
      press:event.press,
      isSell:0,
      bookType:event.bookType,
      author:event.author,
      discount:event.discount,
      remark:event.remark,
      wantedPrice:event.wantedPrice,
      type:event.type
    }
  })
}