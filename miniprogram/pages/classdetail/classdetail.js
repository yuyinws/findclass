const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
var rate = ""
var commentValue = ""
var classInfo = ""
var userId = ""
var tags = []
var utils = require('../../utils/utils.js') 
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
Page({
  data:{
    rate:"",
    activeName:"",
    classList:[],
    courseName:"课程名",
    tagsValue:"",
    teacherName:"老师名",
    hotTagList: [],
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
    var that = this
    var searchObj = JSON.parse(e.searchStr)
    classInfo = searchObj
    that.setData({
      courseName: searchObj.course_name,
      teacherName: searchObj.teacher_name
    })
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        userId = res.data._id
        that.getTagsValue()
        that.getUserHotTags()
        that.getClassTags()
      },
      fail(res){
        console.log(res)
      }
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
    ).catch(res => {
      console.log(res)
    })
  },
  getComment(){
    var that = this
    wx.cloud.callFunction({
      name: "getComment",
      data: {
        classInfo: classInfo
      }
    }).then(res => {
      for (var i in res.result.list) {
        res.result.list[i].timestamp = utils.timestampToDate(res.result.list[i].timestamp)
      }
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
    this.setData({
      tagsValue: e.detail.value
    })
  },
  addTagToText(e){
    console.log(e)
    var newTagsValue = []
    newTagsValue = this.data.tagsValue + ' ' + e.currentTarget.dataset.name
    this.setData({
      tagsValue: newTagsValue
    })
  },
  addTag(){
    var that = this
    var arr = this.data.tagsValue.trim().split(/\s+/)
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (newArr.indexOf(arr[i]) < 0) {
        newArr.push(arr[i]);
      }
    }
    tags = newArr
    var isExist = ""
    db.collection('tag').where({
      user_id:userId,
      class_info:classInfo
    }).count().then(res => {
      if(res.total == 0){
        isExist = 0
      } else {
        isExist = 1
      }
      wx.cloud.callFunction({
        name: "addTag",
        data: {
          isExist: isExist,
          user_id: userId,
          class_info:classInfo,
          tags: tags
        }
      }).then(res => {
        console.log(res)
        that.setData({
          favoriteShow:false
        })
      }).catch(res => {
        console.log(res)
      })
    })
  },
  getTagsValue(){
    var that = this
    db.collection('tag').aggregate().match({
      class_info:classInfo,
      user_id:userId
    }).end()
    .then(res => {
      var tags = ""
      for (var i in res.list[0].tags){
        tags = tags + ' ' +res.list[0].tags[i]
      }
      that.setData({
        tagsValue:tags
      })
    }).catch(res => {
      console.log(res)
    })
  },
  getClassTags(){
    var that = this
    wx.cloud.callFunction({
      name:"getClassTags",
      data:{
        class_info:classInfo
      }
    }).then(res => {
      console.log('getClassTags',res)
      let tagsArr = []
      for (let i in res.result.list) {
        tagsArr = tagsArr.concat(res.result.list[i].tags)
      }
      console.log(tagsArr)
      wx.cloud.callFunction({
        name: 'computedTags',
        data: {
          tagArr: tagsArr
        }
      }).then(res => {
        console.log(res)
        var hotTagList = []
        if (res.result.length < 6) {
          res.result.forEach((value) => {
            hotTagList.push(value.name)
          })
        } else {
          res.result.forEach((value, index) => {
            if (index < 5) {
              hotTagList.push(value.name)
            }
          })
        }
        that.setData({
          hotTagList: hotTagList
        })
      }).catch(res => {
        console.log(res)
      })
    }).catch(res => {
      console.log(res)
    })
  },
  getUserHotTags(){
    var that = this
    wx.cloud.callFunction({
      name:"getUserTags",
      data:{
        user_id:userId
      }
    }).then(res => {
      let tagsArr = []
      for(let i in res.result.list){
        tagsArr = tagsArr.concat(res.result.list[i].tags)
      }
      console.log(tagsArr)
      wx.cloud.callFunction({
        name:'computedTags',
        data:{
          tagArr:tagsArr
        }
      }).then(res=>{
        console.log(res)
        var myTagList = []
        if(res.result.length<6){
          res.result.forEach((value)=>{
            myTagList.push(value.name)
          })
        }else{
          res.result.forEach((value,index)=>{
            if(index<5){
              myTagList.push(value.name)
            }
          })
        }
        that.setData({
          myTagList:myTagList
        })
      }).catch(res => {
        console.log(res)
      })
      
    }).catch(res => {
      console.log(res)
    })
  },

})