var userid = ""
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
var classResult = []
var userTag = []
Page({
  data:{
    active:'recommend',
    recommendResult:[1,2,3],
    recommendShow:false
  },
  async onLoad(){
    var that = this
    await wx.getStorage({
      key: 'userid',
      success: function(res) {
        if(res.data._id){
         that.getUserTag(res.data._id)
         
        }
      },
    })
  },
  onChange(event) {
    this.setData({
      active: event.detail
    })
    let barName = event.detail
    wx.redirectTo({
      url: '/pages/' + barName + '/' + barName
    })
  },
  getUserTag(user_id){
    var that = this
    wx.cloud.callFunction({
      name:"getUserTags",
      data:{
        user_id: user_id
      }
    }).then(res0 => {
      let tagArr = []
      userTag = res0.result.list
      res0.result.list.forEach((item0,index0) => {
        tagArr = tagArr.concat(item0.tags)
      })
       wx.cloud.callFunction({
        name:"computedTags",
        data:{
          tagArr:tagArr
        }
      }).then(res1 => {
        console.log(res1)
        res1.result.forEach((item1,index1) => {
            db.collection('tag').aggregate().match({
            tags:_.all([item1.name])
          }).end().then(res2 => {
            res2.list.forEach((item2,index2) => {
              item2.tagName = item1.name
              item2.count = item1.count
              classResult.push(item2)
            })
          })
        })
      })
    }).catch(res => {
      console.log(res)
    })
  },
  recommend(){
    var that = this
    var result = []
    for (let i in classResult) {
      var _class = {
        class_info: {},
        tags: [],
        count: 0
      }
      var index = ""
      var flag = 0
      for (let m in result) {
        if (result[m].class_info.teacher_name == classResult[i].class_info.teacher_name && result[m].class_info.course_name == classResult[i].class_info.course_name) {
          flag = 1
          index = m
          break
        }
        
      }
      if (flag == 0) {
        _class.class_info = classResult[i].class_info
        _class.count = classResult[i].count
        _class.tags.push(classResult[i].tagName)
        result.push(_class)
      } else {
        result[index].count = result[index].count + classResult[i].count
        result[index].tags.push(classResult[i].tagName)
      }
      
    }
    var recommendResult = []
    result.forEach((item) => {
      var flag = 0

      for(let i in userTag){
        // console.log(item.class_info)
        // console.log(userTag[i].class_info)
        if (item.class_info.teacher_name == userTag[i].class_info.teacher_name && item.class_info.course_name == userTag[i].class_info.course_name){
          console.log("flag=1")
          flag = 1
          break
        }

      }
      if (flag == 0) {
        recommendResult.push(item)
      }
    })
    console.log(recommendResult)
    recommendResult.forEach(async (item,index) => {
      console.log(item.class_info)
      await wx.cloud.callFunction({
        name:"letRecomendMore",
        data:{
          class_info:item.class_info
        }
      }).then(res => {
        console.log(res)
        recommendResult[index].comment = res.result.list
      }).catch(res => {
        console.log(res)
      })
        recommendResult = recommendResult.sort(that.compore('count'))
        this.setData({
        recommendResult:recommendResult,
        recommendShow: true
        })
    })
    
  },
  compore(p) {
    return function (m, n) {
      var a = m[p];
      var b = n[p];
      return b - a; //升序
    }
  }
})