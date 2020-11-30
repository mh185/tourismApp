// pages/shopFilter/ydShopList/index.js
import { querySellerGoods } from '../../../utils/api/index'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    foodShopList: [],//美食店铺列表
    orderNum: 0,
    firstMenuId: '',//一级导航id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      firstMenuId: options.id,
      firstImg: options.img
    })
    this.querySellerGoods()
  },
  /**
   * 美食店铺列表
   */
  querySellerGoods:function(){
    var params = {
      orderNum:1,
      startPage:1,
      pageSize:10,
      menuId:this.data.firstMenuId
    }
    querySellerGoods(params).then(res => {
      if(res.status == 200) {
        this.setData({
          foodShopList: res.data
        })
      }else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  likefilter:function() {
    this.querySellerGoods()
  },
  /**
   * 进入美食店铺
   */
  enterfoodShop:function(e) {
    var sellerid =e.currentTarget.dataset.sellerid;
    var menuId = this.data.firstMenuId
    wx.navigateTo({
      url: '/pages/enterfoodShop/index?sellerid=' + sellerid + '&menuId=' + menuId,
    });
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