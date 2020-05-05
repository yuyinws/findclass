var openid = ""
const db = wx.cloud.database()
const _ = db.command
var sellSkip = 0
var limit = 10
var wantSkip = 0
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js';
Page({
  async onLoad(event){
    openid = event.openid
    var that = this
    this.getUserSell()
    this.getUserWant()
  },
  data:{
    sellList:[],
    wantList:[],
    isSellDataOver:false,
    isWantDataOver:false,
    active:0,
    defaultCover: "cloud://test-tkxjp.7465-test-tkxjp-1300603395/icon/defaultCover.jpg"

  },
   getUserSell(){
     var that = this
    db.collection('sell').where({
      openid:openid,
      isSell:0,
      type:'sell'
    })
      .orderBy('timestamp', 'desc').skip(sellSkip)
    .limit(limit)
    .get()
    .then(res => {
      console.log(res)
      var oldData = that.data.sellList
      var newData = res.data
      that.setData({
        sellList:oldData.concat(newData)
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
  getUserWant() {
    var that = this
    db.collection('sell').where({
      openid: openid,
      isSell: 0,
      type: 'want'
    })
      .orderBy('timestamp','desc')
      .skip(wantSkip)
      .limit(limit)
      .get()
      .then(res => {
        console.log(res)
        var oldData = that.data.wantList
        var newData = res.data
        that.setData({
          wantList: oldData.concat(newData)
        })
        if(res.data.length < 10){
          that.setData({
            isWantDataOver:true
          })
        }
      }).catch(err => {
        console.log(err)
      })
  },
  onReachBottom(){
    if(this.data.active == 0 && !this.data.isSellDataOver){
      sellSkip = sellSkip + limit
      this.getUserSell()
    }
  },
  onTabChange(event){
    console.log(event)
    this.setData({
      active:event.detail.index
    })
  },
  toDetailPage(event){
    wx.navigateTo({
      url: '/pages/bookdetail/bookdetail?bookid=' + event.currentTarget.dataset.id,
    })
  },
  deleteSell(event){
    var that = this
    Dialog.confirm({
      title: '操作确认',
      message: '删除操作不可逆，是否确认删除？'
    }).then(() => {
      wx.cloud.callFunction({
        name: "deleteSell",
        data: {
          id: event.currentTarget.dataset.id
        }
      }).then(res => {
        console.log(res)
        if (res.result.stats.removed == 1) {
          that.setData({
            sellList:[],
            isSellDataOver:false,
          })
          sellSkip=0
          that.getUserSell()
          Toast.success("删除成功")
        } else{
          Toast.fail("删除失败")
        }
      }).catch(res => {
        console.log(res)
      })
    }).catch(() => {
      // on cancel
    });

  }

})