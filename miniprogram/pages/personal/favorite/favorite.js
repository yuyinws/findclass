var user_id = ""
var openid = ""
const db = wx.cloud.database()
Page({
  onLoad(){
    var that = this
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        user_id = res.data._id
        openid = res.data.openid
        that.getUserFavoriteClass()
        that.getUserStar()
        that.getUserTag()
      },
    })
  },
  data:{
    active:0,
    classList:[],
    starList:[],
    tagList:[],
    loadingText:"加载中...",
    hidden:false
  },
  getUserFavoriteClass(){
    var that = this
    that.setData({
      hidden:true
    })
    wx.cloud.callFunction({
      name:"getUserTags",
      data:{
        user_id:user_id,
      }
    }).then(res => {
      that.setData({
        classList:res.result.list,
        hidden:false
      })
    }).catch(res => {
      console.log(res)
      that.setData({
        hidden: false
      })
    })
  },
  getUserFavoriteClassByTag(tag){
    var that = this;
    console.log(tag,user_id)
    wx.cloud.callFunction({
      name: "getUserClassByTag",
      data: {
        user_id: user_id,
        tag:tag
      }
    }).then(res => {
      console.log(res)
      that.setData({
        classList: res.result.list
      })
    }).catch(res => {
      console.log(res)
    })
  },
  getUserStar(){
    var that = this
    db.collection('user').where({
      _id:user_id
    }).get().then(res => {
      let starInfoArr = []
      const starArr = res.data[0].star
      for(var i in starArr){
        console.log(starArr[i])
        db.collection('sell').doc(starArr[i]).get().then(res => {
          starInfoArr.push(res.data)
          if(starInfoArr.length == starArr.length){
            that.setData({
              starList:starInfoArr
            })
          }
        }).catch(res => {
          console.log(res)
        })
      }
    }).catch(res => {
      console.log(res)
    })
  },
  getUserTag(){
    var that = this;
    wx.cloud.callFunction({
      name:"getUserTag",
      data:{
        user_id:user_id
      }
    }).then(res => {
      let tagArr = [];
      res.result.list.forEach((item,index) => {
        item.tags.forEach((item2,index2) => {
          if(tagArr.indexOf(item2) == -1){
            tagArr.push({name:item2,active:true})
          }
        })
      })
      tagArr.unshift({name:"所有",active:false})
      that.setData({
        tagList:tagArr
      })

    }).catch(res => {
      console.log(res)
    })
  },
  checkCourseDetail(e){
    let searchStr = JSON.stringify(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/classdetail/classdetail?searchStr=' + searchStr
    })
  },
  clickTag(event){

    var that = this;
    var tagArr = this.data.tagList;
    for(let i in tagArr){
      tagArr[i].active = true;
    }
    tagArr[event.currentTarget.dataset.index].active = false;
    this.setData({
      tagList:tagArr
    })
    if(event.currentTarget.dataset.tag_name == '所有'){
      this.getUserFavoriteClass();
    } else{
      this.getUserFavoriteClassByTag(event.currentTarget.dataset.tag_name);
    }
    
  },
  toBookDetail(e){
    wx.navigateTo({
      url: '/pages/bookdetail/bookdetail?bookid=' + e.currentTarget.dataset.id,
    })
  }
})