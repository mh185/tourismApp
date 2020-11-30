/**
 * 拼团商品详情
 */
import {
    queryGroupGoodsDetail,
    queryGoodsLabel,
    queryThemeComment,
    saveCart,
    queryCartNum,
    queryAddress,
    queryGroupGoodsUser,
    queryDiscountForPC,
    claimCard
} from '../../../utils/api/index'

import { createOrder } from '../../../utils/api/myOrder'
import { orderData } from '../../../utils/util'
var app = getApp();
const imgUrl = app.globalData.imgUrl
const util = require('../../../utils/dataTimes')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        datetimeTo: "", //开始时间
        timeLeft: '', //结束时间
        imgUrl: imgUrl,
        userId: '',
        userInfor: '',
        lineIndex: 1, //1商品,2详情
        topHeight: '',
        ISpecifica: false,
        number: 1, //商品数量,
        id: '', //商品id
        goodsLabelIdone: '', //第一个规则
        sectcgoodsLabelId: '', //任意规格goodsLabelId
        detailInfor: null, //商品信息
        autoplay: true,
        //所有图片的高度  
        imgheights: [],
        //默认  
        current: 0,
        //默认已选
        selectsLabelone: '',
        goodsLabel: [], //商品规格
        selectsLabel: null,
        sectcLabelIndex: '', //选中规格的下标
        type: '', //有购物车打开，还是直接购买，1直接购买，2购物车
        ThemeComment: [], //评论
        commentPoint: [{
            dark: '../../../images/icon-pentag-no.png',
            bright: '../../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../../images/icon-pentag-no.png',
            bright: '../../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../../images/icon-pentag-no.png',
            bright: '../../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../../images/icon-pentag-no.png',
            bright: '../../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../../images/icon-pentag-no.png',
            bright: '../../../images/icon-pentag-Yes.png',
        }],
        cartNumber: 0,
        addressData: null, //获取地址
        isloginPrompt: false,
        gopopup: false, //
        groupLishshow: false, //查看更多框
        groupUserlists: [], //拼团用户列表
        nickName: '', // 拼团发起用户
        userheadImg: '', //拼团用户头像
        lenum: '', //差多少人
        usersendDate: '', //用户结束时间
        groupIndex: 0, // 拼团弹出框索引

        cardList: [], // 优惠券列表
        couponModel: false, //优惠券弹框

        shareId: '', // 分享人id

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const that = this;

        that.setData({
            id: options.id,
            // id: '2c908084727d3e8b01728296d5c3002b',
            // goodsLabelIdone: options.goodsLabelIdone,
            // goodsLabelId:options.goodsLabelId
            shareId: options.userId
        })
        app.globalData.shareId = options.userId
        this.queryGroupGoodsDetail()
        this.getQueryThemeComment()
        if (app.globalData.userId != null && app.globalData.userId != '') {
            this.getqueryCartNum()
        }
        // this.queryGroupGoodsUsers()
        // this.queryGroupGoodsUserone()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {



    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

        this.setData({
            topHeight: '',
            isloginPrompt: false,
            ISpecifica: false,
            userId: app.globalData.userId,
            // userId: '402882827355b2d2017355bc8f910000',
            userInfor: app.globalData.wxUserInfo,
        })
        this.getQueryAddress()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

        clearInterval(this.data.timer);

    },
    onPageScroll: function(e) {
        var that = this;
        if (that.data.topHeight == '') {
            var query = wx.createSelectorQuery();
            query.select('.productDetailsCenter').boundingClientRect(function(rect) {
                that.setData({
                    topHeight: rect.height - 60
                })
            }).exec();
        }
        if (e.scrollTop >= that.data.topHeight) {
            that.setData({
                lineIndex: 2
            })
        } else {
            that.setData({
                lineIndex: 1
            })
        }
    },
    positionBtn: function(e) {
        var that = this
        var i = e.currentTarget.dataset.index;
        if (that.data.lineIndex != i) {

            that.setData({
                lineIndex: i
            })
            if (i == 1) {
                wx.pageScrollTo({
                    scrollTop: 0
                })
            } else {
                if (that.data.topHeight == '') {
                    var query = wx.createSelectorQuery();
                    query.select('.productDetailsCenter').boundingClientRect(function(rect) {
                        that.setData({
                            topHeight: rect.height - 60
                        })
                        wx.pageScrollTo({
                            scrollTop: rect.height + 5
                        })
                    }).exec();
                } else {
                    wx.pageScrollTo({
                        scrollTop: that.data.topHeight + 5
                    })
                }

            }
        }
    },

    // 获取优惠价卷列表

    getCardList() {

        var params = {
            startPage: 1,
            pageSize: 999,
            state: 1, //0：未开始;1:进行中；2：已停止
            sellerId: this.data.detailInfor.seller.id

        }
        queryDiscountForPC(params).then(res => {
            if (res.status == 200) {
                res.data.forEach(item => {
                    item.discountDate = JSON.parse(item.discountDate);
                })
                this.setData({
                    cardList: res.data
                })
            }
        })
    },

    // 领取优惠卷

    claimCard(e) {


        let params = {
            discountId: e.currentTarget.dataset.id
        }

        claimCard(params).then(res => {

            if (res.status == 200) {

                wx.showToast({
                    title: '领取成功~',
                })

                // 刷新数据

                this.getCardList();

            } else {
                wx.showToast({
                    animation: true,
                    title: res.msg,
                    icon: 'none'
                })
            }
        })


    },
    //跳转全部评价
    allcomment: function() {
        wx.navigateTo({
            url: '/pages/commodity/allComment/index?id=' + this.data.id,
        });
    },
    //关闭规格选择弹窗
    ISpecificaBtn: function() {
        this.setData({
            ISpecifica: false
        })
    },
    // 打开优惠券弹窗
    openCouponModelBtn: function() {
        this.setData({
            couponModel: true,
        })
    },
    // 关闭优惠券弹窗
    couponModelBtn: function() {
        this.setData({
            couponModel: false,
        })
    },
    //打开规格选择弹窗
    openPecificaBtn: function(event) {
        const that = this
        if (this.data.userId == null || this.data.userId == '') {
            this.setData({
                isloginPrompt: true
            })
            return false
        }
        if (event) {
            var type = event.currentTarget.dataset.type
            this.setData({
                type: type,
                ISpecifica: true,
            })
        }


        var params = {
                goodsId: that.data.detailInfor.id
            }
            // queryGoodsLabel(params).then(res=>{
            //   if(res.status==200){
            //     this.setData({
            //       ISpecifica:true,
            //       goodsLabel:res.data
            //     })
            //   }else{
            //     wx.showToast({
            //       title:res.msg,
            //       icon: 'none',
            //       duration: 1500,
            //     })
            //   }
            //   wx.hideLoading()
            // }) 
    },
    //选择规格
    sectcLabel: function(event) {
        var that = this;
        var index = ''
        try {
            index = event.currentTarget.dataset.index

        } catch (error) {
            index = event

        }
        // var sectcgoodsLabelId = event.currentTarget.dataset.goodslabelid
        console.log(index, 'index')
        this.setData({
            sectcLabelIndex: index,
            sectcgoodsLabelId: this.data.goodsLabel[index].activityObj.goodsLabelId,
            selectsLabel: that.data.goodsLabel[index],
            number: 1
        })
        this.queryGroupGoodsUserone()
    },
    //加
    plus: function() {
        var number = this.data.number
        number++
        if (this.data.selectsLabel != null && number > this.data.selectsLabel.stock) {
            wx.showToast({
                title: '已达商品最大库存',
                icon: 'none',
                duration: 1500,
            })
            return false
        } else if (this.data.detailInfor != null && number > this.data.detailInfor.stockNum) {
            wx.showToast({
                title: '已达商品最大库存',
                icon: 'none',
                duration: 1500,
            })
            return false
        }
        this.setData({
            number: number
        })
    },
    //减
    less: function() {
        var number = this.data.number
        number--
        if (number > 0) {
            this.setData({
                number: number
            })
        } else {
            this.setData({
                number: 1
            })
        }
    },

    // 拼装订单需要的数据
    orderData(type) {

        let sku = this.data.selectsLabel // 一個規格信息，也就是sku

        sku.number = this.data.number // sku 数量

        let seller = this.data.detailInfor.seller; // 商家信息

        let goods = []; // 商品列表，一般是只SKU

        let details = this.data.detailInfor; //  商品詳情


        details.sku = sku;
        try {

            details.parentGroupId = this.data.groupUserlists[this.data.groupIndex].id; // 拼团ID


        } catch (e) {

        }

        details.goods_type = type == 1 ? 0 : 2 // //类型(0:一般商品 ;1：秒杀订单；2：拼团订单；3：积分兑换)
        goods.push(this.data.detailInfor)

        let orderLists = [
            // 一個商家
            {
                seller: seller,
                goods_type: 0, // 0:一般商品 ;1：秒杀订单；2：拼团订单；3：积分兑换
                goods: goods
            }
        ]

        orderData(orderLists, 'grounpDetails');


        // let price = '';

        // if (type == 1) {
        //     price = this.data.selectsLabel.price;
        // } else {
        //     price = this.data.selectsLabel.activityObj.groupPrice
        // }
        // var orderList = []
        // var list = []
        // var shopInfor = {
        //     cartId: this.data.selectsLabel.id,
        //     cartLabel: this.data.selectsLabel.labelName,
        //     cartNum: this.data.number,
        //     cartPrice: price,
        //     freightPrice: this.data.detailInfor.freightPrice,
        //     goodsId: this.data.detailInfor.id,
        //     goodsLabel: [],
        //     headImg: this.data.detailInfor.headImg,
        //     integral: 0,
        //     name: this.data.detailInfor.name,
        //     price: this.data.detailInfor.nowPrice,
        //     rawPrice: this.data.detailInfor.rawPrice,
        //     stockNum: this.data.selectsLabel.stock,
        // }
        // list.push(shopInfor)
        // var orderData = {
        //     sellerId: this.data.detailInfor.seller.id,
        //     shopName: this.data.detailInfor.seller.shopName,
        //     courierFee: this.data.detailInfor.seller.freightPrice,
        //     goods: list
        // }
        // orderList.push(orderData)
        // app.globalData.confirmOrder = orderList;

        // app.globalData.goodsDetails = this.data.detailInfor; // 商品详情

        // app.globalData.goodsDetails.shareId = this.data.shareId; // 分享人Id



        // app.globalData.goodsDetails.sectcLabelIndex = this.data.sectcLabelIndex; // 选中的规格索引


    },



    //购买
    orderBuy: function(event) {
        if (this.data.userId == null || this.data.userId == '') {
            this.setData({
                isloginPrompt: true
            })
            return false
        }

        var type = +event.currentTarget.dataset.type


        // 订单数据

        this.orderData(type);

        // app.globalData.goodsDetails.orderKind = type; // 1 购买订单  2 发起拼团  3 参与拼团


        if (this.data.selectsLabel != null) {

            wx.navigateTo({
                url: '/pages/commodity/confirmOrder/index',
            });


        } else {

            // 选择规格

            this.openPecificaBtn()
        }
    },

    //规格弹窗确定
    specificaBtn: function() {
        if (this.data.selectsLabel != null) {
            this.queryGroupGoodsUsers()
            this.setData({
                ISpecifica: false,
            })
        } else {
            wx.showToast({
                title: '请选择商品规格',
                icon: 'none',
                duration: 1500,
            })
        }
    },
    //查询购物车数量
    getqueryCartNum: function() {
        const that = this
        var params = {
            userId: app.globalData.userId,
            type: 0,
            status: 0
        }
        queryCartNum(params).then(res => {
            if (res.status == 200) {
                this.setData({
                    cartNumber: res.data
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }
            wx.hideLoading()
        })
    },
    //前往购物车
    goCart: function() {
        console.log("222");
        wx.switchTab({
            url: '/pages/shopCart/index'
        })
    },
    //获取商品详情
    queryGroupGoodsDetail: function() {
        const that = this
        var params = {
            goodsId: that.data.id,
            userId: app.globalData.userId,
            lng: '',
            lat: '',
        }
        for (var key in params) {
            if (params[key] === '') {
                delete params[key]
            }
        }
        wx.showLoading({
                title: '加载中....',
                mask: true
            })
            // console.log(that.data.id);
        queryGroupGoodsDetail(params).then(res => {
            if (res.status == 200) {

                var data = res.data
                    // shanp
                    // console.log(data);
                data.body = data.body.replace(/<img[^>]*>/gi, function(match, capture) {
                    return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;"') // 替换style
                })
                data.body = data.body.replace(/\<img/gi, '<img style="max-width:100% !important;height:auto" ')

                this.setData({
                    detailInfor: data,
                    goodsLabel: data.labelList,
                    selectsLabelone: data.labelList[0].labelName,
                    goodsLabelId: data.labelList[0].activityObj.id
                })

                // 获取优惠卷

                this.getCardList();

                // 规格默认选择第一个

                this.sectcLabel(0);


            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }
            wx.hideLoading()
        })

    },
    //顶部轮播图高度
    imageLoad: function(e) { //获取图片真实宽度  
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
    bindchange: function(e) {
        var VideoCtx = wx.createVideoContext('myVideo')
        VideoCtx.pause()
        this.setData({
            current: e.detail.current,
            autoplay: true,
        })
    },
    videoPlay: function(e) {
        this.setData({
            autoplay: false,
        })
    },
    videoPause: function(e) {
        this.setData({
            autoplay: true,
        })
    },
    videoEnded: function(e) {
        this.setData({
            autoplay: true,
        })
    },
    //获取评论
    getQueryThemeComment: function() {
        var params = {
            id: this.data.id,
            startPage: 1,
            pageSize: 3
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        queryThemeComment(params).then(res => {
            if (res.status == 200) {
                this.setData({
                    ThemeComment: res.data.data
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }
            wx.hideLoading()
        })
    },
    //进店铺
    enterTheShop: function(event) {
        var sellerid = event.currentTarget.dataset.sellerid
        wx.navigateTo({
            url: '/pages/enterTheShop/index?sellerid=' + sellerid,
        });
    },
    //获取收货地址
    getQueryAddress: function() {
        const that = this
        var params = {
            userId: app.globalData.userId,
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        queryAddress(params).then(res => {
            if (res.status == 200) {
                var data = null
                res.data.forEach(v => {
                    if (v.status == 1) {
                        data = v
                    }
                });
                if (data == null && res.data.length > 0) {
                    data = res.data[0]
                }
                that.setData({
                    addressData: data
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }
            wx.hideLoading()
        })
    },
    // 切换地址
    getAddress: function() {
        if (this.data.addressData != null && this.data.addressData != '') {
            wx.navigateTo({
                url: '/pages/user/setUp/harvestAddress/index',
            });
        } else {
            wx.navigateTo({
                url: '/pages/user/setUp/addAddress/index?type=add',
            });
        }
    },
    //关闭弹窗
    hide: function() {
        this.setData({
            isloginPrompt: false
        })
    },
    //去登陆
    getPerson: function(e) {
        app.globalData.wxInfo = e.detail;
        wx.navigateTo({
            url: "/pages/logIn/index"
        });
    },
    //收藏
    collect: function() {
        const that = this
        var params = {
            userId: that.data.userId,
            objectId: that.data.id,
            type: 1,
            status: 0,
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        saveCart(params).then(res => {
            if (res.status == 200) {
                wx.showToast({
                    title: '收藏成功',
                    icon: 'none',
                    duration: 1500,
                })
                var data = this.data.detailInfor
                data.collection = true
                this.setData({
                    detailInfor: data
                })
                this.ISpecificaBtn()
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }
            wx.hideLoading()
        })
    },

    //拨打电话
    freeTell: function(event) {
        var phone = event.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    /**
     * 获取正在进行中的拼团
     */
    queryGroupGoodsUserone: function() {
        const that = this
        var params = {
            // goodsLabelId: that.data.goodsLabelIdone,
            goodsLabelId: that.data.selectsLabel.activityObj.id,
            startPage: 1,
            pageSize: 999,
        }
        console.log(that.data.goodsLabelIdone);
        queryGroupGoodsUser(params).then(res => {
            if (res.status == 200) {
                // console.log(res.data,'--------------------');

                // 启动定时器

                this.countdown(res.data);


                // let listaDatas = [

                // ]

                // for (let index = 0; index < res.data.length; index++) {
                //   // var obj = [];
                //   // let objs = {
                //   //   endDates: res.data[index].endDate
                //   // }
                //   // obj.push(objs)
                //   // console.log(obj)

                //   // function getTimeLeft(datetimeTo) {
                //   //   // 计算目标与现在时间差（毫秒）
                //   //   let time2 = new Date().getTime();
                //   //   let mss = datetimeTo - time2; // console.log(datetimeTo - time2); // 将时间差（毫秒）格式为：天时分秒 // let days = parseInt(mss / (1000 * 60 * 60 * 24));
                //   //   let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                //   //   let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                //   //   let seconds = parseInt((mss % (1000 * 60)) / 1000);

                //   //   return hours + "-" + minutes + "-" + seconds;
                //   // }
                //   // let datamesssss = []
                //   //  obj.map((item, inx) => {
                //   //   item.clearInterval = setInterval((_) => {
                //   //     let time = getTimeLeft(item.endDates);

                //   //     // datamesssss.push(time)
                //   //     // return time;
                //   //     // var datamesssss = time
                //   //     console.log(time)
                //   //     let items = time.trim().split("-");
                //   //     // console.log(items[0] == "0", items[1] == "0", items[2] == "0");
                //   //     if (items[0] == "0" && items[1] == "0" && items[2] == "0") {
                //   //       clearInterval(item.clearInterval);
                //   //       return  ;
                //   //     }
                //   //   }, 1000);
                //   // });
                //   // console.log(datamesssss)
                //   let time1 = new Date(res.data[index].endDate).getTime();
                //   let time2 = new Date().getTime();
                //   let mss = time1 - time2;

                //   // 将时间差（毫秒）格式为：天时分秒
                //   let days = parseInt(mss / (1000 * 60 * 60 * 24));
                //   let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                //   let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                //   let seconds = parseInt((mss % (1000 * 60)) / 1000);

                //   let datatimess = days + ":" + hours + ":" + minutes + ":" + seconds + ""

                //   let elements = {
                //     nickName: res.data[index].nickName,
                //     headImg: res.data[index].headImg,
                //     endDate: datatimess,
                //     groupNum: Number(res.data[index].groupNum) - Number(res.data[index].groupUserList.length) - 1
                //   }
                //   listaDatas.push(elements)

                // }
                // console.log(listaDatas)

                // this.setData({
                //   groupUserlists: listaDatas,
                // })
                // that.setData({
                //   groupUserlists: listaDatas,
                // })
            }
        })
    },
    // 倒计时
    countdown(list) {

        this.data.timer = setInterval(() => {

            let nowTime = new Date().getTime();

            list.forEach((item, index) => {

                let endTime = new Date(item.endDate).getTime();

                let mss = endTime - nowTime;

                // 如果结束时间小于当前时间，重新请求数据

                if (mss <= 0) {

                    clearInterval(this.data.timer);

                    this.queryGroupGoodsUser();

                    return false;

                }

                // 将时间差（毫秒）格式为：天时分秒
                let days = parseInt(mss / (1000 * 60 * 60 * 24));
                let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = parseInt((mss % (1000 * 60)) / 1000);
                let datatimess = days + ":" + hours + ":" + minutes + ":" + seconds + "";
                item.countdownTime = datatimess;

            })

            this.setData({
                groupUserlists: list
            })

            // console.log(this.data.groupUserlists,'groupUserlists')

        }, 1000)

    },




    /**
     * 不同商品规格正在进行中的拼团
     */
    queryGroupGoodsUsers: function() {
        const that = this
        var params = {
            goodsLabelId: that.data.sectcgoodsLabelId,
            startPage: 1,
            pageSize: 10,
        }
        queryGroupGoodsUser(params).then(res => {
            if (res.status == 200) {
                console.log(res);

                let listaDatas = [

                ]

                for (let index = 0; index < res.data.length; index++) {
                    // var obj = [];
                    // let objs = {
                    //   endDates: res.data[index].endDate
                    // }
                    // obj.push(objs)
                    // console.log(obj)

                    // function getTimeLeft(datetimeTo) {
                    //   // 计算目标与现在时间差（毫秒）
                    //   let time2 = new Date().getTime();
                    //   let mss = datetimeTo - time2; // console.log(datetimeTo - time2); // 将时间差（毫秒）格式为：天时分秒 // let days = parseInt(mss / (1000 * 60 * 60 * 24));
                    //   let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    //   let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                    //   let seconds = parseInt((mss % (1000 * 60)) / 1000);

                    //   return hours + "-" + minutes + "-" + seconds;
                    // }
                    // let datamesssss = []
                    //  obj.map((item, inx) => {
                    //   item.clearInterval = setInterval((_) => {
                    //     let time = getTimeLeft(item.endDates);

                    //     // datamesssss.push(time)
                    //     // return time;
                    //     // var datamesssss = time
                    //     console.log(time)
                    //     let items = time.trim().split("-");
                    //     // console.log(items[0] == "0", items[1] == "0", items[2] == "0");
                    //     if (items[0] == "0" && items[1] == "0" && items[2] == "0") {
                    //       clearInterval(item.clearInterval);
                    //       return  ;
                    //     }
                    //   }, 1000);
                    // });
                    // console.log(datamesssss)
                    let time1 = new Date(res.data[index].endDate).getTime();
                    let time2 = new Date().getTime();
                    let mss = time1 - time2;

                    // 将时间差（毫秒）格式为：天时分秒
                    let days = parseInt(mss / (1000 * 60 * 60 * 24));
                    let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                    let seconds = parseInt((mss % (1000 * 60)) / 1000);

                    let datatimess = days + ":" + hours + ":" + minutes + ":" + seconds + ""

                    let elements = {
                        nickName: res.data[index].nickName,
                        headImg: res.data[index].headImg,
                        endDate: datatimess,
                        groupNum: Number(res.data[index].groupNum) - Number(res.data[index].groupUserList.length) - 1
                    }
                    listaDatas.push(elements)

                }
                // console.log(listaDatas)

                this.setData({
                        groupUserlists: listaDatas,
                    })
                    // that.setData({
                    //   groupUserlists: listaDatas,
                    // })
            }
        })
    },
    /**
     * 去拼团
     */
    goGroup: function(event) {

        this.setData({
            groupIndex: event.currentTarget.dataset.index
        })
        console.log(event);
        const { nickName, groupNum, headImg, endDate, countdownTime } = event.currentTarget.dataset.users


        // // 名字
        // var nickName = event.currentTarget.dataset.users.nickname
        // //还差几人
        // var groupNum = event.currentTarget.dataset.users.groupNum
        // // 头像
        // var userheadImg = event.currentTarget.dataset.users.headimg
        // // 倒计时
        // var endDate = event.currentTarget.dataset.users.endDate
        // console.log(nickName,userheadImg);
        this.setData({
            nickName: nickName, //名字
            lenum: groupNum, //差几人
            userheadImg: headImg, //头像
            usersendDate: countdownTime //结束时间

        })
        if (this.data.groupLishshow == true) {
            this.setData({
                groupLishshow: false
            })
        }
        this.setData({
            gopopup: !this.data.gopopup
        })
    },

    /**
     * 关闭拼团按钮
     */
    closeGroupBtn: function() {
        this.setData({
            gopopup: !this.data.gopopup
        })
    },
    /**
     * 查看更多
     */
    moreGroup: function() {
        this.setData({
            groupLishshow: !this.data.groupLishshow
        })
    },
    /**
     * 关闭查看更多框
     */
    closeseeGroupBtn: function() {
        this.setData({
            groupLishshow: !this.data.groupLishshow
        })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        var that = this
        return {
            title: that.data.detailInfor.name,
            path: '/pages/commodity/groupDetails/index?id=' + that.data.id + '&userId=' + this.data.userId,
            imgUrl: that.data.imgUrl + that.data.detailInfor.headImg.uploadfilepath + that.data.detailInfor.headImg.uploadfilename,
            success: function(res) {
                // 转发成功，可以把当前页面的链接发送给后端，用于记录当前页面被转发了多少次或其他业务
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }
})