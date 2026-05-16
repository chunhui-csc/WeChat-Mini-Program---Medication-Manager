// pages/member-detail/member-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMember: {},
    bottles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.memberId)
    const memberId = options.memberId;

    if (memberId) {
      this.loadMemberData(memberId);
    } else {
      console.error('未获取到成员ID');
    }
  },

  loadMemberData: function(memberId){
    const members = wx.getStorageSync('members') || [];
    const member = members.find(m => m.id === memberId);

    if (member) {
      // 计算每个药瓶的有效期状态
      const processedBottles = member.bottles.map(bottle => {
        const daysLeft = this.getDaysLeft(bottle.expiresDate);
        return {
          ...bottle,
          isExpired: daysLeft < 0,
          isExpiringSoon: daysLeft >= 0 && daysLeft <= 30 // 30天内算临期
        };
      });

      this.setData({
        currentMember: member,
        bottles: processedBottles
      });
    }
  },

  getDaysLeft(expireDateStr) {
    const expireDate = new Date(expireDateStr);
    const today = new Date();
    const diffTime = expireDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  },

  navigateToAddBottle() {
    wx.navigateTo({
      url: `/pages/add-bottle/add-bottle?memberId=${this.data.currentMember.id}`
    });
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