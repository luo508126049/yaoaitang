const tabs = ['全部', '肩颈调理', '妇科调理', '古法制艾']

const cases = [
  {
    title: '肩颈寒湿调理记录',
    category: '肩颈调理',
    days: '7天跟踪',
    summary: '围绕肩颈僵硬、睡眠浅等反馈，组合艾灸、热敷与到店指导。',
    imageUrl: '/images/banner-experience.png'
  },
  {
    title: '节气养生艾灸方案',
    category: '古法制艾',
    days: '3次体验',
    summary: '结合节气变化配置温和艾条，适合家庭日常养护。',
    imageUrl: '/images/banner-heritage.png'
  },
  {
    title: '女性暖宫调理案例',
    category: '妇科调理',
    days: '14天记录',
    summary: '通过门店评估、穴位建议和套盒搭配建立连续养护方案。',
    imageUrl: '/images/banner-gift.png'
  }
]

Page({
  data: {
    tabs,
    active: '全部',
    cases,
    filteredCases: cases
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },

  onTabTap(event) {
    const active = event.currentTarget.dataset.value
    this.setData({
      active,
      filteredCases: active === '全部' ? cases : cases.filter((item) => item.category === active)
    })
  },

  onCaseTap(event) {
    const item = this.data.filteredCases[event.currentTarget.dataset.index]
    wx.showModal({
      title: item.title,
      content: `${item.summary}\n\n正式版将接入图文详情、调理记录和关联商品。`,
      showCancel: false
    })
  }
})
