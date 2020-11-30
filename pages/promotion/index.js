// pages/promotion/index.js
import { queryMSeckillForWX, queryGoodsLabelGroupForWeb } from '../../utils/api/index'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'',
    tasklist: [
      {
        imgUrl: '../../images/task.png',
        title: '推荐有礼',
        btn_title: '去完成',
        num: '+320'
      },
      {
        imgUrl: '../../images/task2.png',
        title: '签到',
        btn_title: '去完成',
        num: '+10'
      },
      {
        imgUrl: '../../images/task.png',
        title: '任务有礼',
        btn_title: '去完成',
        num: '+100'
      },
    ],
    // 秒杀列表
    seckillList:[],
    // 拼团列表
    grouplist: [],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
    /**
   * 跳转到抽奖页面
   */
  luckDraw:function() {
    wx.navigateTo({
      url: '/pages/promotion/luckyDraw/index'
    });
  },
  /**
   * 获取秒杀商品
   */
  queryMSeckillForWX: function () {
    // const that = this
    var params = {
      startPage: 1,
      pageSize: 10
    }
    queryMSeckillForWX(params).then(res => {
      // console.log(res);
      if (res.status == 200) {
        this.setData({
          seckillList:res.data
        })
      }
    })
  },
  /**
   * 跳转到秒杀商品页面
   */
  seckillshopDetails:function(event) {
    console.log(event);
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url:'/pages/commodity/seckillDetails/index?id=' + id
    })
  },
  /**
   * 获取拼团商品
   */
  queryGoodsLabelGroupForWeb: function () {
    // const that = this
    var params = {
      startPage: 1,
      pageSize: 10
    }
    queryGoodsLabelGroupForWeb(params).then(res => {
      console.log(res.data);
      if (res.status == 200) {
        this.setData({
          grouplist: res.data
        })
      }
    })
  },
  //跳转拼团商品详情页面
  groupshopDetails: function (event) {
    var id = event.currentTarget.dataset.id
    var goodsLabelId = event.currentTarget.dataset.goodslabelid
    var goodsLabelIdone = event.currentTarget.dataset.goodslabelidone
    wx.navigateTo({
      url: '/pages/commodity/groupDetails/index?id=' + id + '&goodsLabelId=' + goodsLabelId +'&goodsLabelIdone=' + goodsLabelIdone
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
    this.setData({
      imgUrl:imgUrl
    })
    this.queryMSeckillForWX()
    this.queryGoodsLabelGroupForWeb()
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