// pages/user/cardRoll/index.js
import {queryDiscountForPC, myCard} from '../../../utils/api/index'
import {formatTimeLine} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    flag:4,
    cardList:[], // 我的卡券列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     this.myCard();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.queryDiscountForPC()
  },
  /**
   * tab切换逻辑
   */
  swichNav:function(e) {
    var that = this;
    if(this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab:e.target.dataset.current
      })
      console.log(this.data.currentTab);
    }
    
  },
  /**
   * 查询优惠券
   */
  queryDiscountForPC:function() {
    console.log(2);
    var params={
      startPage:1,
      pageSize:10
    }
    queryDiscountForPC(params).then(res=>{
      console.log(res);
      if(res.status == 200) {
        console.log(124);
        console.log(res);
      }
    })
  },
  // 我的优惠卷
  myCard(e){
       let params = {
       }
       myCard(params).then(res=>{

         if(res.status == 200){

          res.data.forEach(item=>{

            item.endDate = formatTimeLine(new Date(item.endDate));

          })

          this.setData({
            cardList:res.data
          })

         }else{
           wx.showToast({
             title: res.msg,
             icon:'none'
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

  }
})