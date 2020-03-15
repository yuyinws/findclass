const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
var rate = ""
var commentValue = ""
var classInfo = ""
var userId = ""
var utils = require('../../utils/utils.js') 
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
Page({
  data:{
    rate:"",
    activeName:"",
    classList:[],
    courseName:"课程名",
    tags:"",
    teacherName:"老师名",
    hotTagList: ["标签1", "标签2", "标签3", "111", "222", "333", "标签1", "标签2", "标签3"],
    myTagList:[],
    activeNames:"",
    favoriteShow:false,
    show:false,
    comment:"",
    textCount:0,
    hidden:true,
    loadingText:"",
    commentList:[],
    averageRate:"",
    rateCount:"",
    commentLimit:0

  },
  onLoad(e){
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        userId = res.data._id
      },
      fail(res){
        console.log(res)
      }
    })
    var that = this
    var searchObj = JSON.parse(e.searchStr)
    console.log(searchObj)
    classInfo = searchObj
    that.setData({
      courseName:searchObj.course_name,
      teacherName:searchObj.teacher_name
    })
    db.collection('classinfo').aggregate().match(searchObj).end().then(
      res => {
        var name = 0
        for (let i in res.list){
          res.list[i].name = name
          name = name + 1
        }
        that.setData({
          classList:res.list
        })
        that.getComment()
        that.getRate()
      } 
    )
  },
  getComment(){
    var that = this
    wx.cloud.callFunction({
      name: "getComment",
      data: {
        classInfo: classInfo
      }
    }).then(res => {
      console.log(res) 
      for (var i in res.result.list) {
        res.result.list[i].timestamp = utils.timestampToDate(res.result.list[i].timestamp)
      }
      console.log(res.result.list)
      that.setData({
        commentList: res.result.list,
        commentLimit: res.result.list.length
      })
    }).catch(res => {
      console.log(res)
    })
  },
  getRate(){
    var that = this
    db.collection('comment').aggregate().match({
      class_info:classInfo
    }).end().then(res=>{
      console.log('rate',res)
      if (res.list.length===0){
        that.setData({
          rateCount:0,
          averageRate:0,
          rate:0
        })
      } else{
      var totalRate = 0
      for (var i in res.list){
        totalRate = totalRate + res.list[i].rate
      }
      var averageRate = (totalRate/res.list.length).toFixed(1)
      that.setData({
        rateCount:res.list.length,
        averageRate: averageRate,
        rate: averageRate
      })
      }
    }).catch(res=> {
      console.log('rate',res)
    })
    
  },
  onChange(event) {
    console.log(event)
    if (event.detail === "comment"){
      this.setData({
        show: true
      })
    }
    if (event.detail === "favorite"){
      this.setData({
        favoriteShow:true
      })
    }
  },
  onChange2(e){
    console.log(e)
    this.setData({
      activeNames:e.detail
    })
  },
  changeComment(e){
    console.log(e)
    this.setData({
      activeName: e.detail
    });
  },
  tagClick(e){
    console.log(e)
  },
  showPopup(){
    this.setData({
      show:true
    })
  },
  onChangeRate(e){
    rate = e.detail;
  },
  getCommentText(e){
    var length =  e.detail.length;
    this.setData({
      textCount:length
    })
    commentValue = e.detail;
  },
  close(){
    this.setData({
      show:false,
      favoriteShow:false
    })
  },
  confirm(){
    var that = this
    var timestamp = Date.parse(new Date());
    if (rate.length === 0||commentValue.length === 0){
      Toast.fail("请完善内容！")
    } else {
      that.setData({
        hidden:false,
        loadingText:"上传中..."
      })
      wx.cloud.callFunction({
        name:"addComment",
        data:{
          classInfo:classInfo,
          userId:userId,
          rate:rate,
          comment:commentValue,
          timestamp: timestamp
        }
      }).then( res=> {
        Toast.success("评论发表成功!")
        that.setData({
          show:false,
          hidden:true
        })
        that.getComment()
        that.getRate()
      }).catch( res=> {
        that.setData({
          hidden: true
        })
        Toast.fail("评论发表失败!")
      })
    }
  },
  getTags(e){
    console.log(e)
  }
})