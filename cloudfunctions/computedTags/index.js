// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  function compore(p) {
    return function (m, n) {
      var a = m[p];
      var b = n[p];
      return b - a; //升序
    }
  }
  var result = []
  for (let i in event.tagArr) {
    var tag = {
      name: "",
      count: 1
    }
    var index = ''
    var flag = 0
    for (let j in result) {
      if (result[j].name === event.tagArr[i]) {
        flag = 1
        index = j
        break
      }
    }
    if (flag == 0) {
      tag.name = event.tagArr[i]
      result.push(tag)
    } else {
      result[index].count++
    }
  }
  return result.sort(compore('count'))
}