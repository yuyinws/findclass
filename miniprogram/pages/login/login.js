const db = wx.cloud.database()
const _ = db.command
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js';
const app = getApp()
var openid=""
var _id=""
Page({

  data:{
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hidden:true,
    loadingText:"",
    isUserInSQL:false
  },
  onShow(){
    wx.hideHomeButton()
  },
  onLoad(){
    this.checkUserIsInSQL()


  },

  checkUserIsInSQL(){
    var that = this
    wx.cloud.callFunction({
      name: "getOpenid",
    }).then(res => {
      console.log(res)
      db.collection('user').where({
        openid: res.result.openid
      }).get().then(res => {
        console.log(res)
        if (res.data.length == 1) {
          that.setData({
            hidden: true,
            isUserInSQL:true
          })
          openid=res.data[0].openid,
          _id=res.data[0]._id
          //Toast.success('登录成功!')
          // wx.redirectTo({
          //   url: '/pages/personal/personal',
          // })
        } else {
          that.setData({
            hidden: true
          })
          //Toast("请点击按钮进行授权登录")
        }
      })
    }).catch(res => {
      console.log(res)
    })
  },
  justLogin(){
      console.log('justlogin')
      wx.setStorage({
        key: 'userid',
        data: {
          openid: openid,
          _id: _id
        }
      })
      wx.getStorage({
        key: 'userid',
        success: function (res) {
          Toast.success("登录成功!")
          wx.redirectTo({
            url: '/pages/personal/personal',
          })
          console.log(res)
        },
        fail: function(err){
          console.log(err)
        }
      })
  },

  getUserInfo() {
    var that = this;
    that.setData({
      hidden:false,
      loadingText:"登录中..."
    })
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              wx.cloud.callFunction({
                name: 'userInfoToSQL',
                data: {
                  nickname: res.userInfo.nickName,
                  avatarurl: res.userInfo.avatarUrl,
                  country: res.userInfo.country,
                  gender: res.userInfo.gender,
                  province: res.userInfo.province,
                  city: res.userInfo.city
                }, success(res) {
                  wx.cloud.callFunction({
                    name: 'getOpenid',
                    success(res) {
                      db.collection('user').where({
                        openid: res.result.openid
                      }).get({
                        success: function (res) {
                          console.log(res)
                          if (res.data.length > 0) {
                            wx.setStorage({
                              key: 'userid',
                              data: {
                                openid: res.data[0].openid,
                                _id: res.data[0]._id
                              }
                            })
                            that.setData({
                              hidden:true
                            })
                            Toast.success("登录成功！")
                            wx.redirectTo({
                              url: '/pages/chooserecommend/chooserecommend',
                            })
                          }
                          else {
                            console.log("数据库中不存在此用户，需要进行授权登录")
                          }
                        }
                      })
                    }
                  })
                },fail(res){
                  Toast.fail("授权失败，请检查网络状态")
                  that.setData({
                    hidden: false
                  })
                }
              })
            },fail(res){
              Toast.fail("授权失败，请检查网络状态")
              that.setData({
                hidden: false
              })
            }
          })
        }
      },fail(res){
        Toast.fail("授权失败，请检查网络状态")
        that.setData({
          hidden: false
        })
      }
    })
  },
})