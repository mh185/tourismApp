// pages/enterfoodShop/index.js
import { queryCart, saveCart, deleteCart, queryFoodGoodsDetail, queryGoodsDetail, queryThemeComment } from '../../utils/api/index'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellerid: '',//店铺id
    sellerInfor: null,//店铺详情
    menuId: '',//菜单id
    itemIndex: 0,
    latitude: '',//纬度
    longitude: '',//经度
    imgUrl: imgUrl,
    // Collection: false,
    ThemeComment: [], //评论
    tabs: [
      {
        id: 0,
        value: '堂食',
        isActive: true
      },
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sellerid: options.sellerid,
      menuId: options.menuId

    })
    // console.log(this.data.menuId);
    this.queryCart()
    this.getQueryThemeComment()
  },
  /**
   * WEB美食店铺详情
   */
  queryFoodGoodsDetail: function () {
    var that = this
    var params = {
      sellerId: that.data.sellerid,
      // sellerid: "2c90808472c034270172c036e6ed0000",
      lng: that.data.longitude,
      // lng: "106.56256",
      lat: that.data.latitude,
      // lat:"29.52168",
      menuId: that.data.menuId
      // menuId:"402882827369c91501736a301dd70009"
    }

    console.log(that.data.sellerid);
    queryFoodGoodsDetail(params).then(res => {
      if (res.status == 200) {
        console.log(res);
        that.setData({
          sellerInfor: res.data[0]
        })
      }
    })
  },
  //获取评论
  getQueryThemeComment: function () {
    var params = {
      id: this.data.sellerInfor.id,
      startPage: 1,
      pageSize: 3
    }
    wx.showLoading({
      title: '加载中....',
      mask: true
    })
    queryThemeComment(params).then(res => {
      if (res.status == 200) {
        this.setData({
          ThemeComment: res.data.data
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
  /**
   * 跳转商品详情
   */
  goFoodBuy: function (e) {
    const { id, labelid, price,labelname } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../enterfoodShop/foodDetail/index?id=' + id + '&labelid=' + labelid + '&price=' + price + '&labelname=' + labelname,
    })
  },
  /**
 * 获取获取经纬度
 */
  getLatAndLon: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        that.queryFoodGoodsDetail()
      },
      fail: function () {
        // fail
        console.log(22);
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 查询购物车、收藏
   */
  queryCart: function () {
    var params = {
      userId: app.globalData.userId,
      objectId: this.data.sellerid,
      type: 1,
      status: 1,
      startPage: 1,
      pageSize: 4
    }
    queryCart(params).then(res => {
      if (res.status == 200) {
        // console.log(res);
        if (res.data !== '') {
          // this.setData({
          //   Collection: false
          // })
        }
      }
    })

  },
  //'收藏
  collect: function () {
    const that = this
    if (app.globalData.userId == '' || app.globalData.userId == null) {
      this.setData({
        isloginPrompt: true
      })
      return false
    }
    var params = {
      userId: app.globalData.userId,
      objectId: that.data.sellerid,
      type: 1,
      status: 1,
    }
    // wx.showLoading({
    //   title: '加载中....',
    //   mask: true
    // })
    saveCart(params).then(res => {
      if (res.status == 200) {
        // that.setData({
        //   Collection: false
        // })
        // this.queryCart()
        wx.showToast({
          title: '收藏成功',
          icon: 'none',
          duration: 1500,
        })
        // that.getQuerySellerDetail()
        that.queryFoodGoodsDetail()

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
  //取消关注
  cancelCollect: function () {
    const that = this
    if (app.globalData.userId == '' || app.globalData.userId == null) {
      this.setData({
        isloginPrompt: true
      })
      return false
    }
    var params = {
      userId: app.globalData.userId,
      objectId: that.data.sellerid,
      type: 1,
      status: 1,
    }
    // wx.showLoading({
    //   title: '加载中....',
    //   mask: true
    // })
    deleteCart(params).then(res => {
      if (res.status == 200) {
        // that.setData({
        //   Collection: true
        // })
        wx.showToast({
          title: '取消收藏成功',
          icon: 'none',
          duration: 1500,
        })
        // that.getQuerySellerDetail()
        that.queryFoodGoodsDetail()

        // this.queryCart()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
      // wx.hideLoading()
    })
  },
  /**
   * 点击切换
   */
  handleItemTap: function (e) {
    // 1 获取点击的索引
    const { index } = e.currentTarget.dataset
    // 触发父组件中的事件 自定义
    console.log(index);
    const { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // this.triggerEvent("tabsItemChange",{index})
    this.setData({
      tabs,
    })
  },
  /**
 * 左侧菜单的点击事件
 */
  leftItem: function (e) {
    /**
     * 1 获取被点击标题身上的索引
     * 2 给data中的currentIndex赋值就可以了
     * 3 根据不同的索引来渲染右侧的商品内容
     */
    const { index } = e.currentTarget.dataset;
    // let rightContent = this.Cates[index].children;
    this.setData({
      itemIndex: index,
      // rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      // scrollTop: 0
    })
  },
  /**
  * 查询商品详情
  */
  queryGoodsDetail: function () {
    var params = {
      id: this.data.id,
    }
    queryGoodsDetail(params).then(res => {
      if (res.status == 200) {
        // console.log(res);
        var data = res.data
        data.body = data.body.replace(/<img[^>]*>/gi, function (match, capture) {
          return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;"') // 替换style
        })
        data.body = data.body.replace(/\<img/gi, '<img style="max-width:100% !important;height:auto" ')
        this.setData({
          foodInfo: data,
        })
      }
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
    this.getLatAndLon()
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