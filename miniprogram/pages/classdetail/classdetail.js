const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
Page({
  data:{
    rate:3.5,
    activeName:"",
    classList:[],
    courseName:"课程名",
    teacherName:"老师名",
    tagList:["标签1","标签2","标签3"],
    activeNames:""
  },
  onLoad(e){
    console.log(e)
    //var searchStr = { course_name: "高等数学B2", teacher_name: "尹志强" }
    var that = this
    var searchObj = JSON.parse(e.searchStr)
    that.setData({
      courseName:searchObj.course_name,
      teacherName:searchObj.teacher_name
    })
    db.collection('classinfo').aggregate().match(searchObj).end().then(
      res => {
        console.log(res.list)
        var name = 0
        for (let i in res.list){
          res.list[i].name = name
          name = name + 1
        }
        that.setData({
          classList:res.list
        })
      } 
    )
  },
  onChange(event) {
    console.log(event)
    this.setData({
      activeNames: event.detail
    });
  },
  changeComment(e){
    console.log(e)
    this.setData({
      activeName: e.detail
    });
  },
  tagClick(e){
    console.log(e)
  }
})