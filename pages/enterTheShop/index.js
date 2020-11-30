// pages/enterTheShop/index.js
import {querySellerDetail,mgoodsQueryGoods,saveCart,deleteCart} from '../../utils/api/index'
var app = getApp();
const imgUrl=app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:imgUrl,
    sellerid:'',//店铺id
    sellerInfor:null,//店铺信息
    startPage:1,
    isMore:true,
    shopList:[],
    isloginPrompt:false,
    recommend:'',
    recomOrGoods:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sellerid:options.sellerid
    })
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    this.getQuerySellerDetail()
    this.mgoodsQueryGoods()
  },
  //切换
  recomOrGoods:function(event){
    var type=event.currentTarget.dataset.type
    var recommend=''
    if(type==1){
      recommend=type
    }
    this.setData({
      recomOrGoods:type,
      recommend:recommend,
      startPage:1
    })
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    this.mgoodsQueryGoods()
  },
    //获取商品
  mgoodsQueryGoods:function(){
    const that=this
    var params={
      status:0,
      sellerId:that.data.sellerid,
      startPage:that.data.startPage,
      pageSize:10,
      recommend:that.data.recommend,
    }
    for ( var key in params ){
      if ( params[key] ==='' ){
        delete params[key]
      }
    }
   
    mgoodsQueryGoods(params).then(res=>{
      if(res.status==200){
        if(that.data.startPage==1){
          this.setData({
            shopList:[],
          })
        }
        var shopList=this.data.shopList.concat(res.data.data)
        if(res.data.total==res.data.iTotalDisplayRecords){
          this.setData({
            isMore:false,
            shopList:shopList,
          })
        }else{
          this.setData({
            isMore:true,
            shopList:shopList,
          })
        }
      }else{
       wx.showToast({
         title:res.msg,
         icon: 'none',
         duration: 1500,
       })
      }
      wx.hideLoading()
    })
  },
   //跳转详情页面
   shopDetails:function(event){
      var id=event.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/commodity/productDetails/index?id='+id
      });
  },
  //'关注
collect:function(){
  const that=this
  if(app.globalData.userId==''||app.globalData.userId==null){
    this.setData({
      isloginPrompt:true
    })
    return false
  }
  var params={
    userId:app.globalData.userId,
    objectId:that.data.sellerid,
    type:1,
    status:1,
  }
  wx.showLoading({
    title: '加载中....',
        mask:true 
  })
  saveCart(params).then(res=>{    
    if(res.status==200){
      wx.showToast({
        title:'关注成功',
        icon: 'none',
        duration: 1500,
      })
     that.getQuerySellerDetail()
    }else{
      wx.showToast({
        title:res.msg,
        icon: 'none',
        duration: 1500,
      })
    }
    wx.hideLoading()
  })
},
//取消关注
cancelCollect:function(){
  const that=this
  if(app.globalData.userId==''||app.globalData.userId==null){
    this.setData({
      isloginPrompt:true
    })
    return false
  }
  var params={
    userId:app.globalData.userId,
    objectId:that.data.sellerid,
    type:1,
    status:1,
  }
  wx.showLoading({
    title: '加载中....',
    mask:true 
  })
  deleteCart(params).then(res=>{
    if(res.status==200){
      wx.showToast({
        title:'取消关注成功',
        icon: 'none',
        duration: 1500,
      })
     that.getQuerySellerDetail()
    }else{
      wx.showToast({
        title:res.msg,
        icon: 'none',
        duration: 1500,
      })
    }
    wx.hideLoading()
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

  },
  // 商家详情
  getQuerySellerDetail:function(){
    var params={
      id:this.data.sellerid,
      userId:app.globalData.userId,
    }
    querySellerDetail(params).then(res=>{
      if(res.status==200){
      this.setData({
        sellerInfor:res.data
      })
      }else{
        wx.showToast({
          title:res.msg,
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
    if(this.data.isMore){
      var page=Number(this.data.startPage)+1
      this.setData({
        startPage:page
      })
      this.mgoodsQueryGoods()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})