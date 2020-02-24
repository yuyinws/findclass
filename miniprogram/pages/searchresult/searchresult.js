const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate


Page({
  data:{
    result:"",
    isViewShowArr:[],
    hidden:true,
    searchArr:[],
    count:0,
    total:"",
    isMoreCourse:true,
    searchObj:{},

  },
  onLoad(e){
    var isViewShowArr = []
    var that = this
    var searchObj = JSON.parse(e.searchStr)
    //var searchObj = {course_name:"马克思"}
    console.log(searchObj)
    var searchArr = []
    this.setData({
      hidden: false,
      searchObj:searchObj
    })
    for (var j in searchObj) {
      searchArr.push(searchObj[j])
    }
    this.setData({
      searchArr: searchArr
    })

    if(searchObj.course_name!==undefined){
      console.log("courseName")
      var courseName = searchObj.course_name
      searchObj.course_name={
        $regex:'.*'+ courseName + '.*',
        $options:'i'
      }
    }

    if (searchObj.class_time!=undefined) {
      console.log("classTime")
      var courseTime = searchObj.class_time
      searchObj.class_time = {
        $regex: '.*' + courseTime + '.*',
        $options: 'i'
      }
    }
    
    db.collection('classinfo').where(searchObj).count().then(res=>{
      for (var i=0;i<res.total;i++){
        isViewShowArr.push(0)
      }
      that.setData({
        isViewShowArr:isViewShowArr,
        total: res.total
      })
      console.log(isViewShowArr)
      db.collection('classinfo').where(searchObj).get({
        success(res){
          console.log(res.data)
          that.setData({
            result:res.data,
            hidden:true
          })
        },fail(res){
          console.log(res)
        }
      })
    }).catch(res=>{
      console.log(res)
    })
  },
  changeIsViewShow(e){
    console.log(e)
    var index = e.currentTarget.dataset.index
    var isShow = this.data.isViewShowArr
    if (isShow[index]==0){
      isShow[index]=1
      this.setData({
        isViewShowArr:isShow
      })
    }else{
      isShow[index]=0
      this.setData({
        isViewShowArr: isShow
      })
    }
  },
  onReachBottom(){
    var searchObj = this.data.searchObj
    this.setData({
      hidden:false
    })
    var newData = []
    var that = this
    console.log(this.data.total)
    var count = this.data.count+20
    if (this.data.total<count){
      this.setData({
        hidden:true,
        isMoreCourse:false
      })
      return
    }
    db.collection('classinfo').where(searchObj).skip(count).get({
      success:function(res){
        console.log(res)
        for (let i in res.data){
          newData.push(res.data[i])
        }
        var oldData = that.data.result
        that.setData({
          result:oldData.concat(newData),
          count:count,
          hidden:true
        })
      }
    })

  },
  test(){
    db.collection("classinfo").where({
      course_name: {
        $regex: '.*数学.*',
        $options:'i'
      }
    }).get({
      success:function(res){
        console.log(res) 
      },
      fail(res){
        console.log(res)
      }
    })
  },
  checkCourseDetail(){

  },
  touchStart(e){
    console.log(e)
  }
})