// pages/shopFilter/index.js
import { sdictQuerydict, mgoodsQueryGoods, querySeller } from '../../utils/api/index'
import { getGoodsList } from '../../utils/api/myCollect'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    firstMenuId: '',//一级导航id
    firstImg: '',//一级导航背景图
    navMenu: [],//菜单导航
    hotsGoodsList: [],//热卖商品
    recomProductsList: [],//推荐商品
    sellerList: [],//推荐商家
    sellerListGoodsList: [],
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
    console.log(this.data.firstMenuId);
    this.sdictQuerydict()
    this.hotsGoods()
    this.querySeller()
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
  // 跳转列表页面
  shopList: function (event) {
    var id = event.currentTarget.dataset.id
    var name = event.currentTarget.dataset.name
    var firstMenuId = this.data.firstMenuId
    switch (firstMenuId) {
      case '2c908084732ebccf01739ecff90e05a5':
        return wx.navigateTo({
          url: '/pages/shopFilter/finefood/index?id=' + id + '&name=' + name,
        });
        break;
      default:
        return wx.navigateTo({
          url: '/pages/shopFilter/shopList/index?id=' + id + '&name=' + name + '&firstMenuId=' + this.data.firstMenuId,
        });
    }
    // wx.navigateTo({
    //   url: '/pages/shopFilter/shopList/index?id=' + id + '&name=' + name + '&firstMenuId=' + this.data.firstMenuId,
    // });
  },
  //获取首页二级菜单
  sdictQuerydict: function () {
    const that = this
    var params = {
      parentId: this.data.firstMenuId,
      startPage: 1,
      pageSize: 10000
    }
    wx.showLoading({
      title: '加载中....',
      mask: true
    })
    sdictQuerydict(params).then(res => {
      if (res.status == 200) {
        var Array = res.data.data
        var list = this.group(Array, 8)
        this.setData({
          navMenu: list
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
      wx.hideLoading()
    })
  },
  // 拆分数组
  group: function (array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while (index < array.length) {
      newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
  },
  //热卖商品
  hotsGoods: function () {
    const that = this
    var params = {
      menuId: this.data.firstMenuId,
      startPage: 1,
      pageSize: 4,
      status: 0,
      examine: 1,
      orderNum: 4,
    }
    mgoodsQueryGoods(params).then(res => {
      if (res.status == 200) {
        this.setData({
          hotsGoodsList: res.data.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
      wx.hideLoading()
    })
  },
  //推荐商品
  recomProducts: function () {
    const that = this
    var params = {
      menuId: this.data.firstMenuId,
      startPage: 1,
      pageSize: 10,
      status: 0,
      examine: 1,
      recom: 1,
    }
    mgoodsQueryGoods(params).then(res => {
      if (res.status == 200) {
        this.setData({
          recomProductsList: res.data.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
      wx.hideLoading()
    })
  },
  //跳转详情页面
  shopDetails: function (event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/commodity/productDetails/index?id=' + id
    });
  },

  //推荐商家
  querySeller: function () {
    const that = this
    var params = {
      startPage: 1,
      pageSize: 4,
      state: 1,
      isDelete: 0,
      menuOneId: this.data.firstMenuId
    }

    wx.showLoading({
      title: '加载中....',
      mask: true
    })
    querySeller(params).then(res => {
      if (res.status == 200) {
        this.setData({
          sellerList: res.data
        })
        var ids = []
        res.data.forEach(v => {
          ids.push(v.id)
        })
        ids = ids.toString();
        that.youLikeShopGoods(ids)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        })
        wx.hideLoading()
      }
    })
  },

  //获取猜你喜欢商家商品
  youLikeShopGoods: function (ids) {
    getGoodsList({ ids }).then(res => {
      if (res.status == 200) {
        this.setData({
          sellerListGoodsList: res.data
        })
      }
      wx.hideLoading()
    })
  },
  //进店铺
  enterTheShop: function (event) {
    var sellerid = event.currentTarget.dataset.sellerid
    wx.navigateTo({
      url: '/pages/enterTheShop/index?sellerid=' + sellerid,
    });
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