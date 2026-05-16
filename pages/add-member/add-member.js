// pages/add-member/add-member.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    name: '',
    relations: [
      { name: '本人', value: 'self', checked: true },
      { name: '父亲', value: 'father' },
      { name: '母亲', value: 'mother' },
      { name: '配偶', value: 'spouse' },
      { name: '子女', value: 'child' },
      { name: '其他', value: 'other' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  chooseAvatar: function(){
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: res => {
        this.setData({
          avatarUrl: res.tempFiles[0].tempFilePath
        });
      }
    })
  },

  onSubmit: function(e){
    const formData = e.detail.value;

    if (!formData.name) {
      wx.showToast({ title: '请输入成员姓名', icon: 'none' });
      return;
    }

    const newMember = {
      id: 'member_' + Date.now(),
      name: formData.name,
      avatar: this.data.avatarUrl,
      relation: formData.relation || 'self',
      note: formData.note,
      bottles: []
    };

    const members = wx.getStorageSync('members') || [];
    members.push(newMember);

    wx.setStorageSync('members', members);

    wx.showToast({ title: '添加成功', icon: 'success' });
    
    setTimeout(() => {
      wx.navigateBack(); // 返回上一页（即首页）
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