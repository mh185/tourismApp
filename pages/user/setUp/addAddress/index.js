// pages/user/setUp/addAddress/index.js
var tcity = require("../../../../utils/citys.js");
import {saveAddress,updateAddress} from '../../../../utils/api/index'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'add',
    isChecked: false,
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
    name:'',
    phone:'',
    address:'',
    lng:'',
    lat:'',
    status:'',
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;    
    tcity.init(that);
    var cityData = that.data.cityData;    
    const provinces = [];
    const citys = [];
    const countys = [];
    for(let i=0;i<cityData.length;i++){
      provinces.push(cityData[i].name);
    }
    for (let i = 0 ; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    for (let i = 0 ; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }
    that.setData({
      'provinces': provinces,
      'citys':citys,
      'countys':countys,
      'type':options.type
    })
    
    if(options.type=='edit'){
      var content=JSON.parse(options.content)
      var isCheck=false
      if(content.status==1){
        isCheck=true
      }
      that.setData({
        isChecked:isCheck,
        id:content.id,
        province:content.pro,
        city:content.city,
        county:content.area,
        name:content.name,
        phone:content.phone,
        status:content.status||0,
        lng:content.lng||'',
        lat:content.lat||'',
        address:content.address||'',
      })
    }
  },
  //保存地址
  saveAddress:function(){
    const that = this;
    if(that.data.name=='' && that.data.phone=='' && that.data.province=='' && that.data.address==''){
      setTimeout(function(){
        wx.navigateBack({//返回
          delta: 1
        })
      },500)
      return false;
    } 
    if(that.data.name == ''){
      wx.showToast({
        title:'请填写收货人姓名',
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    if(that.data.phone == ''){
      wx.showToast({
        title:'请填写联系电话',
        icon: 'none',
        duration: 1500,
      })
      return false
    }else{
      const isLandLine = /^(((0\d{3}[\-])?\d{7,8}|(0\d{2}[\-])?\d{8}))(|[\-]\d{1,4})?$/;
      const isMob = /(^1[3-9][0-9]{9}$)/;
      const value = that.data.phone;
      if (value && (!(isMob.test(value.trim()) || isLandLine.test(value.trim())))) {
        wx.showToast({
          title: '请输入正确的联系电话',
          icon:'none',
          duration: 500
        })
        return false;
      }
    }
    if(that.data.province == ''){
      wx.showToast({
        title:'请选择所在地',
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    if(that.data.address==''){
      wx.showToast({
        title:'请填写详细地址',
        icon: 'none',
        duration: 1500,
      })
      return false
    }
     
    var params = {
      name: that.data.name,//收货人
      phone: that.data.phone,//收货人电话
      address: that.data.address,//详细地址
      userId: app.globalData.userId,//用户id
      lng: '',//经度
      lat: '',//纬度
      pro: that.data.province,//省
      city: that.data.city,//市
      area: that.data.county,//区
      status:that.data.status//是否默认(0一般地址 1默认地址)
    }
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    if(that.data.type == 'add'){ //新增
      saveAddress(params).then(res => {
        if(res.status==200){
          wx.showToast({
            title:'添加成功',
            icon: 'none',
            duration: 1500,
            success:function(){
              setTimeout(function(){
                wx.navigateBack({//返回
                  delta: 1
                })
              },500)
            }
          })
        }else{
          wx.showToast({
            title:res.msg,
            icon: 'none',
            duration: 1500,
          })
        }
      })
    } else { //编辑
      params.id=that.data.id;
      updateAddress(params).then(res=>{
        if(res.status==200){
          wx.showToast({
            title:'修改成功',
            icon: 'none',
            duration: 1500,
            success:function(){
              setTimeout(function(){
                wx.navigateBack({//返回
                  delta: 1
                })
              },500)
            }
          })
        
        }else{
          wx.showToast({
            title:res.msg,
            icon: 'none',
            duration: 1500,
          })
        }
      })
    }
  },
 
  //获得收货人
  getName:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  //获取电话
  getPhone:function(e){
    this.setData({
      phone:e.detail.value
    })
  },
  //获得地址
  getAddress:function(e){
    var addr=e.detail.value
    if(addr.length<5){
      wx.showToast({
        title: '详细地址，不少于5个字',
        icon:'none',
        duration: 500
      })
      return
    }
    this.setData({
      address:addr
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
  open:function(){
    this.setData({
      condition:!this.data.condition
    })
  },
  /**
   * 关闭地址联动弹窗
   */
  close:function (){
    this.setData({
      condition:!this.data.condition
    });
    this.getAddressInfo();
  },
  /**
   * 通过选择的code，解析json得到地址信息
   */
  getAddressInfo: function (){
    var val = this.data.values;
    var cityData = this.data.cityData;
    const citys = [];
    const countys = [];
    for (let i = 0 ; i < cityData[val[0]].sub.length; i++) {
      citys.push(cityData[val[0]].sub[i].name)
    }
    for (let i = 0 ; i < cityData[val[0]].sub[0].sub.length; i++) {
      countys.push(cityData[val[0]].sub[0].sub[i].name)
    }
    this.setData({
      province: this.data.provinces[val[0]],
      city: citys[val[1]],
      citys:citys,
      county: countys[val[2]],
      countys:countys,
      value:val
    })
  },
  // 设置默认
  changeSwitch:function(e){
    var type = e.detail.value
    if(type){
      this.setData({
        status:1
      })
    }else{
      this.setData({
        status:0
      })
    }
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