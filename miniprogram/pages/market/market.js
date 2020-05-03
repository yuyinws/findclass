import {
  $wuxBackdrop
} from '../../miniprogram_npm/wux-weapp/index.js'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js';
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
    selectedTab:0,
    sellList: [],
    wantedList: [],
    btnIndex,
    defaultCover:"cloud://test-tkxjp.7465-test-tkxjp-1300603395/icon/defaultCover.jpg",
    option1: [
      { text: '发布时间', value: 'timestamp' },
      { text: '价格', value: 'sellPrice' },
      { text: '折扣', value: 'discount' }
    ],
    option2: [
      { text: '升序', value: 'asc' },
      { text: '降序', value: 'desc' },
    ],
    value1: 'timestamp',
    value2: 'desc'
  },

onShow(){
  wx.getStorage({
    key: 'userid',
    success: function (res) {
      console.log(res)
      isLogin = true
    },
  })
  this.$wuxBackdrop = $wuxBackdrop()
  var that = this
  db.collection('sell').where({
    type: "sell"
  }).count().then(res => {
    console.log(res)
  })
  db.collection('sell').where({
    type: "want"
  }).count().then(res => {
    console.log(res)
  })
    this.getSellBookList(this.data.value1, this.data.value2)
    this.getWantedBookList(this.data.value1, this.data.value2)
},

  onLoad() {
    // this.$wuxBackdrop = $wuxBackdrop()
    // var that = this
    // db.collection('sell').where({
    //   type:"sell"
    // }).count().then(res => {
    //   console.log(res)
    // })
    // db.collection('sell').where({
    //   type:"want"
    // }).count().then(res => {
    //   console.log(res)
    // })
    // this.getSellBookList(this.data.value1, this.data.value2)
    // this.getWantedBookList(this.data.value1, this.data.value2)

  },
  item1(e){
    this.setData({
      value1:e.detail
    })
    if(this.data.selectedTab == 0){
      this.getSellBookList(this.data.value1, this.data.value2)
    }else{
      this.getWantedBookList(this.data.value1, this.data.value2)
    }
    
  },
  item2(e){
    this.setData({
      value2:e.detail
    })
    if (this.data.selectedTab == 0) {
      this.getSellBookList(this.data.value1, this.data.value2)
    } else {
      this.getWantedBookList(this.data.value1, this.data.value2)
    }
  },
  getSellBookList(v1,v2){
    //desc 降序 asc 升序
    db.collection('sell').orderBy(v1,v2).where({
      type: "sell"
    }).get().then(res => {
      console.log(res.data)
      this.setData({
        sellList: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  },
  getWantedBookList(v1,v2){
    console.log(v1,v2)
    db.collection('sell').orderBy(v1,v2).where({
      type:"want"
    }).get().then(res => {
      console.log(res.data)
      this.setData({
        wantedList:res.data
      })
    }).catch(err => {
      console.log(err)
    })
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  changeTabs(e) {
    console.log(e)
    let optionArr1 = [{ text: '发布时间', value:'timestamp' },
                      { text: '价格', value:'sellPrice' },
                      { text: '折扣', value: 'discount' }]
    let optionArr2 = [{ text: '发布时间', value: 'timestamp' },
                      { text: '价格', value: 'wantedPrice' }]
    if(e.detail.index == 0){
      this.setData({
        option1: optionArr1
      })
    }
    if(e.detail.index == 1){
      this.setData({
        option1: optionArr2,
        value1:'timestamp'
      })
    }
    this.setData({
      selectedTab: e.detail.index
    })

    if (this.data.selectedTab == 0) {
      this.getSellBookList(this.data.value1, this.data.value2)
    } else {
      this.getWantedBookList(this.data.value1, this.data.value2)
    }
    

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
  },
  handleChange(e){
    this.setData({
      searchKey:e.detail
    })
  },
  search(){
    let key = this.data.searchKey
    let type = ""
    if(this.data.selectedTab == 0){
      type = 'sell'
    }else{
      type = 'want'
    }
    db.collection('sell').where({
      type:type,
      bookName: db.RegExp({
        regexp: '.*' + key + '.*',
        opitions: 'i',
      })
    }).get().then(res => {
      console.log(res)
      if(res.data.length == 0){
        Toast.fail("未找到搜索结果")
      }else{
        if(type == 'sell'){
          this.setData({
            sellList:res.data
          })
        }else{
          this.setData({
            wantedList:res.data
          })
        }

      }

    }).catch(res => {
      console.log(res)
    })
  },
  queryAll(){
    this.getSellBookList(this.data.value1, this.data.value2)
    this.getWantedBookList(this.data.value1, this.data.value2)
  }
})