//app.js

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-tkxjp',
        traceUser: true,
      })
    }
  },

  globalData:{
    isLogin:false
  },

  login(){
    const db = wx.cloud.database()
    const _ = db.command
    var that = this
    wx.cloud.callFunction({
      name: 'getOpenid',
      success(res) {
        db.collection('user').where({
          openid: res.result.openid
        }).get({
          success: function (res) {
            if (res.data.length == 1) {
              console.log("数据库中存在此用户")
              return 1
              that.globalData.isLogin = true
            } else {
              console.log("数据库中不存在此用户")
              return 1
            }
          }
        })
      }
    })
  }
})
