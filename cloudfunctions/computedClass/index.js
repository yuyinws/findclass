// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  var classResult = [1,2,3]
  await event.res1.result.forEach((item1, index1) => {
    classResult.push('test')
    db.collection('tag').aggregate().match({
      tags: _.all([item1.name])
    }).end()
    // .then(res2 => {
    //   classResult.push('test2')
    //   res2.list.forEach((item2, index2) => {
    //     item2.tagName = item1.name
    //     item2.count = item1.count
    //     classResult.push(item2)

    //   })
    // })
  })
  return classResult

}