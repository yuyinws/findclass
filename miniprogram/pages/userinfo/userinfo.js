const db = wx.cloud.database()
const _ = db.command
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js';
Page({
  data:{
    avatarUrl:"",
    openid:"",
    fileid:"",
    _id:"",
    loadingText:"",
    hidden:true,
    nickname:"",
    show:false,
    city:"居住城市",
    subject:"你的专业",
    areaList:{},
    areaListLoding:"false",
    cityCode:""
  },


  onShow: function (options) {
    this.setData({
      loadingText:"资料加载中",
      hidden:false
    })
    var that = this
    var openid = ""
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        console.log(res)
        openid = res.data.openid
        db.collection('user').where({
          openid: openid
        }).get({
          success: function (res) {
            console.log(res)
            that.setData({
              _id: res.data[0]._id,
              openid: res.data[0].openid,
              avatarUrl: res.data[0].avatarurl,
              nickname: res.data[0].nickname,
              city: res.data[0].mycity,
              subject: res.data[0].subject,
              cityCode:res.data[0].cityCode,
              hidden:true
            })
          }
        })
      },
    })
  },
  getAreaList() {
    this.setData({
      areaListLoding:true
    })
    var areaList = {}
    wx.request({
      url: 'https://cashier.youzan.com/wsctrade/uic/address/getAllRegion.json',
      success:res=>{
        areaList.province_list = res.data.data.province_list
        areaList.city_list = res.data.data.city_list
        areaList.county_list = res.data.data.county_list
        this.setData({
          areaList:areaList,
          areaListLoding:false
        })
      }
    })
  },
  EditAvatar(){
    var that = this
    console.log(this.data.openid)
    wx.chooseImage({
      success: function(res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths[0]
        wx.cloud.uploadFile({
          cloudPath:'avatar/'+that.data.openid+'.png',
          filePath: tempFilePaths,
          success:function(res){
            that.setData({
              loadingText:"头像上传中...",
              hidden:false
            })
            console.log(res)
            wx.cloud.callFunction({
              name:'updateAvatarUrl',
              data:{
                id:that.data._id,
                avatarurl:res.fileID
              },
              success:function(res){
                console.log(res)
                that.setData({
                  hidden:true
                })
                Toast.success("头像上传成功,更新需要一段时间")
              },
            })
          },
          fail:function(res){
            Toast.fail("头像上传失败")
          }

        })
      },
    })
  },
  EditNickName(){
    wx.navigateTo({
      url: '/pages/edituserinfo/editname/editname'
    })
  },
  EditIntroduction(){
    wx.navigateTo({
      url: '/pages/edituserinfo/editintroduction/editintroduction',
    })
  },
  EditSubject(){
    wx.navigateTo({
      url: '/pages/edituserinfo/editsubject/editsubject',
    })
  },
  getCity(e){
    var that = this
    console.log(e.detail.values)
    var mycity = e.detail.values[0].name + '-' + e.detail.values[1].name + '-' + e.detail.values[2].name
    var cityCode = e.detail.values[2].code
    console.log(mycity,cityCode)
    wx.cloud.callFunction({
      name:'updateCity',
      data:{
        id:this.data._id,
        mycity:mycity,
        cityCode:cityCode
      },success(res){
        console.log(res)
        that.setData({
          city:mycity,
          cityCode:cityCode,
          show:false
        })
      }
    })
  },
  showPopup() {
    this.setData({ show: true });
    this.getAreaList()
  },

  onClose() {
    this.setData({ show: false });
  }
 
})