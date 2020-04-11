import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
Page({
  copyGithubUrl(){
    wx.setClipboardData({
      data: 'https://github.com/yuyinws/findclass',
      success(res){
        wx.hideToast()
        Dialog.alert({
          message: '已复制项目链接，请到浏览器中粘贴访问'
        }).then(() => {
          // on close
        });
      }
    })
  }
})

