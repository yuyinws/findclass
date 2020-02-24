const db = wx.cloud.database()
const _ = db.command
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast.js';
Page({
  data: {
    subject: "",
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
              subject: res.data[0].subject,
            })
          }
        })
      },
    })
  },
  formSubmit: function (e) {
    var that = this
    var subject = e.detail.value.subject
    if (subject.length > 0) {
      wx.cloud.callFunction({
        name: 'updateSubject',
        data: {
          id: that.data._id,
          subject: subject
        },
        success: function (res) {
          console.log(res)
          that.setData({
            subject:subject
          })
          Toast.success("专业更新成功!")
        },
        fail: function (res) {
          console.log(res)
          Toast.fail("专业更新失败！")
        }
      })
    } else {
      console.log("长度不能为0")
    }
  },
  formReset: function () {
  }
})