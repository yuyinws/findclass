var openid = ""
var user_id = ""
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
var limit = 10
var sellSkip = 0
var postSkip = 0
Page({
  async onLoad(event){
    console.log(event)
    user_id = event.id
    await this.getUserInfo()
    this.getUserSell()
    this.getUserPost()
  },
  data:{
    userInfo:{},
    userSellList:[],
    postList:[],
    active:0,
    isSellDataOver:false,
    defaultCover:"cloud://test-tkxjp.7465-test-tkxjp-1300603395/icon/defaultCover.jpg"
  },
  async getUserInfo(){
    var that = this
    await db.collection('user').where({
      _id: user_id
    }).get().then(res => {
      console.log(res)
      wx.setNavigationBarTitle({
        title: res.data[0].nickname,
      })
      openid = res.data[0].openid
      that.setData({
        userInfo:res.data[0]
      })
    }).catch(res => {
      console.log(res)
    })
  },
  getUserSell(){
    var that = this
    db.collection('sell').where({
      openid:openid,
      isSell:0
    })
    .orderBy('timestamp', 'desc')
    .skip(sellSkip)
    .limit(limit)
    .get()
    .then(res => {
      console.log(res)
      let oldData = that.data.userSellList
      let newData = res.data
      that.setData({
        userSellList:oldData.concat(newData)
      })
      if(res.data.length < 10){
        that.setData({
          isSellDataOver:true
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  getUserPost(){
    var that = this
    console.log(user_id)
    wx.cloud.callFunction({
      name:"getPost",
      data:{
        user_id: user_id,
        skip:0
      }
    }).then(res => {
      console.log(res.result.list)
      that.setData({
        postList: res.result.list
      })
      
    }).catch(err => {
      console.log(err)
    })
  },
  onReachBottom(){
    console.log(1)
    if(this.data.isSellDataOver){
    } else{
      sellSkip = sellSkip + 10
      this.getUserSell()
    }
  },
  toDetailPage(event){
    console.log(event)
    if (event.currentTarget.dataset.type == "tag" || event.currentTarget.dataset.type == "comment"){
      wx.navigateTo({
        url: '/pages/classdetail/classdetail?searchStr='+JSON.stringify(event.currentTarget.dataset.id),
      })
    }else{
      wx.navigateTo({
        url: '/pages/bookdetail/bookdetail?bookid=' + event.currentTarget.dataset.id,
      })
    }
  }
})