const db = wx.cloud.database()
const _ = db.command
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast.js';
Page({
  data:{
    nickname:"",
    _id:"",
  },
  onLoad:function(){
    var that = this
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        console.log(res)
        that.setData({
          _id:res.data._id,

        })
        db.collection('user').where({
          _id:res.data._id
        }).get({
          success:res=>{
            console.log(res)
            that.setData({
              nickname:res.data[0].nickname,
            })
          }
        })
      },
    })
  },
  formSubmit: function (e) {
    var that = this
    var nickname = e.detail.value.nickname
    if (nickname.length > 0){
      wx.cloud.callFunction({
        name:'updateNickName',
        data:{
          id:that.data._id,
          nickname:nickname
        },
        success:function(res){
          console.log(res)
          Toast.success("昵称更新成功!")
        },
        fail:function(res){
          console.log(res)
          Toast.fail("昵称更新失败！")
        }
      })
    }else{
      console.log("长度不能为0")
    }
  },
  formReset: function () {
  }
})