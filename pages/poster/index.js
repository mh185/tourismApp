// pages/poster/index.js
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: host,
    iconUrl: iconUrl,
    title: "",
    maskHidden: false,
    name: "",
    touxiang: "",
    banner: "",
    logo: iconUrl + "/background_1.png",
    erweima: iconUrl + "/erweima.png",
    generateTx: '',
    generateBan: '',
    generateLogo: '',
    generateEr: '',
    headimg:''
  },
  // 返回上一页
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let bean = JSON.parse(options.shareDate)
    this.setData({
      title: bean.title,
      banner: host + bean.banner,
      headimg:app.globalData.wxUserInfo.headImg
    })
 
  
  },
  //点击提交按钮
  btnclick: function () {
    var text = this.data.inputValue
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
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
    if(app.globalData.wxUserInfo&&app.globalData.wxUserInfo!=null){
      this.setData({
        name: app.globalData.wxUserInfo.nickName,
      })
    }else{
        wx.navigateTo({
          url: "/pages/logIn/index"
        });
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
    // return {
    //   title:"这个是我分享出来的东西",
    //   success:function(res){
    //     console.log(res,"转发成功")
    //   },
    //   fail:function(res){
    //     console.log(res,"转发失败")
    //   }
    // }
  },
  // 返回首页
  onClickLeft() {
    wx.navigateBack({
      changed: true
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, 375, 567)
    var path = that.data.generateBan;;
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    //绘制banner
    context.drawImage(path, 15, 45, 345, 200);
    var path1 = that.data.generateTx;
    console.log(path1, "path1")
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = that.data.generateEr;
    var path3 = that.data.generateLogo;

    //不知道是什么原因，手机环境能正常显示

    // context.save(); // 保存当前context的状态
    //绘制logo
    context.drawImage(path3, 50, 400, 100, 40);
    var name = that.data.name;
    //绘制名字
    context.setFontSize(18);
    context.setFillStyle('#646464');
    context.setTextAlign('left');
    context.fillText(name, 95, 330);
    context.stroke();
    //绘制二维码
    context.drawImage(path2, 230, 360, 120, 100);
    context.setFontSize(11);
    context.setFillStyle('#646464');
    context.setTextAlign('left');
    context.fillText("长按识别小程序", 245, 475);
    context.stroke();
    // context.draw();
    //绘制title
    context.setFontSize(20);
    context.setFillStyle('#1D1D1D');
    context.setTextAlign('left');
    context.fillText(that.data.title, 50, 280);
    context.stroke();
    // context.draw();

    //绘制右下角扫码提示语
    // context.drawImage(path5, 248, 578, 90, 25);
    // //绘制头像
    context.arc(70, 320, 20, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "#ffe200";
    context.clip(); //裁剪上面的圆形
    //绘制头像
    context.drawImage(path1, 50, 300, 50, 50); // 在刚刚裁剪的园上画图
    // context.drawImage(path1, 136, 196, 100, 100); 
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
          that.baocun()
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.hideLoading()
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          },
          fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  quxiao: function () {
    this.setData({
      maskHidden: false
    })
  },
  //下载图片
  getImgsrc: function (e) {
    wx.downloadFile({
      url: e,
      success: function (res) {
        if (res.statusCode === 200) {
          let img = res.tempFilePath;
          // that.setData({
          //   touxiang: res.tempFilePath
          // })
          return img
        }
      }
    });
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    wx.showLoading({
      title: '生成中...',
    })
    wx.downloadFile({
      url: app.globalData.wxUserInfo.headImg,
      success: function (res) {
        if (res.statusCode === 200) {
          that.setData({
            generateTx: res.tempFilePath
          })
          wx.downloadFile({
            url: that.data.banner,
            success: function (res) {
              if (res.statusCode === 200) {
                that.setData({
                  generateBan: res.tempFilePath
                })
                wx.downloadFile({
                  url: that.data.logo,
                  success: function (res) {
                    if (res.statusCode === 200) {

                      that.setData({
                        generateLogo: res.tempFilePath
                      })
                      wx.downloadFile({
                        url: that.data.erweima,
                        success: function (res) {
                          if (res.statusCode === 200) {
                            that.setData({
                              generateEr: res.tempFilePath
                            })
                            setTimeout(function () {
                              wx.hideToast()
                              that.createNewImg();
                            }, 1000)
                          }
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });


   
  },

})