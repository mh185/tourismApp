// pages/shopFilter/ydShopList/index.js
import { querySellerGoods } from '../../../utils/api/ydindex'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,
    menuId: '',// 导航id
    ydShopList: [],//远东商铺列表
    seleFloors: [],//所有楼层
    floorModel: false,
    orderNum: 0,
    floor: '',//楼层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      menuId: options.id,
    })
    this.querySellerGoods()
  },
  /**
   * 远东百货店铺销量列表
   */
  querySellerGoods: function () {
    var params = {
      orderNum: 1,
      floor: this.data.floor,
      menuId: this.data.menuId,
      startPage: 1,
      pageSize: 10,
    }
    querySellerGoods(params).then(res => {
      if (res.status == 200) {
        const ydShopList = res.data;
        // let seleFloor = [];
        let seleFloor = ydShopList.map(item => {
          // seleFloor.push(item.floor);
          //   console.log(item);
          return item.floor
        });
        function unique(arr) {
          if (!Array.isArray(arr)) {
            console.log('type error!')
            return
          }
          return Array.from(new Set(arr))
        };
        let dataList = unique(seleFloor);
        // let dataList = unique(seleFloor).filter((item,index)=>{
        //   return item == null
        // })
        console.log(dataList);

        this.setData({
          ydShopList: ydShopList,
          seleFloors: dataList,
        })
        console.log(this.data.seleFloors);
      }
    })
  },
  /**
   * 点击切换 销量 位置
   */
  likefilter: function (event) {
    const that = this
    var orderNum = event.currentTarget.dataset.ordernum
    that.setData({
      orderNum: orderNum,
    })
    if (orderNum == 1) {
      //位置
      // this.setData({
      //   floorModel: true
      // });

      that.querySellerGoods()
    } else {
      that.querySellerGoods()
    }
  },
  /**
   * 选择某个楼层
   */
  selectFloor: function (e) {
    console.log(e.currentTarget.dataset);
    const { selectfloor } = e.currentTarget.dataset

  },
  /**
   * 选择楼层 确定
   */
  selectFloorBtn: function () {
    this.setData({
      floorModel: false,
    })
  },
  //进店铺
  enterTheShop: function (event) {
    var sellerid = event.currentTarget.dataset.sellerid
    wx.navigateTo({
      url: '/pages/enterTheShop/index?sellerid=' + sellerid,
    });
  },
  //跳转详情页面
  shopDetails: function (event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/commodity/productDetails/index?id=' + id
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