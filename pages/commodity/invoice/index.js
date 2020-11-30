// pages/commodity/invoice/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceData:'',
    sellerid:'',
    userId:app.globalData.userId,
    typesOf:1,//抬头类型
    invoice:'',//发票抬头
    taxID:'',//税号,
    bankAccount:'',//开户银行
    bankNum:'',//银行账号
    address:'',//企业地址
    phone:'',//企业电话
    isShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var invoiceData=JSON.parse(options.invoiceData)
    this.setData({
      invoiceData:JSON.parse(options.invoiceData),
      userId:app.globalData.userId,
      sellerid:options.sellerid,
      typesOf:invoiceData?invoiceData[options.sellerid]?invoiceData[options.sellerid].typesOf:1:1,//抬头类型
      invoice:invoiceData?invoiceData[options.sellerid]?invoiceData[options.sellerid].invoice:'':'',//发票抬头
      taxID:invoiceData?invoiceData[options.sellerid]?invoiceData[options.sellerid].taxID:'':'',//税号,
      bankAccount:invoiceData?invoiceData[options.sellerid]?invoiceData[options.sellerid].bankAccount:'':'',//开户银行
      bankNum:invoiceData?invoiceData[options.sellerid]?invoiceData[options.sellerid].bankNum:'':'',//银行账号
      address:invoiceData?invoiceData[options.sellerid]?invoiceData[options.sellerid].address:'':'',//企业地址
      phone:invoiceData?invoiceData[options.sellerid]?invoiceData[options.sellerid].phone:'':'',//企业电话
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
  //抬头类型
  radioChange:function(e){
    this.setData({
      typesOf:e.detail.value
    })
    if(e.detail.value==1){
      this.setData({
        taxID:'',//税号,
        bankAccount:'',//开户银行
        bankNum:'',//银行账号
        address:'',//企业地址
        phone:'',//企业电话
      })
    }
  },
  //发票内容说明
  ispopup:function(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  //不开发票
  notInvoice:function(){
    var that=this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    for(var attr in that.data.invoiceData){
      if(attr==this.data.sellerid){
        delete that.data.invoiceData[attr];
      }
    }
    prevPage.setData({
      invoiceData:that.data.invoiceData
    })
    wx.navigateBack({//返回
      delta: 1
    })
  },
  //确认
  confirmBtn:function(){
    var that=this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var data={}
    if(that.data.invoiceData!=null&&that.data.invoiceData!=''){
      data=that.data.invoiceData
    }
    if(that.data.invoice==''){
      wx.showToast({
        title:'发票抬头不能为空',
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    if(that.data.typesOf==2&&that.data.taxID==''){
      wx.showToast({
        title:'税号不能为空',
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    var invoicelist={
      typesOf:that.data.typesOf,//抬头类型
      invoice:that.data.invoice,//发票抬头
      taxID:that.data.taxID,//税号,
      bankAccount:that.data.bankAccount,//开户银行
      bankNum:that.data.bankNum,//银行账号
      address:that.data.address,//企业地址
      phone:that.data.phone,//企业电话
    }
    data[this.data.sellerid]=invoicelist
    prevPage.setData({
      invoiceData:data
    })
    wx.navigateBack({//返回
      delta: 1
    })
  },
  //发票抬头
  invoiceLookUp:function(e){
    this.setData({
      invoice:e.detail.value
    })
  },
   //税号
   invoiceTaxID:function(e){
    this.setData({
      taxID:e.detail.value
    })
  },

//开户银行
invoiceBankAccount:function(e){
  this.setData({
    bankAccount:e.detail.value
  })
},
//银行账号
invoiceBankNum:function(e){
  this.setData({
    bankNum:e.detail.value
  })
},
//企业地址
invoiceAddress:function(e){
  this.setData({
   address:e.detail.value
  })
},
//企业电话
invoiceTel:function(e){
  this.setData({
    phone:e.detail.value
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