//app.js

App({
    onLaunch:function() {
       
        
        
        var that = this
            // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
            // 登录
        // that.overShare()
        wx.login({
            success: res => {
                wx.request({
                    // url: that.globalData.host + '/login/v1/in/applets?code=' + res.code,
                  url: that.globalData.host + '/login/v1/in/applets?code=' + res.code + '&appId=wx7e192938c604b4a3',
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: element => {
                        console.log('--------login', element)
                        if (!element.data.data.state) {
                            if (element.data.data.mobile != null && element.data.data.mobile != '') {
                                that.globalData.userId = element.data.data.userId
                                wx.setStorageSync('userId', that.globalData.userId)
                                that.globalData.wxUserInfo = element.data.data
                                that.globalData.openId = element.data.data.openId
                                that.globalData.token=element.data.data.token
                            }
                        } else {
                            that.globalData.openId = element.data.data
                        }
                    }
                })
            }
        });;
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(function(res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function() {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function(res) {
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function() {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                        })
                    })
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }

    },
    globalData: {
        // host: 'https://shopping.metro-orientalplaza.cn/api', // 正式
        imgUrl: 'https://shopping.metro-orientalplaza.cn/file', // 正式
        scenicHost: 'https://lzzhly.wglj.liuzhou.gov.cn/scenicSpotBooking',//景区预约测试地址
        // scenicHost: 'https://nc.gxota.com/basic',//景区预约测试地址
        // imgUrl: 'http://183.66.230.94:5080/images/root/project', // 正式2
        // host: 'http://192.168.1.10:8080',//超哥
        // host: 'http://183.66.194.186:8081', // 测试导游Api
        // host:'http://10.189.13.192:8082',//吴川
        host: 'https://lzzhly.wglj.liuzhou.gov.cn', // 正式
        // host: 'http://39.98.209.203:8090',//景区预约测试地址
        // host: 'http://192.168.2.2:8080/ZTwordMaven', // 本地
        // host: 'http://192.168.2.76:8080/ZTwordMaven', // 本地
        // imgUrl:'http://39.98.185.89:8080/ZTwordMaven',// 本地
        // host:'http://192.168.3.176:8080/ZTwordMaven',// 佳林
        iconUrl:'https://lzzhly.wglj.liuzhou.gov.cn/icon',//图标And图片地址
        wxInfo: null, //微信本地用户信息
        wxUserInfo: null, //微信用户信息
        userId: '', //用户id  402882827355b2d2017355bc8f910000s
        userPhone: '',//用户电话
        appid: "wx7e192938c604b4a3",
        address: null,
        confirmOrder: null,
        openId: '',
        shareId: '', // 分想人ID
        weathers: '',//天气
    },
            //重写分享方法
            // overShare: function () {
            //     //监听路由切换
            //     //间接实现全局设置分享内容
            //     wx.onAppRoute(function (res) {
            //         //获取加载的页面
            //         let pages = getCurrentPages(),
            //             //获取当前页面的对象
            //             view = pages[pages.length - 1],
            //             data;
            //         if (view) {
            //             data = view.data;
            //             console.log('是否重写分享方法', view.is);
            //             if (!data.isOverShare) {
            //                 data.isOverShare = true;
            //                 view.onShareAppMessage = function () {
            //                     //你的分享配置
            //                     return {
            //                         title: '旅游',
            //                         // path:view.is+'/?isshare=1'
            //                     };
            //                 }
            //             }
            //         }
            //     })
            // },
})
