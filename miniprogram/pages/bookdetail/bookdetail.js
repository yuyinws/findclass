const db = wx.cloud.database()
const _ = db.command
var bookid = String
Page({

  data:{
    isfavorite:false,
    imgList: [],
    author:String,
    bookName:String,
    timestamp:String,
    sellPrice:String,
    originalPrice:String,
    discount:String,
    press:String,
    remark:"这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注"
  },

  onLoad(e){
    var that = this
    bookid = e.bookid
    db.collection('sell').where({
      _id:bookid
    }).get().then(res => {
      console.log(res)
      var info = res.data[0]
      that.setData({
        imgList:info.imgList,
        author:info.author,
        bookName:info.bookName,
        timestamp:info.timestamp,
        sellPrice:info.sellPrice,
        originalPrice:info.originalPrice,
        discount:info.discount,
        press:info.press
      })
    })
  },
  test(e){
    console.log(e)
  }
})