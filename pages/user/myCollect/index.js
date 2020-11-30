// pages/user/myCollect/index.js
import {queryCart,getGoodsList,deleteCart} from '../../../utils/api/myCollect'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    collectList:[],//收藏列表
    load:true,
    isLoading:false,
    pageCount:0,
    imgUrl:"",
    goodsList: [],
    boolLoad: true,
    queryInfo: {
      userId:app.globalData.userId,
      startPage:1,
      pageSize:10,
      type:1,
      status:0,//0商品 1商家
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const queryInfo = this.data.queryInfo;
    queryInfo.userId = app.globalData.userId;
    this.setData({
      queryInfo,
      imgUrl:app.globalData.imgUrl,
    })
    this.getCollectList();
  },
  /**
   * 获取收藏列表
   * @param {*} data 
   */
  getCollectList: function(){
    const data = this.data.queryInfo;
    if(this.data.boolLoad){
      wx.showLoading({
        title: '加载中....',
        mask:true 
      })
    }
    queryCart(data).then(res=>{
      if(res.status == 200){
        let arrList = res.data.data || [];
        if(data.status == 1 && arrList.length){
          let arrIds = [];
          arrList.forEach(item => {
            arrIds.push(item.id)
          });
          arrIds = arrIds.toString();
          this.getGoodsList(arrIds);
        }
        this.setData({
          pageCount: res.data.pageCount || 0,
          load:true,
        });
        if(this.data.queryInfo.startPage==1){
          wx.hideLoading()
          this.setData({
            collectList:arrList,
          })
        }else{
          this.setData({
            collectList: that.data.collectList.concat(arrList),
          })
        }
        if(arrList.length==0){
          this.setData({
            isLoading: true,
          })
        }else {
          this.setData({
            isLoading: false,
          })
        }
      }
    });
  },
  /**
   * 获取店铺下的商品
   * @param {*} id 
   */
  getGoodsList(ids){
    const data = this.data.queryInfo;
    getGoodsList({ids}).then(res=>{
      if(res.status == 200){
        if(data.startPage == 1){
          this.setData({
            goodsList:res.data
          })
        }else{
          this.setData({
            goodsList:that.data.goodsList.concat(res.data)
          })
        }
      }
    })
  },
  /**
   * 跳转到商品详情
   * @param {*} e 
   */
  goGoodsInfo: function(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/commodity/productDetails/index?id=' + id 
    })
  }, 
  /**
   * 取消
   * @param {*} e 
   */
  cancelCollect: function(e){
    const that = this;
    const objectId = e.currentTarget.dataset.id;
    const data = {
      objectId,
      userId:app.globalData.userId,
      type:1,
      status:this.data.currentTab
    };
    deleteCart(data).then(res=>{
      if(res.status == 200){	
        wx.showToast({
          title:'取消收藏成功',
          icon: 'none',
          duration: 1500,
          success:function(){
            that.getCollectList();
          }
        });
      }
    });
  },
  //禁止左右滑动
  forbidMove(e) { return; },
  //加载更多
  accountManagerList: function (e) {
    const that = this
    if (that.data.load) {//全局标志位，方式请求未响应是多次触发
      if(that.data.queryInfo.startPage<that.data.pageCount){
        const queryInfo = Object.assign({},that.data.queryInfo);
        queryInfo.startPage=that.data.queryInfo.startPage+1;
        queryInfo.userId = app.globalData.userId
        that.setData({
          load: false,
          queryInfo
         });
        that.getCollectList();
      }else{
        wx.showToast({
          title:'暂无更多数据',
          icon: 'none',
          duration: 1500,
        });
        return
      }
    }
  },
  //  tab切换逻辑
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      const queryInfo = Object.assign({},that.data.queryInfo);
      queryInfo.status = e.target.dataset.current;
      queryInfo.userId = app.globalData.userId
      that.setData({
        currentTab: e.target.dataset.current,
        boolLoad:true,
        queryInfo,
        collectList:[]
      });
      that.getCollectList();
    }
  },
  // bindChange: function (e) {
  //   var that = this;
  //   const queryInfo = Object.assign({},that.data.queryInfo);
  //   queryInfo.status = e.detail.current;
  //   that.setData({ 
  //     currentTab: e.detail.current,
  //     boolLoad:true,
  //     collectList:[],
  //     queryInfo
  //   });
  //   that.getCollectList();
  // },
})