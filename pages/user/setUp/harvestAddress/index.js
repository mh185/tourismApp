// pages/user/setUp/harvestAddress/index.js
import {queryAddress,deleteAddress,updateAddress} from '../../../../utils/api/index'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresslist:[]
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getQueryAddress()
  },
  //获取收货地址
  getQueryAddress:function(){
    const that=this
    var params={
      userId:app.globalData.userId,
    }
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    queryAddress(params).then(res=>{
      if(res.status==200){
        that.setData({
          addresslist:res.data
        })
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
  // 新增
  operatingBtn:function(){
    wx.navigateTo({
      url: '/pages/user/setUp/addAddress/index?type=add',
    });
  },
  // 删除
  deteleAddress:function(event){
    const that=this
    var id=event.currentTarget.dataset.id;
    var params={
      ids:id
    }
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    deleteAddress(params).then(res=>{
      if(res.status==200){
        wx.showToast({
          title:'删除成功',
          icon: 'none',
          duration: 1500,
          success:function(){
            setTimeout(function(){
              that.getQueryAddress()
            },500)
          }
        })
        app.globalData.address=''
      }else{
        wx.showToast({
          title:res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
     
    })
  },
  //设置默认地址
  radioChange:function(e){
    var that=this
    var id=e.detail.value
    var params=null
    this.data.addresslist.forEach(v=>{
      if(v.id==id){
        v.status=1
        var list={
          id:v.id,
          name:v.name,
          phone:v.phone,
          address:v.address,
          lng:v.lng||'',
          lat:v.lat||'',
          pro:v.pro,
          city:v.city,
          area:v.area,
          status:1
        }
        params=list
      }else{
        v.status=0
      }
    })
    this.setData({
      addresslist: this.data.addresslist
    })
    wx.showLoading({
      title: '加载中....',
          mask:true 
    })
    updateAddress(params).then(res=>{
      if(res.status==200){
        wx.showToast({
          title:'设置成功',
          icon: 'none',
          duration: 1500,
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
  //编辑
  addressEdit:function(event){
    var content=event.currentTarget.dataset.content;
    
    wx.navigateTo({
      url: '/pages/user/setUp/addAddress/index?type=edit&content='+JSON.stringify(content),
    });
  },
  //选中地址
  selectAddress:function(event){
    var content=event.currentTarget.dataset.content;
    app.globalData.address=content
    wx.navigateBack({//返回
      delta: 1
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