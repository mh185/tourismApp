// pages/homePage/youMayAlsoLike/index.js
import {guessYouLike} from '../../../utils/api/index'
import {getGoodsList} from '../../../utils/api/myCollect'
var app = getApp();
const imgUrl=app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:imgUrl,
    userId:'',
    youLikeGoods:[],//商品
    youLikeShop:[],//商家
    youLikeShopGoodsList:[],//商家商品
    lng:'',
    lat:'',
    orderNum:0,
    startPage:1,
    isMore:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId:app.globalData.userId
    })
    wx.showLoading({
      title: '加载中....',
          mask:true 
    })
    this.guessYouLike()
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
  //猜你喜欢筛选
likefilter:function(event){
  const that=this
  var orderNum=event.currentTarget.dataset.ordernum
  that.setData({
    orderNum:orderNum,
  })
  wx.showLoading({
    title: '加载中....',
        mask:true 
  })
  if(orderNum==1){
  //查询商家
    wx.getSetting({
      success (res) {            
          if(!res.authSetting['scope.userLocation']){
              that.Reacquire()
          }else{
            wx.getLocation({
              type: 'wgs84',
              success(res) {
                that.setData({
                  lat:res.latitude,
                  lng:res.longitude,
                })
                that.guessYouLike()
              }
            })
          }
      }
    });
  }else{
    that.setData({
      lat:'',
      lng:'',
      orderNum:orderNum,
      startPage:1
    })
    that.guessYouLike()
  }
},
  //重新获取定位
  Reacquire:function(){
    var that=this
    wx.openSetting({
      success(res) {
        if (res.authSetting["scope.userLocation"]) {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              that.setData({
                startPage:1,
                orderNum:1,
                lat:res.latitude,
                lng:res.longitude,
              })
              that.guessYouLike()
            }         
          })
        }
      }
    })
  },
  //猜你喜欢
guessYouLike:function(){
  const that=this
  var params={
    orderNum:that.data.orderNum,
    userId:that.data.userId,
    lng:that.data.lng,
    lat:that.data.lat,
    startPage:that.data.startPage,
    pageSize:10,
  }
  for ( var key in params ){
    if ( params[key] ==='' ){
      delete params[key]
    }
  }
  
  guessYouLike(params).then(res=>{
    if(res.status==200){
      if(that.data.startPage==1){
        this.setData({
          youLikeGoods:[],
          youLikeShop:[]
        })
      }
      var youLikeShopList=that.data.youLikeShop.concat(res.data.sellerList)
      that.setData({
        youLikeGoods:that.data.youLikeGoods.concat(res.data.data),
        youLikeShop:youLikeShopList
      })
      if(that.data.orderNum==1){
        var ids=[]
        youLikeShopList.forEach(v=>{
          ids.push(v.id)
        })
        ids = ids.toString();
        that.youLikeShopGoods(ids)
      }else{
        wx.hideLoading()
      }
      if(res.data.total==res.data.iTotalDisplayRecords){
        that.setData({
          isMore:false
        })
      }else{
        that.setData({
          isMore:true
        })
      }

    }else{
      wx.showToast({
        title:res.msg,
        icon: 'none',
        duration: 1500,
      })
      this.setData({
        isMore:true
      })
      wx.hideLoading()
    }
   
  })
},
//获取猜你喜欢商家商品
youLikeShopGoods:function(ids){
  getGoodsList({ids}).then(res=>{
    if(res.status == 200){
      this.setData({
        youLikeShopGoodsList:res.data
      })
    }
    wx.hideLoading()
  })
},
 //跳转商品详情页面
 shopDetails:function(event){
  var id=event.currentTarget.dataset.id
  wx.navigateTo({
    url: '/pages/commodity/productDetails/index?id='+id
  });
},
//进店铺
enterTheShop:function(event){  
  var sellerid=event.currentTarget.dataset.sellerid
  wx.navigateTo({
    url: '/pages/enterTheShop/index?sellerid='+sellerid,
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
    if(this.data.isMore){
      var page=Number(this.data.startPage)+1
      this.setData({
        startPage:page
      })
      this.guessYouLike()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})