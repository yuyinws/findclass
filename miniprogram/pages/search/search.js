const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify'
import { $wuxToptips } from '../../miniprogram_npm/wux-weapp/index'
const times = [
  ['空','星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  ['空','1', '2', '3','4','5','6','7','8','9','10','11','12','13'],
  ['空', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
]
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js';

Page({
  data:{
    active:"search",
    collegeNameColumns: [],
    collegeNameShow:false,
    collegeName:"",
    buildingNameColumns: [],
    buildingNameShow: false,
    buildingName: "",
    timeShow: false,
    time: "",
    courseName:"",
    teacherName:"",
    options:times,
    timeValue: ['空', '空', '空'],
    defaultValue:['空','空','空']
  },

  onLoad(){
    var that = this      
    db.collection('classinfo').aggregate().group({
      _id:'$college_name',
    }).limit(50).end().then(res=>{
      var collegeNameObj = res.list
      var collegeNameArr = []
      for (let i in collegeNameObj){
        //console.log(collegeNameObj[i]._id)
        collegeNameArr.push(collegeNameObj[i]._id)
      }
      console.log(collegeNameArr, typeof (collegeNameArr))
      that.setData({
        collegeNameColumns:collegeNameArr
      })
    })

    db.collection('classinfo').aggregate().group({
      _id:'$building_name',
    }).limit(50).end().then(res=>{
      //console.log(res)
      var buildingNameObj = res.list
      var buildingNameArr = []
      for (let i in buildingNameObj){
        if(buildingNameObj[i]._id!==null){
        buildingNameArr.push(buildingNameObj[i]._id)
        }
      }
      that.setData({
        buildingNameColumns:buildingNameArr
      })
    })

    db.collection('classinfo').aggregate().group({
      _id:'$week'
    }).end().then(res=>{
      console.log(res)
      var weekObj = res.list
      var weekArr = []
      for (let i in weekObj){
        if (weekObj[i]._id!==null){
        weekArr.push(weekObj[i]._id)
        }
      }
      that.setData({
        weekColumns:weekArr
      })
    })
  },
  search(){
    var searchObj={}
    var week = this.data.timeValue[0]
    var class_time = []
    class_time[0]=this.data.timeValue[1]
    class_time[1]=this.data.timeValue[2]
    if (this.data.collegeName.length > 0) { searchObj.college_name = this.data.collegeName }
    if (this.data.buildingName.length > 0){ searchObj.building_name =this.data.buildingName }
    if (this.data.courseName.length > 0) { searchObj.course_name = this.data.courseName }
    if (week!=="空"){ searchObj.week = week}
    if (class_time[0]!=="空"&&class_time[1]!=="空"){searchObj.class_time = '第'+class_time[0]+'-'+class_time[1]+'节' }
    if (class_time[0]!=="空"&&class_time[1]=="空"){searchObj.class_time = '第'+class_time[0]+'节'}
    if (class_time[0] == "空" && class_time[1] !== "空") { searchObj.class_time = '第'+class_time[1]+'节' }
    if (this.data.teacherName.length > 0){ searchObj.teacher_name = this.data.teacherName }
    var searchStr = JSON.stringify(searchObj)
    wx.navigateTo({
      url: '/pages/searchresult/searchresult?searchStr='+searchStr,
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
  collegeNameShowPopup() {
    this.setData({ collegeNameShow: true });
  },

  buildingNameShowPopup() {
    this.setData({ buildingNameShow: true });
  },

  timeShowPopup(){
    this.setData({ timeShow:true })
  },

  onClose() {
    this.setData({ 
      collegeNameShow: false,
      buildingNameShow:false,
      timeShow:false
      });
  },

  collegeNameOnConfirm(event) {
    this.setData({
      collegeName: event.detail.value,
      collegeNameShow:false
    })
  },
  buildingNameOnConfirm(event) {
    this.setData({
      buildingName: event.detail.value,
      buildingNameShow: false
    })
  },
  weekOnConfirm(event){
    this.setData({
      week:event.detail.value,
      weekShow:false
    })
  },
  onCancel() {
    this.setData({
      collegeNameShow:false,
      buildingNameShow:false
    })
  },

  reset(){
    this.setData({
      collegeName:"",
      buildingName:"",
      time:"",
      courseName:"",
      teacherName:""
    })
  },
  getCourseName(event){
    this.setData({
      courseName:event.detail
    })
  },
  getTeacherName(event){
    this.setData({
      teacherName:event.detail
    })
  },
  timeConfirm(e){
    var timeValue = this.data.timeValue
    var time = ""
    if (timeValue[0]==undefined){
      this.setData({
        timeValue:this.data.defaultValue
      })
      timeValue = this.data.defaultValue
    }
    console.log(timeValue[0],timeValue[1],timeValue[2])
    console.log(parseInt(timeValue[1]))
    if (timeValue[0] !== "空" && timeValue[1] !== "空" && timeValue[2] !== "空" && parseInt(timeValue[1]) < parseInt(timeValue[2])){
      time = timeValue[0]+'/第'+timeValue[1]+'-'+timeValue[2]+'节'
    } else if (timeValue[0] == "空" && timeValue[1] !== "空" && timeValue[2] !== "空" && parseInt(timeValue[1]) < parseInt(timeValue[2])){
      time = '第' + timeValue[1] + '-' + timeValue[2] + '节'
    } else if(parseInt(timeValue[1])>=parseInt(timeValue[2])){
      console.log("节次不合法")
      this.setData({
        defaultValue: ['空', '空', '空'],
        timeValue: ['空', '空', '空']
      })
      $wuxToptips().warn({
        hidden: false,
        text: '节次不合法，起始节次应小于终止节次',
        duration: 3000,
        success() { },
      })
      return
    } else if(timeValue[0] !=="空"&& timeValue[1] !== "空"&&timeValue[2]=="空"){
      time = timeValue[0]+'/第'+timeValue[1]+'节'
    } else if (timeValue[0] !== "空" && timeValue[1] == "空" && timeValue[2] !== "空"){
      time = timeValue[0] + '/第' + timeValue[2] + '节'
    } else if (timeValue[0] !== "空"&& timeValue[1]=="空"&&timeValue[2]=="空"){
      time =timeValue[0]
    } else if (timeValue[1] !== "空" && timeValue[2] == "空"){
      time = '第'+ timeValue[1]+'节'
    } else if (timeValue[1] == "空" && timeValue[2] !== "空"){
      time = '第' + timeValue[2] + '节'
    }
    this.setData({
      timeValue:timeValue,
      time:time,
      timeShow:false

    })
    console.log(this.data.timeValue)
  },
  onValueChange(e){
    console.log(e)
    var changeValue = this.data.timeValue
    changeValue[e.detail.index] = e.detail.value[e.detail.index]
    console.log(changeValue)
    this.setData({
      timeValue:changeValue
    })
    console.log(this.data.timeValue)

  }
})