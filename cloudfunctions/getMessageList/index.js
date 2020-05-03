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
    from: 'user',
    localField: 'buy_id',
    foreignField: 'openid',
    as: 'userList'
  }).match({
    book_id:event.book_id
  }).group({
    _id:{
      buy_id: "$buy_id",
      user_info: "$userList"
    },
    count: $.sum(1)
  }).end()
}