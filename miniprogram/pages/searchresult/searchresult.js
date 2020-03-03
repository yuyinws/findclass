const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate

Page({
  data:{
    result:"",
    aggregateCount:0,
    aggregateTotal:"",
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
    var searchObj =JSON.parse(e.searchStr)
    //var searchObj = {course_name:"高等数学"}
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

      that.setData({

        total: res.total
      })
      db.collection('classinfo').aggregate().match(searchObj).group({
        _id: {
          course_name: '$course_name',
          teacher_name: '$teacher_name'
        },
        count: $.sum(1)
      }).limit(30).end().then(res => {
        console.log(res)
        that.setData({
          result:res.list
        })
        db.collection("classinfo").aggregate().match(searchObj).group({
          _id: {
            course_name: '$course_name',
            teacher_name: '$teacher_name'
          }
        }).group({
          _id: null,
          count: $.sum(1),
        }).end().then(res => {
          that.setData({
            aggregateTotal: res.list[0].count,
            hidden:true,
          })
          console.log(res.list[0].count)
        })
      })
      
     })


    
  },
  onReachBottom(){
    var searchObj = this.data.searchObj
    this.setData({
      hidden:false
    })
    var newData = []
    var that = this
    console.log(this.data.aggregateCount)
    var count = this.data.aggregateCount+30
    console.log(count)
    if (this.data.aggregateTotal<count){
      this.setData({
        hidden:true,
        isMoreCourse:false
      })
      return
    }
    db.collection('classinfo').aggregate().match(searchObj).group({
      _id: {
        course_name: '$course_name',
        teacher_name: '$teacher_name'
      },
      count:$.sum(1)
    }).skip(count).limit(30).end().then(res => {
      console.log(res.list)
      for( let i in res.list){
        newData.push(res.list[i])
      }
      var oldData = that.data.result
      that.setData({
         result:oldData.concat(newData),
         aggregateCount:count,
         hidden:true
      })
    })
  },

  checkCourseDetail(e){
    console.log(e)
    let searchStr = JSON.stringify(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/classdetail/classdetail?searchStr=' + searchStr
    })
  },
})