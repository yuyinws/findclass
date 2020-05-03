var bookid=""
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
Page({
  onLoad(event){
    console.log(event)
    bookid = event.id
    this.getMessageList()
  },
  data(){
    messageList:[]
  },
  getMessageList(){
    var that = this
    wx.cloud.callFunction({
      name:"getMessageList",
      data:{
        book_id:bookid
      }
    }).then(res => {
      console.log(res)
      that.setData({
        messageList:res.result.list
      })
    }).catch(res => {
      console.log(res)
    })
  },
  toMessagePage(event){
    let buy_id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/message/message?buy_id=' + buy_id + '&id=' + bookid,
    })

  }
})