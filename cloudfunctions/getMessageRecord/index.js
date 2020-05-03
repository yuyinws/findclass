// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return db.collection('message').aggregate().lookup({
    from:'user',
    localField:'send_id',
    foreignField:'openid',
    as:'user_info'
  }).match({
    book_id: event.book_id,
    buy_id: event.buy_id
  }).end()
}