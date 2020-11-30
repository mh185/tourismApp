// pages/user/myOrder/afterSalesRefund/index.js
import {queryOrder,saveComment,updateOrder} from '../../../../utils/api/myOrder'
var app = getApp();
const imgUrl=app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:imgUrl,
    score:'',
    orderId:'',//订单详情id
    orderdetails:{},//订单详情
    comment:'',//评价
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId:options.orderId
    })
    this.getQueryOrder()
  },
  //评价
  btnEvaluation:function(){
    const that=this
    if(that.data.comment==''){
      wx.showToast({
        title:'评价内容不能为空',
        icon: 'none',
        duration: 1500,
      })
      return
    }
    var data={
      comment:that.data.comment,//评价内容
      userId:app.globalData.userId,//评论人id
      objectId:that.data.orderdetails.goods[0].goodsId,
      status:0,
      describeScore:that.data.score,//描述评分(对象评分)
      label:that.data.orderdetails.goods[0].goodsLabel,
      type:0
    }
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    saveComment(data).then(res=>{
      wx.hideLoading()
      if(res.status==200){
        var params={
          id:that.data.orderId,
          status:6
        }
        updateOrder(params).then(res=>{
          if(res.status==200){
            wx.showToast({
              title:'评价成功',
              icon: 'none',
              duration: 1500,
            })
            wx.navigateBack({
              delta: 1  // 返回上一级页面。
            })
          }
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
  //获取评价内容
  getComment:function(e){
    this.setData({
      comment:e.detail.value
    })
  },
  //评价星星
  selectIndexNum(e){
    let i = e.currentTarget.dataset.index;
    if(i == (this.data.score-1)){
      this.setData({
        score: -1
      })
    }else {
      this.setData({
        score: e.currentTarget.dataset.index + 1
      })
    }
  },
  getQueryOrder:function(){
    const that = this
    var data={
      id:that.data.orderId,
      userId:app.globalData.userId,
      startPage:1,
      pageSize:1
    }
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    queryOrder(data).then(res => {
     
      if(res.status==200){
        wx.hideLoading()
        let mainInfo=res.data.data[0]
        for(let i=0;i<mainInfo.goods.length;i++){
          mainInfo.goods[i].goodsHeadImg=JSON.parse(mainInfo.goods[i].goodsHeadImg)
        }
        that.setData({
          orderdetails:mainInfo
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