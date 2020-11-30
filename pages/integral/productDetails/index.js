// pages/commodity/productDetails/index.js
import {queryGoodsDetail,queryGoodsLabel,queryThemeComment,saveCart,queryCartNum,queryAddress} from '../../../utils/api/index'
var app = getApp();
const imgUrl=app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:imgUrl,
    userId:'',
    userInfor:'',
    lineIndex:1,//1商品,2详情
    topHeight:'',
    ISpecifica:false,
    number:1,//商品数量,
    id:'',//商品id
    detailInfor:null,//商品信息
    autoplay:true,
    //所有图片的高度  
    imgheights: [],
    //默认  
    current: 0,
    goodsLabel:[],//商品规格
    selectsLabel:null,
    sectcLabelIndex:'',//选中规格的下标
    type:'',//有购物车打开，还是直接购买，1直接购买，2购物车
    ThemeComment:[],//评论
    commentPoint:[{
      dark:'../../../images/icon-pentag-no.png',
      bright:'../../../images/icon-pentag-Yes.png',
    },{
      dark:'../../../images/icon-pentag-no.png',
      bright:'../../../images/icon-pentag-Yes.png',
    },{
      dark:'../../../images/icon-pentag-no.png',
      bright:'../../../images/icon-pentag-Yes.png',
    },{
      dark:'../../../images/icon-pentag-no.png',
      bright:'../../../images/icon-pentag-Yes.png',
    },{
      dark:'../../../images/icon-pentag-no.png',
      bright:'../../../images/icon-pentag-Yes.png',
    }],
    cartNumber:0,
    addressData:null,//获取地址
    isloginPrompt:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    const that = this;
    that.setData({
      id:options.id
    })
    this.queryGoodsDetail()
    this.getQueryThemeComment()
    if(app.globalData.userId!=null&&app.globalData.userId!=''){
      this.getqueryCartNum()
    }
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
      topHeight: '',
      isloginPrompt:false,
      ISpecifica:false,
      userId:app.globalData.userId,
      userInfor:app.globalData.wxUserInfo,
    }) 
    this.getQueryAddress()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  onPageScroll:function(e){
    var that = this;
    if(that.data.topHeight==''){
      var query = wx.createSelectorQuery();   
      query.select('.productDetailsCenter').boundingClientRect(function (rect) {
        that.setData({
          topHeight: rect.height-60
        })
      }).exec();
    }
    if(e.scrollTop>=that.data.topHeight){
      that.setData({
        lineIndex:2
      })
    }else{
      that.setData({
        lineIndex:1
      })
    }    
 },
  positionBtn:function(e){
    var that=this
    var i=e.currentTarget.dataset.index;
    if(that.data.lineIndex!=i){
      
      that.setData({
        lineIndex:i
      })
      if(i==1){
        wx.pageScrollTo({
          scrollTop:0
        })
      }else{
        if(that.data.topHeight==''){
          var query = wx.createSelectorQuery();   
          query.select('.productDetailsCenter').boundingClientRect(function (rect) {
            that.setData({
              topHeight: rect.height-60
            })
            wx.pageScrollTo({
              scrollTop:rect.height+5
            })
          }).exec();
        }else{
          wx.pageScrollTo({
            scrollTop:that.data.topHeight+5
          })
        }
      
      }
    }    
  },
 //跳转全部评价
 allcomment:function(){
  wx.navigateTo({
    url: '/pages/commodity/allComment/index?id='+this.data.id,
    });
 },
 //关闭规格选择弹窗
 ISpecificaBtn:function(){
  this.setData({
    ISpecifica:false
  })
 },
 //打开规格选择弹窗
 openPecificaBtn:function(event){
   const that=this
   if(this.data.userId==null||this.data.userId==''){
      this.setData({
        isloginPrompt:true
      })
      return false
   }
   if(event){
    var type=event.currentTarget.dataset.type
    this.setData({
      type:type
    })
   }
    

  var params={
    goodsId:that.data.detailInfor.id
  }
  queryGoodsLabel(params).then(res=>{
    if(res.status==200){
      this.setData({
        ISpecifica:true,
        goodsLabel:res.data
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
 //选择规格
 sectcLabel:function(event){
   var that=this
  var index=event.currentTarget.dataset.index
  this.setData({
    sectcLabelIndex:index,
    selectsLabel:that.data.goodsLabel[index],
    number:1
  })
 },
 //加
 plus:function(){
  var number=this.data.number
  number++
  if(this.data.selectsLabel!=null&&number>this.data.selectsLabel.stock){
    wx.showToast({
      title:'已达商品最大库存',
      icon: 'none',
      duration: 1500,
    })
    return false
  }else if(this.data.detailInfor!=null&&number>this.data.detailInfor.stockNum){
    wx.showToast({
      title:'已达商品最大库存',
      icon: 'none',
      duration: 1500,
    })
    return false
  }
  this.setData({
    number:number
  })
 },
 //减
 less:function(){
  var number=this.data.number
  number--
  if(number>0){
    this.setData({
      number:number
    })
  }else{
    this.setData({
      number:1
    })
  } 
 },
//加入购物车
addShopcart:function(event){
  var type=event.currentTarget.dataset.type
  this.setData({
    type:type
  })
  if(this.data.selectsLabel!=null){
    this.specificaBtn()
   }else{
    this.openPecificaBtn()
   }
},
 //立即购买
 buyNow:function(event){
  var type=event.currentTarget.dataset.type
  this.setData({
    type:type
  })
   if(this.data.selectsLabel!=null){
    this.specificaBtn()
   }else{
    this.openPecificaBtn()
   }
 },

//立即购买还是加入购物车
specificaBtn:function(){
  if(this.data.selectsLabel!=null){
    if(this.data.type==1){
      var orderList=[]
      var list=[]
      var shopInfor={
        cartId:this.data.selectsLabel.id,
        cartLabel:this.data.selectsLabel.labelName,
        cartNum:this.data.number,
        cartPrice:this.data.selectsLabel.price,
        freightPrice: this.data.detailInfor.freightPrice,
        goodsId:this.data.detailInfor.id,
        goodsLabel: [],
        headImg:this.data.detailInfor.headImg,
        integral: 0,
        name: this.data.detailInfor.name,
        price:this.data.detailInfor.nowPrice,
        rawPrice:this.data.detailInfor.rawPrice,
        stockNum:this.data.selectsLabel.stock,
      }
      list.push(shopInfor)
      var orderData={
        sellerId:this.data.detailInfor.seller.id,
        shopName:this.data.detailInfor.seller.shopName,
        courierFee:this.data.detailInfor.seller.freightPrice,
        goods:list
      }
      orderList.push(orderData)
      app.globalData.confirmOrder=orderList
      wx.navigateTo({
        url: '/pages/commodity/confirmOrder/index',
      });
    }else{
      //加入购物车
      this.getSaveCart()
    }
   }else{
    wx.showToast({
      title:'请选择商品规格',
      icon: 'none',
      duration: 1500,
    })
   } 
},
//加入购物车
getSaveCart:function(){
  const that=this
  var params={
    userId:that.data.userId,
    objectId:that.data.id,
    type:0,
    status:0,
    label:that.data.selectsLabel.labelName,
    labelId:that.data.selectsLabel.id,
    cartPrice:that.data.selectsLabel.price,
    num:that.data.number
  }
  wx.showLoading({
    title: '加载中....',
        mask:true 
  })
  saveCart(params).then(res=>{    
    if(res.status==200){
      wx.showToast({
        title:'购物车加入成功',
        icon: 'none',
        duration: 1500,
      })
      this.getqueryCartNum()
      this.ISpecificaBtn()
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
//查询购物车数量
getqueryCartNum:function(){
  const that=this
  var params={
    userId:app.globalData.userId,
    type:0,
    status:0
  }
  queryCartNum(params).then(res=>{
    if(res.status==200){
     this.setData({
      cartNumber:res.data
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
//前往购物车
goCart:function(){
  console.log("1111");
  
  wx.switchTab({
    url: '/pages/shopCart/index'
  })
},
//获取商品详情
queryGoodsDetail:function(){
  const that=this
  var params={
    id:that.data.id,
    userId:app.globalData.userId,
    lng:'',
    lat:'',
  }
  for ( var key in params ){
    if ( params[key] ==='' ){
      delete params[key]
    }
  }
  wx.showLoading({
    title: '加载中....',
        mask:true 
  })
  queryGoodsDetail(params).then(res=>{
    if(res.status==200){
      var data=res.data
      data.body=data.body.replace(/<img[^>]*>/gi, function (match, capture) {
        return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;"') // 替换style
      })
      data.body=data.body.replace(/\<img/gi, '<img style="max-width:100% !important;height:auto" ')
      
      this.setData({
        detailInfor:data,
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
//顶部轮播图高度
imageLoad: function (e) {//获取图片真实宽度  
  var imgwidth = e.detail.width,
    imgheight = e.detail.height,
    //宽高比  
    ratio = imgwidth / imgheight;
  //计算的高度值  
  var viewHeight = 750 / ratio;
  var imgheight = viewHeight;
  var imgheights = this.data.imgheights;
  //把每一张图片的对应的高度记录到数组里  
  imgheights[e.target.dataset.id] = imgheight;
  this.setData({
    imgheights: imgheights
  })
},
bindchange: function (e) {
  var VideoCtx =wx.createVideoContext('myVideo')
  VideoCtx.pause()
  this.setData({ 
    current: e.detail.current,
    autoplay:true, 
  })
},
videoPlay:function(e){
  this.setData({ 
    autoplay:false, 
  })
},
videoPause:function(e){
  this.setData({ 
    autoplay:true, 
  })
},
videoEnded:function(e){
  this.setData({ 
    autoplay:true, 
  })
},
//获取评论
getQueryThemeComment:function(){
  var params={
    id:this.data.id,
    startPage:1,
    pageSize:3
  }
  wx.showLoading({
    title: '加载中....',
        mask:true 
  })
  queryThemeComment(params).then(res=>{
    if(res.status==200){
      this.setData({
        ThemeComment:res.data.data
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
//进店铺
enterTheShop:function(event){  
  var sellerid=event.currentTarget.dataset.sellerid
  wx.navigateTo({
    url: '/pages/enterTheShop/index?sellerid='+sellerid,
    });
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
      var data=null
      res.data.forEach(v => {
        if(v.status==1){
          data=v
        }
      });
      if(data==null&&res.data.length>0){
        data=res.data[0]
      }
      that.setData({
        addressData:data
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
// 切换地址
getAddress:function(){
  if(this.data.addressData!=null&&this.data.addressData!=''){
    wx.navigateTo({
      url: '/pages/user/setUp/harvestAddress/index',
    });    
  }else{
    wx.navigateTo({
      url: '/pages/user/setUp/addAddress/index?type=add',
    });
  }
},
//关闭弹窗
hide:function(){
  this.setData({
    isloginPrompt:false
  })
},
//去登陆
getPerson:function(e){
  app.globalData.wxInfo=e.detail;
  wx.navigateTo({
    url: "/pages/logIn/index"
  });
},
//收藏
collect:function(){
  const that=this
  var params={
    userId:that.data.userId,
    objectId:that.data.id,
    type:1,
    status:0,
  }
  wx.showLoading({
    title: '加载中....',
        mask:true 
  })
  saveCart(params).then(res=>{    
    if(res.status==200){
      wx.showToast({
        title:'收藏成功',
        icon: 'none',
        duration: 1500,
      })
      var data=this.data.detailInfor
      data.collection=true
      this.setData({
        detailInfor:data
      })
      this.ISpecificaBtn()
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

//拨打电话
freeTell:function(event){
  var phone=event.currentTarget.dataset.phone
  wx.makePhoneCall({
    phoneNumber:phone
  })
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
  onShareAppMessage: function (res) {
    var that=this
    return {
      title: that.data.detailInfor.name,
      path: '/pages/commodity/productDetails/index?id='+that.data.id,
      imgUrl:that.data.imgUrl+that.data.detailInfor.headImg.uploadfilepath+that.data.detailInfor.headImg.uploadfilename,
      success: function(res) {
        // 转发成功，可以把当前页面的链接发送给后端，用于记录当前页面被转发了多少次或其他业务
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})