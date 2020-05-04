var bookid = ""
var sellId = ""
var sendId = ""
var buyId = ""
const db = wx.cloud.database()
const globalFunction = getApp()
const _ = db.command
const $ = db.command.aggregate
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js';
Page({
  async onLoad(event){
    console.log(event)
   bookid = event.id
   await this.getSellId()
   await this.getSendId()
   if(event.buy_id){
      buyId = event.buy_id
    }else{
      buyId = sendId
    }
   await this.getMessageRecord()
   //await this.pageScrollToBottom()
  },

  data(){
    message:""
    messageList:[]
    openid:""
  },

  getSellId(){
    db.collection('sell').where({
      _id:bookid
    }).get().then(res => {
      sellId = res.data[0].openid
    }).catch(res => {
      console.log(res)
    })
  },
  getSendId(){
    var that = this
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        sendId = res.data.openid
        that.setData({
          openid:res.data.openid
        })
      },
    })
  },
  getMessage(event){
    this.setData({
      message:event.detail
    })
  },
  async sendMessage(){
    if(this.data.message.length == 0){
      console.log("不能为空")
    }else{

      wx.cloud.callFunction({
        name:"addMessage",
        data:{
          message: this.data.message,
          send_id: sendId,
          sell_id:sellId,
          book_id:bookid,
          buy_id:buyId
        }
      }).then(res => {
        this.getMessageRecord()
        this.setData({
          message:""
        })
        Toast.success("回复留言成功!")
      }).catch(res => {
        console.log(res)
      })
    }
  },
  getMessageRecord(){
    var that = this
    wx.cloud.callFunction({
      name:"getMessageRecord",
      data:{
        book_id:bookid,
        buy_id:buyId
      }
    }).then(res => {
      that.setData({
        messageList: res.result.list
      })
      that.pageScrollToBottom()
    }).catch(res => {
      console.log(res)
    })
  },
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#message-page').boundingClientRect(function (rect) {
      console.log(rect)
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
  },

})