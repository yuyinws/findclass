const db = wx.cloud.database()
const _ = db.command
var _id = String
var isStar = ""
var bookid = String
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
Page({

  data:{
    isfavorite:false,
    imgList: [],
    author:String,
    bookName:String,
    timestamp:String,
    sellPrice:String,
    originalPrice:String,
    discount:String,
    press:String,
    starIcon:'../../style/icon/notstar.png',
    hidden:true,
    loadingText:String,
    bookType:"",
    remark:""
  },

  onShow(){
    var that = this 
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        console.log(res.data._id)
        _id = res.data._id
        that.isStar()
        
      },
    })
  },
  onLoad(e){
    var that = this
    bookid = e.bookid
    db.collection('sell').where({
      _id:bookid
    }).get().then(res => {
      console.log(res)
      var info = res.data[0]
      that.setData({
        imgList:info.imgList,
        author:info.author,
        bookName:info.bookName,
        timestamp:info.timestamp,
        sellPrice:info.sellPrice,
        originalPrice:info.originalPrice,
        discount:info.discount,
        press:info.press,
        bookType:info.bookType,
        timestamp:info.timestamp,
        remark:info.remark
      })
      
    })
  },
  onChange(event) {
    console.log(event.detail)
    if (event.detail == 0){
      this.changeStar()
    }
  },
  
  isStar(){
    var that = this
    db.collection('user').where({
      star:bookid,
      _id: _id
    }).get().then(res => {
      console.log(res)
      if (res.data.length==1){
        isStar = true
        that.setData({
          starIcon:"../../style/icon/isstar.png"
        })
      } else {
        isStar = false
        that.setData({
          starIcon: "../../style/icon/notstar.png"
        })
      }
    }).catch(res => {
      console.log("云函数调用失败",res)
    })
  },

  changeStar(){
    var that = this
    if (isStar){
      that.setData({
        hidden:false,
        loadingText:"取消收藏中..."
      })
      db.collection('user').doc(_id).get().then( res=> {
        console.log(res.data.star)
        var oldStarArr = res.data.star
        var newStarArr = []
        for ( var i in oldStarArr){
          if (oldStarArr[i]!==bookid){
            newStarArr.push(oldStarArr[i])
          }
        }
        wx.cloud.callFunction({
          name: "removeStar",
          data: {
            _id: _id,
            star: newStarArr
          }
        }).then(res => {
          that.isStar()
          that.setData({
            hidden: true
          })
          Toast.success("取消收藏成功!")

        }).catch(res => {
          console.log(res)
          that.setData({
            hidden: true
          })
          Toast.fail("取消收藏失败!")
        })
      }).catch(res => {
        console.log(res)
        that.setData({
          hidden: true
        })
        Toast.fail("取消收藏失败!")
      })

  } else {
      that.setData({
        hidden: false,
        loadingText: "添加收藏中..."
      })
    wx.cloud.callFunction({
      name:"addStar",
      data:{
        _id:_id,
        bookId:bookid
      }
    }).then(res => {
      that.isStar()
      that.setData({
        hidden: true
      })
      Toast.success("添加收藏成功!")
    }).catch(res => {
      console.log(res)
      that.setData({
        hidden: true
      })
      Toast.success("添加收藏失败!")
    })
  }
  }

})