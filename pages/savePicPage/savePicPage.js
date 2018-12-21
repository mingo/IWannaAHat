// pages/combine/combine.js
const app = getApp();

const device = wx.getSystemInfoSync(); // get device info
const width = device.windowWidth;
const height = width;

Page({

  data: {
    picWidth: width,
    picHeight: height,
    topSpace: height,
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    });

    this.setData({
      picWidth: width - 20 + "px",
      picHeight: height - 20 + "px",
      topSpace: height + "px"
    });

    wx.getImageInfo({
      src: app.globalData.bgPic,
      success: res => {
        this.bgPic = res.path
        this.draw();
      }
    })
  },

  draw() {
    let scale = app.globalData.scale;
    let rotate = app.globalData.rotate;
    let hat_center_x = app.globalData.hat_center_x;
    let hat_center_y = app.globalData.hat_center_y;
    let currentHatId = app.globalData.currentHatId;
    const pc = wx.createCanvasContext('myCanvas');
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const hat_size = 100 * scale;

    var picWidth = windowWidth - 20;

    pc.clearRect(0, 0, picWidth, picWidth);
    pc.drawImage(this.bgPic, 0, 0, picWidth, picWidth);

    pc.translate(hat_center_x, hat_center_y);
    pc.rotate(rotate * Math.PI / 180);
    pc.drawImage("../../image/" + currentHatId + ".png", -hat_size / 2, -hat_size / 2, hat_size, hat_size);
    pc.draw();
  },

  savePic() {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    wx.canvasToTempFilePath({
      x: windowWidth / 2 - 150,
      y: 0,
      height: 300,
      width: 300,
      canvasId: 'myCanvas',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            wx.showToast({
              title: '保存成功 Saved!',
              icon: 'success',
              duration: 2000
            });

            setTimeout(()=>wx.navigateTo({
              url: '../initialPage/initialPage',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            }), 1500)

            // console.log("success:" + res);
          }, fail(e) {
            wx.showToast({
              title: '保存失败 Save failure',
              icon: 'warn',
              duration: 2000
            })
            // console.log("err:" + e);
          }
        })
      }
    });
  },

  /**
   * Feedbacks
   * 反馈
   */
  feedbackBtn() {
    wx.showModal({
      title: '反馈与建议',
      content: '若有任何问题或反馈请一！定！要！联系微信号：SL-0125 \r\n PLEEEASE contact wx: SL-0125 if you have any concerns or feedbacks.',
      success: function (res) {
        if (res.confirm) {
          console.log('Feedbakc btn');
        }
      }
    })
  },
})