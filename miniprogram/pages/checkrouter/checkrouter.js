Page({
  onLoad(){
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        wx.redirectTo({
          url: '/pages/personal/personal',
        })
      },
      fail:function(err){
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    })
  },
  data:{
    hidden:false
  }
})