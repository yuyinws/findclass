import {
  $wuxBackdrop
} from '../../miniprogram_npm/wux-weapp/index.js'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
const db = wx.cloud.database()
const globalFunction = getApp()
const _ = db.command
const $ = db.command.aggregate
var isLogin = false
let btnIndex = -1
const buttons = [{
    icon: "../../../style/icon/add-outline.png",
    label: "发布消息"
  },
  {
    icon: "../../../style/icon/grid-outline.png",
    label: "分类查看"
  },
  {
    icon: "../../../style/icon/my-market.png",
    label: "我的市场"
  }
]
Page({
  data: {
    active: 'market',
    scrollTop: 0,
    buttons,
    selectedTab: "0",
    sellList: [],
    wantedList: [],
    btnIndex,
  },

onShow(){
  console.log(getCurrentPages())
  wx.getStorage({
    key: 'userid',
    success: function (res) {
      console.log(res)
      isLogin = true
    },
  })
},

  onLoad() {
    this.$wuxBackdrop = $wuxBackdrop()
    var that = this
    db.collection('sell').count().then(res => {
      console.log(res)
    })
    db.collection('sell').get().then(res => {
      console.log(res.data)
      that.setData({
        sellList: res.data
      })
    }).catch(res => {
      console.log(res)
    })


  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  changeTabs(e) {
    this.setData({
      selectedTab: e.detail.index
    })

  },
  onChange(event) {
    console.log(event)
    this.setData({
      active: event.detail
    })
    let barName = event.detail
    wx.redirectTo({
      url: '/pages/' + barName + '/' + barName
    })
  },

  fabBtnOnClick(e) {
    if (this.$wuxBackdrop.backdropHolds == 1) {
      btnIndex = e.detail.index
      this.$wuxBackdrop.release()
    }
    if (e.detail.index == 0) {
      console.log("点击了发布")
      if ( isLogin ){
      wx.navigateTo({
        url: '/pages/editbook/editbook',
      })
      } else {
        Dialog.confirm({
          message: '此功能需要登录才能使用，是否前往授权登录？'
        }).then(() => {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }).catch(res => {
          
        });
      }
    }
    if (e.detail.index == 1) {
      console.log("点击了分类")
    }
    if (e.detail.index == 2) {
      console.log("点击了市场")
    }
  },

  fabBtnOnChange(e) {
    console.log(e)
    if (btnIndex !== -1) {
      btnIndex = -1
      return
    }
    if (this.$wuxBackdrop.backdropHolds == 1) {
      this.$wuxBackdrop.release()
      return
    }
    this.$wuxBackdrop.retain()
  },
  toTop(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  toBookDetail(e){
    wx.navigateTo({
      url: '/pages/bookdetail/bookdetail?bookid=' + e.currentTarget.dataset.id,
    })
  }
})