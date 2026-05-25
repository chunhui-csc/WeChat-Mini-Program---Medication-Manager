// pages/add-bottle/add-bottle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberId: '',
    editMode: false,
    today: '',
    formData: {
      medicineName: '',
      dosage: '',
      schedule: '',
      expiresDate: '',
      note: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const today = new Date().toISOString().split('T')[0];
    this.setData({ today });

    this.setData({ memberId: options.memberId });

    if (options.bottle) {
      const bottle = JSON.parse(decodeURIComponent(options.bottle));
      this.setData({
        editMode: true,
        formData: bottle
      });
    }
  },

  onDateChange: function(e){
    this.setData({'formData.expiresDate': e.detail.value});
  },

  onSubmit: function(e){
    const newBottle = e.detail.value;
    if (!newBottle.medicineName || !newBottle.expiresDate) {
      wx.showToast({ title: '请填写必填项', icon: 'none' });
      return;
    }

    const members = wx.getStorageSync('members');
    const memberIndex = members.findIndex(m => m.id === this.data.memberId);

    if (this.data.editMode) {
      const bottleIndex = members[memberIndex].bottles.findIndex(b => b.id === this.data.formData.id);
      members[memberIndex].bottles[bottleIndex] = { ...this.data.formData, ...newBottle, confirm: false};
    } else {
      const bottle = {
        id: 'bottle_' + Date.now(),
        ...newBottle,
        confirm: false
      };
      members[memberIndex].bottles.push(bottle);
    }

    wx.setStorageSync('members', members);
    wx.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})