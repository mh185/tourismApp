/**
 * 秒杀商品详情
 */
import { getSeckillDetails, queryDiscountForPC, queryGoodsLabel, queryThemeComment, saveCart, queryCartNum, queryAddress } from '../../../utils/api/index'
import { orderData } from '../../../utils/util'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: imgUrl,
        userId: '',
        userInfor: '',
        lineIndex: 1, //1商品,2详情
        topHeight: '',
        ISpecifica: false,
        number: 1, //商品数量,
        id: '', //商品id
        detailInfor: null, //商品信息
        autoplay: true,
        //所有图片的高度  
        imgheights: [],
        //默认  
        current: 0,
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

        couponModel: false, // 优惠卷模态框

        timer: '', // 定时器
        time_d: '00', // 小时
        time_h: '00', // 小时
        time_m: '00', // 分
        time_s: '00', //秒
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const that = this;
        that.setData({
            id: options.id
                // id: '2c908084727d3e8b01728296d5c3002b'
        })
        app.globalData.shareId = options.userId // 分销人Id
        this.getSeckillDetails()
        this.getQueryThemeComment()
        if (app.globalData.userId != null && app.globalData.userId != '') {
            this.getqueryCartNum()
        }
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
            userInfor: app.globalData.wxUserInfo,
        })
        this.getQueryAddress()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

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
    // 拼装订单需要的数据
    orderData() {

        let sku = this.data.selectsLabel // 一個規格信息，也就是sku

        sku.number = this.data.number // sku 数量

        let seller = this.data.detailInfor.seller; // 商家信息

        let goods = []; // 商品列表，一般是只SKU

        let details = this.data.detailInfor; //  商品詳情

        details.sku = sku;

        details.goods_type = 1 // //类型(0:一般商品 ;1：秒杀订单；2：拼团订单；3：积分兑换)
        goods.push(this.data.detailInfor)

        let orderLists = [
            // 一個商家
            {
                seller: seller,
                goods_type: 1, // 0:一般商品 ;1：秒杀订单；2：拼团订单；3：积分兑换
                goods: goods
            }
        ]

        orderData(orderLists, 'seckillDetails');


    },



    //购买
    orderBuy: function(event) {

        if (this.data.userId == null || this.data.userId == '') {
            this.setData({
                isloginPrompt: true
            })
            return false
        }

        if (+this.data.time_d == 0 && +this.data.time_h == 0 && +this.data.time_m && +this.data.time_s) {

            wx.showToast({
                title: '秒杀活动已结束',
                icon: 'none'
            })

            return false;

        }




        // 订单数据


        this.orderData();

        // app.globalData.goodsDetails.orderKind = type; // 1 购买订单  2 发起拼团  3 参与拼团


        if (this.data.selectsLabel != null) {
            // app.globalData.goodsDetails.goods_type = 1; //类型(0:一般商品 ;1：秒杀订单；2：拼团订单；3：积分兑换)

            wx.navigateTo({
                url: '/pages/commodity/confirmOrder/index',
            });


        } else {

            // 选择规格

            this.openPecificaBtn()
        }
    },

    // 倒计时
    countdown(time) {

        this.data.timer = setInterval(() => {

            let nowTime = new Date().getTime();


            let mss = time - nowTime;

            // 如果结束时间小于当前时间，重新请求数据

            if (mss <= 0) {
                clearInterval(this.data.timer);

                return false;

            }


            // 将时间差（毫秒）格式为：天时分秒
            let day = parseInt(mss / (1000 * 60 * 60 * 24));
            let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = parseInt((mss % (1000 * 60)) / 1000);
            if (day < 10) day = '0' + day;
            if (hours < 10) hours = '0' + hours;
            if (minutes < 10) minutes = '0' + minutes;
            if (seconds < 10) seconds = '0' + seconds;


            this.setData({
                time_d: +day,
                time_h: hours,
                time_m: minutes,
                time_s: seconds
            })


        }, 1000)

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
    //打开规格选择弹窗
    openPecificaBtn: function(event) {
        const that = this
        if (this.data.userId == null || this.data.userId == '') {
            this.setData({
                isloginPrompt: true
            })
            return false
        }

        this.setData({
            ISpecifica: true,
        })

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
        console.log(this.data.goodsLabel, 'index')
        this.setData({
            sectcLabelIndex: index,
            sectcgoodsLabelId: this.data.goodsLabel[index].activityObj.id,
            selectsLabel: that.data.goodsLabel[index],
            number: 1
        })

        this.countdown(this.data.goodsLabel[index].activityObj.endTime);
        console.log(this.data.goodsLabel, '------------------------------')
    },
    //加
    plus: function() {
        var number = this.data.number
        number++
        if (this.data.selectsLabel != null && number > this.data.selectsLabel.activityObj.maxBuyNum) {
            wx.showToast({
                title: '最多只能购买两件',
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
        console.log("4444");
        wx.switchTab({
            url: '/pages/shopCart/index'
        })
    },
    //获取商品详情
    getSeckillDetails: function() {
        const that = this
        var params = {
            goodsId: that.data.id,
            userId: app.globalData.userId,
        }

        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        getSeckillDetails(params).then(res => {
            if (res.status == 200) {
                var data = res.data
                data.body = data.body.replace(/<img[^>]*>/gi, function(match, capture) {
                    return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;"') // 替换style
                })
                data.body = data.body.replace(/\<img/gi, '<img style="max-width:100% !important;height:auto" ')

                this.setData({
                    detailInfor: data,
                    goodsLabel: data.labelList
                })

                // 获取优惠卷

                this.getCardList();

                // 默认选择第一个

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
            path: '/pages/commodity/seckillDetails/index?id=' + that.data.id + '&userId=' + this.data.userId,
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