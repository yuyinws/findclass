Page({
  data:{
    active:'recommend'
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
})