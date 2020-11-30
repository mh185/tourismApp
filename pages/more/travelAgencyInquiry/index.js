// pages/more/travelAgencyInquiry/index.js
import {  travelAgencyList } from '../../../utils/more/travelAgency.js';
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    page: 1,
    size: 5,
    host:host,
    iconUrl: iconUrl,
    condition: false,//旅行社名片显示状态
    // buttom: true,
    name: '',//输入值
    cardList: [],//旅行社名片
  },
  // 返回更多
  onClickLeft() {
    wx.navigateBack({
      delta: 1,
    })
  },
  // 获取输入框的值
  onChange(event) {
    // console.log('event...', event);
    this.setData({
      name: event.detail
    })
  },
  // 获取旅行社 card
  getTravelAgencyList() {
    const params = {
      name: this.data.name,
      page: this.data.page,
      size: this.data.size,
    }
    travelAgencyList(params).then((res) => {
      if(res.code == 200) {
        if (res.data.rows.length < this.data.size) {
          this.setData({
            searchLoading: true,
          })
        }
        if(res.data.total > 0) {
          this.setData({
            cardList: this.data.cardList.concat(res.data.rows),
            condition: true,
            buttom: false,
          })
        } else {
          wx.showToast({
            title: '未找到相关数据',
            icon: 'none',
            duration: 1500,
          })
        }
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  // 加载更多
  onClickMore:function(){
     console.log("点击")
     this.setData({
      page:this.data.page+1
     })
     this.getTravelAgencyList()
  },
  // 点击查询
  queryResults() {
    if(this.data.name == '') {
      wx.showToast({
        title: '请输入旅行社名称',
        icon: 'none',
        duration: 1500,
      })
    } else {
      this.setData({
        // name: '',
        page: 1,
        size: 5,
        cardList: [],
      })
      this.getTravelAgencyList()
    }
  },
  //拨打电话
  freeTell: function (t) {
    // console.log('dainhua ....', t)
    wx.makePhoneCall({
      phoneNumber: t.currentTarget.dataset.tell,
    }).catch((e) => {
      // console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
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