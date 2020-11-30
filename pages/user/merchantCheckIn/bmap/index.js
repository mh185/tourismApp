// pages/user/merchantCheckIn/bmap/index.js
var bmap = require('../../../../libs/bmap-wx.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [], 
    latitude: '', 
    longitude: '', 
    lng:'',
    lat:''
  },
  onLoad: function(){
    const that = this;
    var BMap = new bmap.BMapWX({ 
        ak: 'xYIZh0RCKZzGvGUWov7bsTCArZMvG8yL',
    }); 
    var fail = function(data) { 
    }; 
    var success = function(data) { 
      that.setData({ 
      latitude: data.wxMarkerData[0].latitude,
      longitude: data.wxMarkerData[0].longitude 
    });
    } 
    // 发起regeocoding检索请求 
    BMap.regeocoding({ 
        fail: fail, 
        success: success
    }); 
  },
  addMarker: function(e){
    const markers =[e.detail];
    markers.iconPath='../../../../images/marker_red.png';
    this.setData({
      markers,
      lat:e.detail.latitude,
      lng:e.detail.longitude,
    });
  },
  submit: function(){
    const {lat, lng} = this.data;
    if(lat&&lng){
      wx.navigateTo({
        url: `/pages/user/merchantCheckIn/index?lat=${lat}&lng=${lng}`,
      });
    }else{
      wx.showToast({
        title:'请在地图上选择地址',
        icon: 'none',
        duration: 1500,
      })
    }
  },
})