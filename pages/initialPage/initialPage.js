// pages/welcomePage/welcomePage.js
import WeCropper from '../we-cropper/we-cropper.js'

const app = getApp();
const device = wx.getSystemInfoSync(); // get device info
const width = device.windowWidth;
const height = width;
// const deviceHeight = device.windowHeight;
const drp = device.pixelRatio;

Page({
  /**
  * Initial data
  */
  data: {
    picChoosed: false,
    bgPic: null,
    opacity: 0.6, 
    btnWidth: width,

    cropperOpt: {
      id: 'cropper',
      width, 
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) /2,   // Starting point of the cutting box
        y: (width - 300)/ 2,
        width: 300,            // Size of the cutting box
        height: 300
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   * Life Circle - audit page on load
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    });

    /** 判断场景值，1044 为转发场景，包含shareTicket 参数 */
    if (options.scene == 1044) {
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        success: function (res) {
          var encryptedData = res.encryptedData;
          var iv = res.iv;
        }
      })
    }

    const that = this;
    if (drp >= 3) {
      that.setData({
        btnWidth: "100%"
      });
    }
    else {
      that.setData({
        btnWidth: "50%"
      });
    }



    const { cropperOpt } = this.data
    
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        // console.log('wecropper is ready!')
      })
      .on('beforeImageLoad', (ctx) => {
        // console.log('before picture loaded')
        // console.log('current canvas context: ${ctx}')
        wx.showToast({
          title: 'Uploading',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        // console.log('picture loaded')
        // console.log('current canvas context: ${ctx}')
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        // console.log(`before canvas draw,i can do something`)
        // console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    const self = this;

    if (!app.globalData.tip1Got) {
      wx.showModal({
        title: 'Tips',
        content: '单指移动图片=>改变剪裁区域；\r\n双指捏合缩放=>改变所剪裁的大小。\r\nUpload a image and crop it. You can simply drag the canvas. \r\nAlso, use two fingers to zoom in or out.',
        success: function (res) {
          if (res.confirm) {
            app.globalData.tip1Got = true;
            // console.log('User has confirmed')
          }
        }
      })
    }
  },


  /**
   * Tips for users
   * 帮助
   */
  helpBtn() {
    wx.showModal({
      title: 'Tips',
      content: '单指移动图片=>改变剪裁区域；\r\n双指捏合缩放=>改变所剪裁的大小.\r\nUpload a image and crop it. You can simply drag the canvas. \r\nAlso, use two fingers to zoom in or out.',
      success: function (res) {
        if (res.confirm) {
          // console.log('User has confirmed')
        }
      }
    })
  },

  /**
   * 定义图片是否上传
   * Determinate whether the picture is choosed or not
   */
  assignPicChoosed(){
    if (this.data.bgPic) {
      this.setData({
        picChoosed: true,
        opacity: 1
      })
    } else {
      this.setData({
        picChoosed: false,
        opacity: 0.6
      })
    }
  },

  /**
   * 触摸剪裁
   * Cropper touch handler
   */
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },


  /**
   * 上传头像
   * Avatar uploader
   */
  onGotUserInfo: function (e) {
    const self = this;
    this.setData({
      bgPic: e.detail.userInfo.avatarUrl
    })
    self.wecropper.pushOrign(this.data.bgPic);
    this.assignPicChoosed();
  },

  /**
   * 上传图片
   * Image uploader
   */
  imageUploader(from) {
    const self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: [from.target.dataset.way],
      success: (res) => {
        this.setData({
          bgPic: res.tempFilePaths[0]
        });
        self.wecropper.pushOrign(this.data.bgPic);
        this.assignPicChoosed();
      },
      fail: (res) => {
        this.assignPicChoosed();
      },
      complete: (res) => {
        this.assignPicChoosed();
      },
    })
  },

  /**
   * 转入下个页面
   * Crop the image
   * Write image data to global
   * Navigate to next page
   */
  nextPage(){
    var src = this.data.bgPic;
    this.wecropper.getCropperImage((src) => {
      if (src) {
        this.setData({
          bgPic: src
        });
        app.globalData.bgPic = this.data.bgPic;

        wx.navigateTo({
          url: '../wearHatPage/wearHatPage',
        })
      } else {
        // console.log('Unable to get the image path')
      }
    });
  },


  onShareAppMessage: function () {
    return {
      title: '还在@官方求一顶圣诞帽？NONONO！现在就自定义属于你的圣诞帽！',
      path: '/pages/initialPage/initialPage',
      imageUrl: '/background/share.jpg',
      success: function (res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})