// pages/topic/topic.js
const db = wx.cloud.database()
const dbCollection = db.collection('topics')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCreate: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options && options.id) {
      wx.showLoading();
      dbCollection.doc(options.id).get()
        .then(resp => {
          // 当前是编辑模式
          this.setData({
            isCreate: false
          });

          console.log(resp)
          this.setData(resp.data);
          wx.hideLoading();
        }).catch(error => {
          console.log(error);
          wx.showToast
        })
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

  },

  /**
   * 时间事件
   */
  bindDateChange: function(event) {
    this.setData({
      endDate: event.detail.value
    })
  },

  /**
   * 时间事件
   */
  bindDateChange2: function(event) {
    this.setData({
      pubDate: event.detail.value
    })
  },

  /**
   * 表单提交事件
   */
  formSubmit(e) {
    const validate = this.validator(e);
    console.log(validate);
    if (!validate) {
      return;
    }

    if (this.data.isCreate) {
      this.add(e);
    } else {
      this.update(e);
    }

  },

  validator(e) {
    console.log(e.detail.value)
    if (!e.detail.value.title) {
      wx.showToast({
        title: "标题未填写",
        icon: 'none',
      });
      return false;
    } else if (!e.detail.value.luckyNumber) {
      wx.showToast({
        title: "名额未填写",
        icon: 'none',
      });
      return false;
    } else if (!e.detail.value.endDate) {
      wx.showToast({
        title: "截止日期未填写",
        icon: 'none',
      });
      return false;
    }

    if (!/^[0-9]+$/.test(e.detail.value.luckyNumber)) {
      wx.showToast({
        title: "名额需填写正整数",
        icon: 'none',
      });
      return false;
    }


    return true;
  },

  /**
   * 新增
   */
  add(e) {
    const postData = { ...{
        createTime: db.serverDate(),
      lastEditTime: db.serverDate(),
        enabled: 1
      },
      ...e.detail.value
    }
    dbCollection.add({
        data: postData
      })
      .then(res => {
        console.log(res)

        wx.showModal({
          title: '添加成功',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              wx.navigateBack();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

        // 添加到首页
        if (postData.isPublish){
          this.updateToHome(res._id);
        }

      })
      .catch(console.error)
  },

  /**
   * 更新
   */
  update(e) {
    const postData = { ...{
        lastEditTime: db.serverDate()
      },
      ...e.detail.value
    }
    dbCollection.doc(this.data._id).update({
      data: postData
    }).then(resp => {
      console.log(resp)
      // wx.showToast({
      //   title: "更新成功",
      //   icon: "success",
      //   duration: 3000
      // })
      wx.showModal({
        title: '更新成功',
        showCancel: false,
        success: (res) =>{
          if (res.confirm) {
            wx.navigateBack();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

      // 添加到首页
      if (postData.isPublish) {
        this.updateToHome(resp._id);
      }
    }).catch(error => {
      console.log(error)
    })
  },

  /**
   * 更新到首页
   */
  updateToHome(topicId) {
    // // 查找
    // db.collection('home').where({
    //   type: 'topic'
    // }).get().then(res => {
    //   console.log(res)
    //   if (!res.data.length) return;

    //   const docId = res.data[0]._id;
    //   console.log(docId)
      
    //   // 更新
    //   db.collection('home').doc(docId)
    //     .update({
    //       data: {
    //         topicIds: [topicId]
    //       },
    //     })
    //     .then(res2 => {
    //       console.log(res2)
    //     })
    //     .catch(error => {
    //       console.error(error)
    //     })
    // })
  
  },

  /**
   * 表单重置
   */
  formReset() {
    console.log('form发生了reset事件')
  }
})