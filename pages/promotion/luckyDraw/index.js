// pages/promotion/luckyDraw/index.js

import {
    queryLuckId,
    queryPrize,
    queryLuckRecord,
    queryScoreAndluck,
    startLuckDraw
} from '../../../utils/api/luckDraw'

import { formatTimeLine } from '../../../utils/util'

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        score: 0,
        surplus: 0,
        prizeId: '',
        luckId: '',
        isLoad: false,
        isStarting: false,
        isShowPopover: false,
        popoverType: '',
        popoverTitle: '',
        recordList: [],
        luckList: Array(12).fill({
            id: '',
            luckImg: '',
            luckName: '',
            grade: '',
            type: '',
            active: false
        }),
        swiper: {
            interval: 2000,
            duration: 300,
            circular: true,
            vertical: true,
            autoplay: true,
        },
        rollList: [
            "恭喜 李** 手机尾号2333 获得一等奖",
            "恭喜 王** 手机尾号6666 获得一等奖",
            "恭喜 张** 手机尾号8888 获得二等奖"
        ]
    },

    /**
     * 显示中奖记录
     */
    showRecord () {},

    /**
     * 包装图片地址
     */
    packImg (img) {
        try {
            const data = JSON.parse(img)
            return app.globalData.imgUrl + data.uploadfilepath + data.uploadfilename
        } catch (e) {
            return img
        }
    },

    /**
     * 祝你好运
     * 
     * index:       当前位置
     * time:        转动到下一个奖品时间
     * maxTime:     转动到下一个奖品最大时间
     * stepTime:    每次转动增加的时间
     */
    goodLuck (index, time, maxTime, stepTime) {
        let list = this.data.luckList
        let prizeId = this.data.prizeId

        setTimeout(() => {
            if (index > 11) {
                index = 0
                list[11].active = false
            } else if (index !== 0) {
                list[index - 1].active = false
            }

            list[index].active = true

            this.setData({
                luckList: list
            })

            console.log({ index, time, maxTime, prizeId, listId: list[index].id })

            // 转动到奖品
            if (time < maxTime || (prizeId && list[index].id !== prizeId)) {
                index++
                stepTime++
                time += stepTime
                
                this.goodLuck(index, time, maxTime, stepTime)
            } else {
                // 奖品等级5/奖品类型4: 未中奖
                if (!prizeId && list[index].grade === "5" || list[index].type === "4") {
                    wx.showModal({
                        title: '提示',
                        content: '谢谢参与',
                        showCancel: false,
                        success: res => {
                            if (res.confirm) {
                                this.setData({
                                    prizeId: ''
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: `恭喜你中了${list[index].luckName}`,
                        showCancel: false,
                        success: res => {
                            if (res.confirm) {
                                this.setData({
                                    prizeId: ''
                                })
                            }
                        }
                    })
                }
                
                this.setData({
                    isStarting: false
                })
            }
        }, time)
    },

    /**
     * 开始抽奖
     */
    startLuck () {
        // 抽奖进行中不能重复抽奖
        if (this.data.isStarting || !this.data.isLoad) {
            return
        }

        wx.showLoading({
            title: '请稍后...',
            mask: true
        })

        let index = 0

        // 获取上一次滚动位置
        for (const [i, v] of this.data.luckList.entries()) {
            if (v.active) {
                index = i
                continue
            }
        }

        // 抽奖
        startLuckDraw({
            luckId: this.data.luckId
        }).then(res => {
            if (res.status === 200 && res.data) {
                this.setData({
                    isStarting: true,
                    prizeId: res.data.prizeId
                })
                
                // 获取积分和剩余次数
                this.getScoreAndSurplus()

                wx.hideLoading()

                // 模拟转盘
                this.goodLuck(index, 30, 300, 10)
            } else {

                wx.hideLoading()

                if (res.msg) {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: false
                    })
                }
            }
        }).catch(e => {
            wx.hideLoading()
        })
    },

    /**
     * 显示中奖记录
     */
    showRecord () {
        wx.showLoading({
            title: '请稍后...',
            mask: true
        })

        // 查询用户中奖记录	
        queryLuckRecord({
            startPage: 1,
            pageSize: 0
        }).then(res => {
            if (res.status === 200 && res.data && res.data.data.length) {
                this.setData({
                    recordList: res.data.data.map(v => {
                        v.formatTime = formatTimeLine(new Date(v.createTime))
                        return v
                    }),
                    isShowPopover: true,
                    popoverType: 'record',
                    popoverTitle: '中奖记录'
                })
                wx.hideLoading()
            }
        }).catch(e => {
            wx.hideLoading()
        })
    },

    /**
     * 显示抽奖规则
     */
    showRule () {
        this.setData({
            isShowPopover: true,
            popoverType: 'rule',
            popoverTitle: '抽奖规则'
        })
    },
    
    /**
     * 隐藏弹出层
     */
    hidePopover () {
        this.setData({
            isShowPopover: false,
            popoverType: '',
            popoverTitle: ''
        })
    },

    /**
     * 获取积分和剩余次数
     */
    getScoreAndSurplus () {
        // 查询用户剩余抽奖次数和积分
        queryScoreAndluck({
            luckId: this.data.luckId
        }).then(res => {
            if (res.status === 200 && res.data) {
                this.setData({
                    score: res.data.integral,
                    surplus: res.data.frequency
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    async onShow () {
        wx.showLoading({
            title: '请稍后...',
            mask: true
        })

        // 查询活动列表，取得最新 20 条活动
        await queryLuckId().then(res => {
            if (res.status === 200 && res.data) {
                this.setData({
                    luckId: res.data.id
                })
            }
        })

        // 查询奖品列表
        await queryPrize({
            luckId: this.data.luckId,
            startPage: 1,
            pageSize: 12
        }).then(res => {
            if (res.status === 200 && res.data && res.data.data.length) {
                // 重写数据
                this.setData({
                    isLoad: true,
                    luckList: res.data.data.map(v => {
                        v.luckImg = this.packImg(v.luckImg)
                        v.active = false
                        return v
                    })
                })
            }
        })

        this.getScoreAndSurplus()

        wx.hideLoading()
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