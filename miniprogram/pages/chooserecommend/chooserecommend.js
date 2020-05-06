const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
var tagResult = []
var allTagArr = []
var userid = ""
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'

Page({

  onShow(){
    wx.hideHomeButton()
  },
  data: {
    tags: [],
    disabled:true
  },
  async onLoad(){
    await this.getAllTag()
    await this.handelTags(tagResult)
    await this.computedTags()
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        userid = res.data._id
      },
    })
  },

  async getAllTag(){
    await db.collection('tag').aggregate()
    .limit(1000).end().then(res => {
      console.log(res)
      tagResult = res.list
    }).catch(res => {
      console.log(res)
    })
  },
  async handelTags(params){
    await params.forEach((item) => {
      allTagArr = allTagArr.concat(item.tags)
    }) 
  },
  async computedTags(){
    var that = this
    await wx.cloud.callFunction({
      name:"computedTags",
      data:{
        tagArr: allTagArr
      }
    }).then(res => {
      var tags = []
      res.result.forEach((item,index) => {
        if(index < 5){
          tags.push(
            { 
              tagName:item.name,
              active:false
            }
            )
        }
      })
      that.setData({
        tags:tags
      })
    }).catch(res => {
      console.log(res)
    })
  },
  chooseTag(event){
    var tag = 'tags['+event.currentTarget.dataset.index+'].active'
    var that = this
    this.setData({
      [tag]: !that.data.tags[event.currentTarget.dataset.index].active
    })
  },
  start(){
    var tags = []
    this.data.tags.forEach((item) => {
      if(item.active){
        tags.push(item.tagName)
      }
    })
    if(tags.length == 0){
      Dialog.confirm({
        message: '您还没有选择选择标签，是否确认进入系统？'
      }).then(() => {
        wx.redirectTo({
          url: '/pages/personal/personal',
        })
      }).catch(() => {
        // on cancel
      });
    } else{
      wx.cloud.callFunction({
        name: "addTag",
        data: {
          isExist: false,
          tags: tags,
          user_id: userid,
          class_info: 'systemDefault'
        }
      }).then(res => {
        wx.redirectTo({
          url: '/pages/personal/personal',
        })
      }).catch(res => {

      })

    }


  }
})