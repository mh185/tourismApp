// pages/boutiqueRoute/travelAgencyDetails/index.js
import { travelAgency } from '../../../../utils/more/travelAgency.js'
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host =app.globalData.host;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listDate:[],
    id: '',
    logoTop: '',
    nameTop: '',
    phoneTop: '',
    host: host,
    iconUrl: iconUrl,
    imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
  },
  // 返回上一页
  onClickLeft() {
    // wx.redirectTo({
    //   url: `../routerDetail/index?id=${this.data.id}`,
    //   // url: '../routerDetail/index',//带传入id
    // })
    wx.navigateBack({
      delta:1
    })
  },
  // 路线详情
  toRouterDetail() {
    wx.navigateTo({
      url: `../routerDetail/index?id=${this.data.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options..........",options);
    this.setData({
      id: options.id,
      logoTop: options.logo,
      nameTop: options.name,
      phoneTop: options.phone,
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
    const params = {
      travelAgentsName: this.data.id
    }
    travelAgency(params).then((res) => {
      if(res.code == 200){
        this.setData({
          listDate: res.data.rows
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

  },
  toDetails:function(){
    wx.navigateTo({
      url: '/pages/scenicSpotTickets/details/index',
    })
  }
})