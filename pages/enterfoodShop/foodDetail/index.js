// pages/enterfoodShop/foodDetail/index.js
import { queryGoodsDetail, unionpay, addOrderNew } from '../../../utils/api/index'
var app = getApp();
console.log(app);
const imgUrl = app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',//商品id
    foodInfo: '',//详情
    imgUrl: imgUrl,
    addressData: '',
    labelid: '',//规格id
    price: '',// 商品价格
    orderId:[],// 订单id
    labelname:'',// 商品规格名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id,
      labelid: options.labelid,
      price: options.price,
      labelname:options.labelname
    })
    this.queryGoodsDetail()
  },
  /**
 * 查询商品详情
 */
  queryGoodsDetail: function () {
    var params = {
      id: this.data.id,
    }
    queryGoodsDetail(params).then(res => {
      if (res.status == 200) {
        // console.log(res);
        var data = res.data
        data.body = data.body.replace(/<img[^>]*>/gi, function (match, capture) {
          return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;"') // 替换style
        })
        data.body = data.body.replace(/\<img/gi, '<img style="max-width:100% !important;height:auto" ')
        this.setData({
          foodInfo: data,
        })
      }
    })
  },
  /**
   * 购买  生成订单
   */
  buyBtn: function () {
    console.log(2);
    let foodIndo = this.data.foodInfo
    let orderList = [
      {
        "sellerId": foodIndo.seller.id,
        "invoice": "",
        "price": this.data.price,
        "type": 1,
        "body": foodIndo.body,
        "startDate": foodIndo.startDate,
        "endDate": foodIndo.endDate,
        "remarks": "",
        "discountId": '',


        // "integral": foodIndo.seller.integral,
        // "body":'',
        
        "orderGoodsInfos": [{
          "distributorUserId": '',
          "parentGroupId": '',
          "type": '0',
          // "objId":'2c908084727d3e8b0172833a4dc5003f',
          "objId": this.data.labelid,
          "goodsId": foodIndo.id,
          // "goodsId":"2c9080847298607101729c2ec7c00022",
          // "goodsId":foodIndo.id,
          "goodsTitle": foodIndo.name,
          "goodsNum": 1,
          "goodsLabel": this.data.labelname,
          "goodsHeadImg": foodIndo.headImg,
          "goodsNowPrice": this.data.price,
          "status": 1
        }],
      }]
    let params = {
      userId: app.globalData.wxUserInfo.id,//用户id
      userName: app.globalData.wxUserInfo.nickName, // 收货人
      phone: app.globalData.wxUserInfo.phone, // 收货人电话
      // invoice: JSON.stringify(this.data.invoiceData),
      anonymous: 0, // 是否匿名
      buyType: 0, //购买方式 0：钱 1：积分
      googsInfo: orderList
    }
    params.googsInfo = JSON.stringify(params.googsInfo);
    console.log(params.googsInfo);
    addOrderNew(params).then(res => {
      if (res.status == 200) {
        var orderId = []
        res.data.forEach(v => {
          orderId.push(v.id)
        })
        this.setData({
          orderId:orderId
        })
        this.getUnionpay()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  getUnionpay: function() {
    var that = this
    var params = {
        openid: app.globalData.openId,
        orderId: this.data.orderId
        
    }
    console.log(params);
    wx.showLoading({
        title: '加载中....',
        mask: true
    })
    unionpay(params).then(res => {
        if (res.status == 200) {
            // this.deleteshopCartn(ids)
            var data = JSON.parse(res.data)
            console.log(res)
            if (data.errCode == 'SUCCESS') {
                app.globalData.confirmOrder = null
                var respStr = JSON.parse(data.respStr)
                wx.requestPayment({
                    timeStamp: respStr.miniPayRequest.timeStamp, // 1490840662，时间戳
                    nonceStr: respStr.miniPayRequest.nonceStr, // 5K8264ILTKCH16CQ2502SI8ZNMTM67VS，随机字符串不长于32位
                    package: respStr.miniPayRequest.package,
                    signType: respStr.miniPayRequest.signType, // 签名算法类型，默认MD5，支持HMAC-SHA256和MD5
                    paySign: respStr.miniPayRequest.paySign, // 签名,假设已拼接，详细签名格式见下文
                    // timeStamp:'1591947016',     // 1490840662，时间戳
                    // nonceStr:'45817dd041844316adfcef6a2852f2ab',    // 5K8264ILTKCH16CQ2502SI8ZNMTM67VS，随机字符串不长于32位
                    // package:'prepay_id=wx121530159589964755ed1fed1086993700',    
                    // signType: 'RSA',  // 签名算法类型，默认MD5，支持HMAC-SHA256和MD5
                    // paySign:'hs0H56mZ+nB+0LZAPbWwVdamII1f8EMdaxkLMkX8gCc+xUCzwlbXihNPNrsuz1tMi8CHXWEqwSyyHQt8YOSrAmOdpms+C71mWr91OtufZliCYbWAA/pZvqKW6oUd/SSRJY0N+W0K1eyZG5rbwvRI2kldFmiAOHuDBxmrMWZS+5EkZ1sg2eOx1VlDBNgsTwETxje4FKUcNs/9tElEH2bEcc0OKb/I7ANmHWCvA7A68gFrJ50/kavD3xZ+yPPzdfppILtzJ66rVusO+bYB7cNVAXOP6guObI+ETMK0xwZYQ6htfqY1P7gxyq12u7gv9lthJR2jloSrOmbTQ67iqTpxwg==',    // 签名,假设已拼接，详细签名格式见下文
                    success: function(res) {
                        wx.redirectTo({
                            url: "/pages/payStatus/paysuccess/index"
                        });
                    },
                    fail: function(res) {
                        wx.redirectTo({
                            url: "/pages/payStatus/payfailure/index"
                        });
                    },
                    complete: function(res) {}
                })
            } else {
                var respStr = JSON.parse(data.respStr)
                wx.showToast({
                    title: respStr.errMsg,
                    icon: 'none',
                    duration: 1500,
                })
            }

        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1500,
            })
        }
        // wx.hideLoading()
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