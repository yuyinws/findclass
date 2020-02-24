var openid = ""
var bookName = ""
var originalPrice = ""
var sellPrice = ""
var contact = ""
var press = ""
var author = ""
const bookType = {
  '理学': ['大气科学', '地理', '地球物理', '地质学', '海洋科学', '化学', '力学', '生物', '数学', '物理', '统计学', '天文学', '心理学', '材料科学', '其他'],
  '工学': ['机器仪表类', '材料类', '测绘类', '地矿类', '电工电子类', '海洋工程类', '化工制药类', '航空航天类', '环境安全类', '交通运输类', '轻工制造类', '土木工程类', '能源动力类', '生物工程类', '其他'],
  '医学类': ['法医学', '护理学', '基础医学', '口腔医学', '临床医学与医学技术', '药学', '预防医学', '中医', '其他'],
  '农林类': [''],
  '计算机类': [''],
  '经济管理': ['MBA教材', '财政税收类', '电子商务类', '工商管理类', '会计审计类', '金融贸易类', '经济学', '人力资源管理类', '公共管理类', '其他'],
  '法学类': [''],
  '人文学类': ['新闻传播学', '汉语言文学', '教育学', '历史', '旅游', '社会学', '图书馆档案学', '外国语言文学', '哲学', '政治', '其他'],
  '艺术类': ['']
}
import { $wuxSelect } from '../../miniprogram_npm/wux-weapp/index'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify'
Page({
  data: {
    radio: 'sell',
    fileList: [],
    hidden: true,
    show: false,
    contactType: 1,
    selectedBookType: 1,
    loadingText: String,
    columns: [{
        values: Object.keys(bookType),
        className: 'column1'
      },
      {
        values: bookType['理学'],
        className: 'column2',
        defaultIndex: 0
      }
    ],
    options1: ['微信号', '手机号', 'QQ'],
    bookTypeErr: String,
    bookNameErr: String,
    pressErr: String,
    originalPriceErr: String,
    sellPriceErr: String,
    contactErr: String,
    authorErr:String,
    bookNameValue: String,
    pressValue: String,
    originalPriceValue: String,
    sellPriceValue: String,
    authorValue:String
  },

  

  onLoad() {
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        console.log(res)
        openid = res.data.openid
      },
      fail(res) {

      }
    })

  },
  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },
  afterRead(event) {
    this.setData({
      hidden: false,
      loadingText: "图片上传中"
    })
    var timestamp = (new Date()).valueOf();
    console.log(event, event.detail.file.path)
    const filePath = event.detail.file.path
    wx.cloud.uploadFile({
      cloudPath: 'sell/' + openid + '/' + timestamp + '.png',
      filePath: filePath,
      success: res => {
        console.log(res)
        var fileList = this.data.fileList
        fileList.push({
          url: res.fileID,
        })
        this.setData({
          fileList: fileList,
          hidden: true
        })
      },
      fail: res => {
        Toast.fail("图片上传失败")
      }
    })
  },
  deleteImg(res) {
    var fileIndex = res.detail.index
    var fileList = this.data.fileList
    Dialog.confirm({
      message: '是否删除图片'
    }).then(() => {
      wx.cloud.deleteFile({
        fileList: [fileList[fileIndex].url]
      }).then(res => {
        fileList.splice(fileIndex, 1)
        this.setData({
          fileList: fileList
        })
        Toast.success("删除成功")
      }).catch(res => {
        Toast.fail("删除失败")
      })
    }).catch(() => {
      // on cancel
    });


  },
  showPopup() {
    this.setData({
      show: true
    })
  },
  onConfirm(e) {
    console.log(e.detail.value)
    this.setData({
      selectedBookType: e.detail.value[0] + '-' + e.detail.value[1],
      show: false
    })
  },
  onCancel(e) {
    this.setData({
      show: false
    })
    console.log(e)
  },
  bookOnChange(event) {
    console.log(event)
    const {
      picker,
      value,
      index
    } = event.detail;
    picker.setColumnValues(1, bookType[value[0]]);
  },
  onUnload(res) {
    var imgFileList = this.data.fileList
    console.log(imgFileList)
    for (var i in imgFileList) {
      console.log(i, imgFileList[i].url)
      wx.cloud.deleteFile({
        fileList: [imgFileList[i].url],
        success: res => {
          console.log(res.fileList)
        },
        fail: console.error
      })
    }
  },
  showContent() {
    var that = this
    $wuxSelect('#wux-select1').open({
      value: this.data.value1,
      options: this.data.options1,
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        that.setData({
          contactType: value
        })
        if (index !== -1) {
          this.setData({
            value1: value,
            displayValue1: options[index],
          })
        }
      },
    })
  },

  uploadBook() {
    this.setData({
      bookNameErr: "",
      bookTypeErr: "",
      contactErr: "",
      originalPriceErr: "",
      sellPriceErr: "",
      pressErr: "",
      authorErr:""
    })
    var flag = 1
    var that = this
    if (this.data.selectedBookType == 1) {
      flag = 0
      this.setData({
        bookTypeErr: "请选择书籍类别"
      })
    }
    if (!bookName) {
      this.setData({
        bookNameErr: "不得为空"
      })
      flag = 0
    }
    if (!author) {
      this.setData({
        authorErr: "不得为空"
      })
      flag = 0
    }
    if (!press) {
      this.setData({
        pressErr: "不得为空"
      })
      flag = 0
    }
    if (!originalPrice) {
      this.setData({
        originalPriceErr: "不得为空"
      })
      flag = 0
    } else {
      var originalPriceStr = originalPrice + ""
      var originalPriceRegex =
        originalPriceStr.search(/(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/)
      console.log(originalPriceRegex)
      if (originalPriceRegex == -1) {
        this.setData({
          originalPriceErr: "请检查价格输入格式，小数点后至多2位"
        })
        flag = 0
      }
    }
    if (!sellPrice) {
      this.setData({
        sellPriceErr: "不得为空"
      })
      flag = 0
    } else {
      var sellPriceStr = sellPrice + ""
      var sellPriceRegex =
        sellPriceStr.search(/(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/)
      console.log(sellPriceRegex)
      if (sellPriceRegex == -1) {
        this.setData({
          sellPriceErr: "请检查价格输入格式，小数点后至多2位"
        })
        flag = 0
      }
    }
    if (!contact) {
      this.setData({
        contactErr: "不得为空"
      })
      flag = 0
    }
    if (this.data.contactType == 1) {
      this.setData({
        contactErr: this.data.contactErr + ' 请选择联系方式 '
      })
      flag = 0
    }
    if (flag) {
      console.log(this.data.fileList)
      if (!this.data.fileList.length) {
        Toast.fail("请上传至少一张图片")
      } else {
        Dialog.confirm({
          message: '是否发布？'
        }).then(() => {
          this.setData({
            hidden: false,
            loadingText: "上传中..."
          })
          sellPrice = that.returnFloat(sellPrice)
          originalPrice = that.returnFloat(originalPrice)
          var discount = ((sellPrice / originalPrice - 1) * -100).toFixed(0)
          wx.cloud.callFunction({
            name: 'addSellBook',
            data: {
              selectedbookType: that.data.selectedbookType,
              openid: openid,
              timestamp: new Date().getTime(),
              imgList: that.data.fileList,
              bookName: bookName,
              originalPrice: originalPrice,
              sellPrice: sellPrice,
              contactType: that.data.contactType,
              contact: contact,
              press: press,
              author:author,
              discount:discount
            }
          }).then(res => {
            console.log(res)
            this.setData({
              hidden: true
            })
            Dialog.confirm({
              message: '发布成功，是否跳转至交易市场？'
            }).then(() => {
              wx.navigateTo({
                url: '/pages/market/market',
              })
            }).catch(() => {
              that.setData({
                selectedBookType: 1,
                fileList: [],
                bookNameValue: "",
                pressValue: "",
                originalPriceValue: "",
                sellPriceValue: ""
              })
              bookName = ""
              press = ""
              originalPrice = ""
              sellPrice = ""

            });
          }).catch(res => {
            Toast.fail("上传失败:(")
          })
        }).catch(() => {
          // on cancel
        });

      }
    }
  },
  returnFloat(value) {
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
      value = value.toString() + ".00";
      return value;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value = value.toString() + "0";
      }
      return value;
    }
  },
  getBookName(e) {
    bookName = e.detail
  },
  getOriPrice(e) {
    originalPrice = e.detail
  },
  getSellPrice(e) {
    sellPrice = e.detail
  },
  getContact(e) {
    contact = e.detail
  },
  getPress(e) {
    press = e.detail
  },
  getAuthor(e){
    author = e.detail
    console.log(((sellPrice / originalPrice-1)*-100).toFixed(0))
  }

});