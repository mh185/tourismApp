// pages/user/editPerson/index.js
import { fileUpload } from '../../../utils/request'
import { updateUser } from '../../../utils/api/editPerson'
import { formatTime } from '../../../utils/util'
import { validateIdCard } from '../../../utils/validate'
var tcity = require("../../../utils/citys.js");
const app = getApp();
let entTime = formatTime(new Date()).replace(/(\/)/g, '-');
entTime = entTime.substr(0, 10);
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sex: [{ value: 0, text: '女' }, { value: 0, text: '男' }],
        endTime: entTime,
        userId: '',
        headImg: '',
        nickName: '',
        gender: '',
        birthday: '',
        idCard: '',
        idCardTips: '',
        // 地址三级联动
        provinces: [],
        province: "",
        citys: [],
        city: "",
        countys: [],
        county: '',
        value: [0, 0, 0],
        values: [0, 0, 0],
        condition: false,
        address: '',
        auth: {
            1: '未认证',
            2: '认证中',
            3: '已认证'
        },
        authStatus: 1
    },
  // 返回上一页
  onClickLeft() {
    wx.switchTab({
      url: '/pages/user/index'
    })
  },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onLoad: function(options) {
        var that = this;
        tcity.init(that);
        var cityData = that.data.cityData;
        const provinces = [];
        const citys = [];
        const countys = [];
        for (let i = 0; i < cityData.length; i++) {
            provinces.push(cityData[i].name);
        }
        for (let i = 0; i < cityData[0].sub.length; i++) {
            citys.push(cityData[0].sub[i].name)
        }
        for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
            countys.push(cityData[0].sub[0].sub[i].name)
        }
        that.setData({
                'provinces': provinces,
                'citys': citys,
                'countys': countys,
                'type': options.type
            })
            // this.setData({
            //     userId: app.globalData.userId,
            //     headImg: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.headImg : '',
            //     nickName: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.nickName : '',
            //     gender: app.globalData.wxUserInfo ? String(app.globalData.wxUserInfo.gender) : '',
            //     realName: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.realName : '',
            //     birthday: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.birthday : '',
            //     idCard: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.idCard : '',
            //     address: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.address : '',
            //     authStatus: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.authStatus : '',
            // });
    },
    onShow() {
        this.setData({
            userId: app.globalData.userId,
            headImg: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.headImg : '',
            nickName: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.nickName : '',
            gender: app.globalData.wxUserInfo ? String(app.globalData.wxUserInfo.gender) : '',
            realName: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.realName : '',
            birthday: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.birthday : '',
            idCard: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.idCard : '',
            address: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.address : '',
            authStatus: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.authStatus : '',
        });
    },
    bindGenderChange: function(e) {
        this.setData({
            gender: e.detail.value
        })
    },
    bindBirthdayChange: function(e) {
        this.setData({
            birthday: e.detail.value
        })
    },
    bindIdCardInput: function(e) {
        if (e.detail.value) {
            const idCardStatus = validateIdCard(e.detail.value);
            if (!idCardStatus) {
                this.setData({
                    idCardTips: '请输入正确的身份证号！'
                })
            } else {
                this.setData({
                    idCardTips: ''
                })
            }
        } else {
            this.setData({
                idCardTips: ''
            })
        }
    },
    goAuth() {
        wx.navigateTo({
            url: '/pages/user/realNameAuth/index',
        });
    },
    uploadImg: function() {
        var that = this;
        wx.showActionSheet({
            itemList: ['拍照', '从手机相册选择'],
            success(res) {
                var tapIndex = res.tapIndex
                if (tapIndex == 0) {
                    wx.chooseImage({
                        count: 1,
                        sizeType: ['compressed'],
                        sourceType: ['camera'], //相机
                        success(res) {
                            if (res) {
                                const tempFilePaths = res.tempFilePaths[0];
                                that.uploadFile(tempFilePaths);
                            }
                        }
                    })
                } else if (tapIndex == 1) {
                    wx.chooseImage({
                        count: 1,
                        sizeType: ['compressed'],
                        sourceType: ['album'], //相机
                        success(res) {
                            if (res) {
                                const tempFilePaths = res.tempFilePaths[0];
                                that.uploadFile(tempFilePaths);
                            }
                        }
                    })
                }
            },
        });
    },
    uploadFile: function(file) {
        const that = this;
        fileUpload({ file }).then(resg => {
            if (resg.status == 200) {
                const headImg = `${app.globalData.imgUrl}${resg.data.uploadfilepath}${resg.data.uploadfilename}`
                that.setData({
                    headImg
                })
            }
        });
    },
    /**
     * 提交
     */
    formSubmit: function(e) {
        const _that = this;
        const data = e.detail.value;
        data.id = this.data.userId;
        data.headImg = this.data.headImg;
        data.address = this.data.province + this.data.city + this.data.county
        if (this.idCardTips == '') {
            return false;
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        updateUser(data).then(res => {
            wx.hideLoading()
            if (res.status == 200) {
                app.globalData.wxUserInfo = res.data;
                wx.showToast({
                    title: '编辑成功',
                    icon: 'none',
                    duration: 1500,
                    success: function() {
                        setTimeout(function() {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }, 500)
                    }
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }
        })
    },
    //省市区三级联动
    bindChange: function(e) {
        var values = e.detail.value;
        this.setData({
            values
        })
        this.getAddressInfo();
    },
    /**
     * 打开地址联动弹窗
     */
    open: function() {
        this.setData({
            condition: !this.data.condition
        })
    },
    /**
     * 关闭地址联动弹窗
     */
    close: function() {
        this.setData({
            condition: !this.data.condition
        });
        this.getAddressInfo();
    },
    /**
     * 通过选择的code，解析json得到地址信息
     */
    getAddressInfo: function() {
        var val = this.data.values;
        var cityData = this.data.cityData;
        const citys = [];
        const countys = [];
        for (let i = 0; i < cityData[val[0]].sub.length; i++) {
            citys.push(cityData[val[0]].sub[i].name)
        }
        for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
            countys.push(cityData[val[0]].sub[0].sub[i].name)
        }
        this.setData({
            province: this.data.provinces[val[0]],
            city: citys[val[1]],
            citys: citys,
            county: countys[val[2]],
            countys: countys,
            value: val,
            address: this.data.provinces[val[0]] + citys[val[1]] + countys[val[2]]
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

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
    onShareAppMessage: function() {

    }
})