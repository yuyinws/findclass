const db = wx.cloud.database()
const _ = db.command
const app = getApp()
var user_id = ""
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js';
Page({
  data: {
    active:'personal',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickName:"",
    isExist:false,
    defaultAvatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    avatarUrl:"",
    openid:"",
    hidden:true,
    loadingText:""
  },
  onShow(){
    var that = this
    that.setData({
      hidden:false,
      loadingText:"请稍后..."
    })
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        console.log(res)
        user_id = res.data._id
        db.collection('user').where({
          openid:res.data.openid
        }).get().then(res => {
          console.log(res)

          if ( res.data.length == 1){
              that.setData({
                isExist:true,
                avatarUrl:res.data[0].avatarurl,
                nickName:res.data[0].nickname,
                openid:res.data[0].openid,
                hidden:true
              })
          } else {
            that.setData({
              hidden:true
            })
            //Toast("有bug")
          }
        })
      },fail(res){
        that.setData({
          hidden: true
        })
        Toast("需要进行登录")
      }
    })
  },
  onLoad: function () {

  },

goLogin(){
  wx.navigateTo({
    url: '/pages/login/login',
  })
},

EditInfo(){
  wx.navigateTo({
    url: '/pages/userinfo/userinfo'
  })
  console.log(this.data.openid)
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
  toMainPage(){
    wx.navigateTo({
      url: '/pages/mainpage/mainpage?id=' + user_id,
    })
  },
  toMyMarketPage(){
    var that = this
    wx.navigateTo({
      url: '/pages/mymarket/mymarket?openid=' + that.data.openid,
    })
  }
})