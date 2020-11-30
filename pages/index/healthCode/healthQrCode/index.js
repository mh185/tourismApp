// pages/index/healthCode/healthQrCode/index.js
import QRCode from '../../../../utils/weapp-qrcode.js'
import { getHealthCode, getHealthUserInfo } from '../../../../utils/more/healthCode.js'
var app = getApp();
var token = app.globalData.token
Page({
  /**
   * 页面的初始数据
   */
  data: {
    documentType: '',
    name: '',
    idNo: '',
    health: '健康',
    passable: '可正常通行',
    healthCodes: {},//健康码信息
    cardType: '',
    usrToken:token,//用户token
  },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // 查看健康码
  onGetHealthCode() {
    getHealthCode().then((res) => {
      // console.log('res......', res)
      if(res.code == 200) {
        const r = res.data
        if (r.reason != null) {
          this.setData({
            health: r.reason
          })
        }
        if (r.color != "3") {
          this.setData({
            passable: '不可通行'
          })
        }
        const c = {
          IDENTITY_CARD: "身份证",
          PASSPORT: "护照",
          BACK_HOMETOWN_CARD: "回乡证",
          HOME_VISIT_PERMIT_TAIWAN: "台湾居民来往内地通行证",
          RESIDENCE_PERMIT_TAIWAN: "台湾居民居住证",
          HK_MC_CARD: "港澳当地政府颁发的身份证号码",
          HOME_VISIT_PERMIT_HK_MC: "港澳居民来往内地通行证",
          RESIDENCE_PERMIT_HK_MC: "港澳居民居住证",
          FOREIGN_PERMANENT_RESIDENT_ID_CARD: "中华人民共和国外国人永久居留身份证",
        }
        this.setData({
          healthCodes: r,
          cardType: c[r.cardType]
        })
        const colors = {
          1: 'res',
          2: 'yellow',
          3: 'green',
        }
        new QRCode('myQrcode', {
          text: `${r.codeId}${r.dueTime}`,
          width: 200,
          height: 200,
          padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
          colorDark: colors[r.color],
          colorLight: "white",
          correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
          callback: (res) => {
            console.log(res.path)
            // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
          }
        })

      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfoTwo()
    console.log(options)
    this.setData({
      documentType: options.documentType,
      name: options.name,
      idNo: options.idNo,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.onGetHealthCode()
    this.setData({
      usrToken:app.globalData.token
    })

  },
  //根据token获取健康码账户信息
  getUserInfoTwo(){
    getHealthUserInfo().then(res => {
      console.log('根据token获取账户信息....', res)
      if(res.code === 200){
        this.setData({
          userHealth: res.data
        })
        this.setData({
          checkInRecord: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})