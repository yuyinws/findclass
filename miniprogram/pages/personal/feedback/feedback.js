var userid = ""
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast'
Page({
  data:{
    loading:false,
    contact:"",
    feedback:"",
    contactErr:"",
    feedBackErr:""

  },
  onLoad(){
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        userid = res.data._id
      },
    })
  },  
  getFeedBack(e){
    this.setData({
      feedback:e.detail
    })
  },
  getContact(e){
    this.setData({
      contact:e.detail
    })
  },
  confirm(){
    console.log(this.data.feedback.length)
    if(this.data.feedback.length == 0){
      this.setData({
        feedBackErr:"反馈不得为空"
      })
      return
    }else{
      this.setData({
        feedBackErr:""
      })
    }
    this.setData({
      loading:true
    })
    let that = this
    let contact = this.data.contact
    let feedback = this.data.feedback
    wx.cloud.callFunction({
      name:"setFeedBack",
      data:{
        user_id:userid,
        contact:contact,
        feedback:feedback
      }
    }).then(res => {
      that.setData({
        loading:false,
        contact:"",
        feedback:""
      })
      Toast.success("提交成功！")
    }).catch(res => {
      that.setData({
        loading: false
      })
      Toast.success("提交失败！")
    })
  }
})