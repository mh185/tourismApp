// pages/user/merchantCheckIn/index.js
import {fileUpload} from '../../../utils/request'
const bmap = require('../../../libs/bmap-wx.js'); 
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
		userId:'',
    sexArr:[{value:0,text:'女'},{value:0,text:'男'}],
    sex:'',
    latitude:'',
    longitude:'',
    degreeArr:['博士', '硕士', '本科', '大专', '中专', '高中', '初中', '小学', '文盲', '半文盲'],
    degree:'',
    pro:'',
    city:'',
    area:'',
    code:'',
    address:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    this.setData({
      userId:app.globalData.userId,
    });
    if(options.lat&&options.lng){
      wx.request({
          url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=GsfFyrjvCHMrqCWhFLhUYqTq4N4Gb6d9&output=json&coordtype=gcj02&location=${options.lat},${options.lng}`,
          success(data) {
            if(data.statusCode == 200){
              const result = data.data.result;
              that.setData({
                ...result.location,
                pro:result.addressComponent.province,
                city:result.addressComponent.city,
                area:result.addressComponent.district,
                code:result.cityCode,
                address:result.formatted_address
              })
            }
          }
      })
    }
  },
  //性别
  bindGenderChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  //地址
  addressChange: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  //文化程度
	bindDegreeChange: function(e) {
    this.setData({
      degree: this.data.degreeArr[e.detail.value]
    })
	},
  /**
   * 上传图片
   */
  uploadImg:function(){
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
	uploadFile: function(file){
		const that = this;
		fileUpload({file}).then(resg => {
			if(resg.status == 200){
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
	formSubmit: function (e) {
		const _that = this;
    const data  = e.detail.value;
		// data.id = this.data.userId;
		// data.headImg = this.data.headImg;
		// if(this.idCardTips == ''){
		// 	return false;
		// }
		// wx.showLoading({
		// 	title: '加载中....',
		// 	mask:true 
		// })
		// updateUser(data).then(res=>{
		// 	wx.hideLoading()
		// 	if(res.status==200){
		// 		app.globalData.wxUserInfo = res.data;
		// 		wx.showToast({
    //       title:'编辑成功',
    //       icon: 'none',
    //       duration: 1500,
    //       success:function(){
    //         setTimeout(function(){
    //           wx.navigateBack({
    //             delta: 1,
    //           })
    //         },500)
    //       }
    //     })
		// 	}else{
		// 		wx.showToast({
		// 			title:res.msg,
		// 			icon: 'none',
		// 			duration: 1500,
		// 		})
		// 	}
		// })
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