const db = wx.cloud.database()
const _ = db.command
var _id = ""
var openid = ""
var isStar = ""
var bookid = String
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'

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
    wantedPrice:String,
    starIcon:'../../style/icon/notstar.png',
    hidden:true,
    loadingText:String,
    bookType:"",
    remark:"",
    defaultCover: "cloud://test-tkxjp.7465-test-tkxjp-1300603395/icon/defaultCover.jpg",
    sellerOpenid:"",
    seller_id:"",
    contactType:"",
    contact:""

  },

  onShow(){
    var that = this 
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        _id=res.data._id;
        openid = res.data.openid
      },
    })
  },
  onLoad(e){
    var that = this
    bookid = e.bookid
    that.isStar();
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
        remark:info.remark,
        wantedPrice:info.wantedPrice,
        sellerOpenid:info.openid,
        contact: info.contact,
        contactType:info.contactType
      })
      db.collection('user').where({
        openid: that.data.sellerOpenid
      }).get().then(res => {
        that.setData({
          seller_id:res.data[0]._id
        })
      })
    }).catch(err => {
      console.log(err)
      Dialog.alert({
        message: '未找到此发布，可能已被发布者删除'
      }).then(() => {
        wx.navigateBack()
      });
    })
  },
  onChange(event) {
    var that = this
    if (event.detail == 0){
      this.changeStar()
    }
    if(event.detail == 1){
      wx.navigateTo({
        url: '/pages/mainpage/mainpage?id=' + that.data.seller_id,
      })
    }
    if(event.detail == 2){
      console.log(bookid,openid)
      db.collection('sell').where({
        _id:bookid
      }).get().then(res => {
        console.log(res)
        if(res.data[0].openid == openid){
          wx.navigateTo({
            url: '/pages/messagelist/messagelist?id=' + bookid,
          })
        }else{
          wx.navigateTo({
            url: '/pages/message/message?id=' + bookid,
          })
        }
      }).catch(res => {
        console.log(res)
      })

    }
    if(event.detail == 3){
      console.log(that.data.contact)
      if(that.data.contact.length == 0){
        Toast.fail("卖家未留下联系方式")
      }else{
        wx.setClipboardData({
          data: that.data.contact,
          success(res) {
            wx.hideToast()
            Dialog.alert({
              message: "已复制卖家的" + that.data.contactType
            }).then(() => {
              // on close
            });
          }
        })
      }
    }
  },
  
  isStar(){
    var that = this
    db.collection('user').where({
      star:_.all([bookid]),
      openid:'oeYuX5FdYTrutil9B1hfODovQFMo'
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
      console.log(_id,bookid);
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
  },

})