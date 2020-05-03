// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return db.collection('message').add({
    data:{
      message: event.message,
      sell_id: event.sell_id,
      send_id: event.send_id,
      book_id: event.book_id,
      buy_id:event.buy_id,
      timestamp: new Date().getTime()
    }
  })
}