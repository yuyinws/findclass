const db = wx.cloud.database()
const _ = db.command
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast.js';
Page({
  data: {
    introduction: "",
    _id: "",
  },
  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'userid',
      success: function (res) {
        console.log(res)
        that.setData({
          _id: res.data._id,

        })
        db.collection('user').where({
          _id: res.data._id
        }).get({
          success: res => {
            console.log(res)
            that.setData({
              introduction: res.data[0].introduction,
            })
          }
        })
      },
    })
  },
  formSubmit: function (e) {
    var that = this
    var introduction = e.detail.value.introduction
    console.log(e)
    if (1) {
      wx.cloud.callFunction({
        name: 'updateIntroduction',
        data: {
          id: that.data._id,
          introduction: introduction
        },
        success: function (res) {
          console.log(res)
          Toast.success("个人简介更新成功!")
        },
        fail: function (res) {
          console.log(res)
          Toast.fail("个人简介更新失败！")
        }
      })
    }
  },
  formReset: function () {
  }
})