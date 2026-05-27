// index.js
const initialMembers = [
  { id: 'member_001', avatar:'', name: '张三', bottles: [{ id: 'b1' }, { id: 'b2' }], note: '', relation: "" },
  { id: 'member_002', avatar:'', name: '李四', bottles: [{ id: 'b3' }], note: '', relation: "" },
  { id: 'member_003', avatar:'', name: '王五', bottles: [], note: '', relation: "" }
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    members: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const storedMembers = wx.getStorageSync('members');
    if (storedMembers) {
      this.setData({ members: storedMembers });
    } else {
      this.setData({ members: initialMembers });
      wx.setStorageSync('members', initialMembers);
    }
  },

  viewMemberDetail: function(e) {
    const memberId = e.currentTarget.dataset.memberId;
    console.log(memberId);
    wx.navigateTo({
      url: `/pages/member-detail/member-detail?memberId=${memberId}`
    })
  },

  navigateToAddMember: function(){
    wx.navigateTo({
      url: '/pages/add-member/add-member',
    })
  },

  navigateToNearbyPharmacy: function(){
    wx.navigateTo({
      url: '/pages/nearby-pharmacy/nearby-pharmacy'
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
    const storedMembers = wx.getStorageSync('members');
    this.setData({ members: storedMembers });
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
    this.onRefresh();
  },

  onRefresh: function(){
    const that = this;
    const storedMembers = wx.getStorageSync('members');
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: 'Loading...',
    })
    console.log("下拉刷新中。。。")
    setTimeout(() => {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      if (!that.data.members) {
        wx.stopPullDownRefresh();
        return;
      }
      that.setData({members: storedMembers})
    },1000)
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
    
  },
})