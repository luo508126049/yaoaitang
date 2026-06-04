const { isLoggedIn, navigateToLogin } = require('../../utils/auth')

Page({
  data: {
    metrics: [
      { label: '可提现佣金', value: '¥0.00' },
      { label: '累计推广', value: '12人' },
      { label: '本月订单', value: '0单' }
    ],
    tasks: [
      '分享非遗礼盒给好友',
      '邀请新用户领取体验券',
      '引导到店体验先灸后玉'
    ],
    partners: [
      { name: '养生体验用户', tag: '待成交', amount: '预计佣金 ¥18.00' },
      { name: '门店老客复购', tag: '跟进中', amount: '预计佣金 ¥32.00' }
    ]
  },

  onLoad() {
    if (!isLoggedIn()) {
      navigateToLogin('/pages/distribution/distribution')
    }
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },

  onOpen() {
    wx.showModal({
      title: '分销员开通',
      content: '正式版将接入分销员申请、审核和佣金结算规则。当前为页面流程演示。',
      showCancel: false
    })
  },

  onShareTap() {
    wx.showToast({ title: '请使用右上角分享', icon: 'none' })
  }
})
