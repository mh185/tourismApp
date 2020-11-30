// pages/index/healthCode/index.js
import { getRealAuth, registRealAuth } from '../../../utils/more/healthCode.js'
var app = getApp();
const iconUrl = app.globalData.iconUrl;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPicker:false,
    columns: ['身份证', '护照', '回乡证', '台湾居民来往内地通行证', '台湾居民居住证', '港澳居民来往内地通行证', '港澳居民居住证','中华人民共和国外国人永久居留身份证'],
    iconUrl: iconUrl,
    documentType: '身份证',
    documentTypeCode:'IDENTITY_CARD',
    name: '',
    idNo: '',
    cardType: '',
    authentication: null,//认证状态
  },
  // cancelPicker(){
  //   console.log('123')
  // },
  onClose() {
    console.log('123')
    this.setData({
      showPicker:false
    })
  },
  onClickIcon(){
    // this.setData({
    //   showPicker: true
    // })
  },
  // 证件类型
  onChange(event) {
    const { picker, value, index } = event.detail;
 
    var a = [
      'IDENTITY_CARD',
      'PASSPORT',
      'BACK_HOMETOWN_CARD',
      'HOME_VISIT_PERMIT_TAIWAN',
      'RESIDENCE_PERMIT_TAIWAN',
      'HK_MC_CARD',
      'HOME_VISIT_PERMIT_HK_MC',
      'RESIDENCE_PERMIT_HK_MC',
      'FOREIGN_PERMANENT_RESIDENT_ID_CARD',
    ]
    this.setData({
      documentType: value,
      documentTypeCode: a[index]
    })
    // console.log(this.data)
  },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // 姓名
  onName(event) {
    // console.log(event.detail);
    this.setData({
      name: event.detail
    })
  },
  // 证件号
  onIdNo(event) {
    // console.log(event.detail);
    this.setData({
      idNo: event.detail
    })
  },
  // 提交
  onSubmit() {
    if (this.data.name == '') {
      wx.showToast({
        title: '请填写真实姓名',
        icon: 'none',
        duration: 1500,
      })
    } else if (this.data.idNo == '') {
      wx.showToast({
        title: '请填写证件号',
        icon: 'none',
        duration: 1500,
      })
    } else {
      this.onRegistRealAuth()
      if (this.data.authentication != 0) {
        wx.navigateTo({
          url: '/pages/index/healthCode/healthQrCode/index',
        })
      }
      wx.navigateTo({
        // url: `/pages/index/healthCode/healthQrCode/index`,
      })
    }
  },
  // 查看用户是否已经实名认证
  onGetRealAuth() {
    getRealAuth().then((res) => {
      console.log('res......', res)
      if(res.code == 200) {
        this.setData({
          authentication: res.data
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
  // 完成实名认证
  onRegistRealAuth() {
    const params = {
      cardNumber: this.data.idNo,
      cardType: this.data.documentTypeCode,
      realName: this.data.name,
    }
    registRealAuth(params).then((res) => {
      console.log('res......', res)
      if(res.code == 200) {
        this.setData({
          authentication: res.data
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
    // this.onGetRealAuth()
    // if(this.data.authentication == 0) {
    //   wx.navigateTo({
    //     url: '/pages/index/healthCode/healthQrCode/index',
    //   })
    // }
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