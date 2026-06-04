const { getHome } = require('../../utils/api')
const { isLoggedIn, navigateToLogin } = require('../../utils/auth')

const defaultHomeConfig = {
  activityLeftTitle: '拼团',
  activityLeftSubtitle: '多人同行更划算',
  activityRightTitle: '非遗大集',
  activityRightSubtitle: '古法艾条与非遗礼盒',
  productSectionTitle: '伊尹艾 / 分销商品'
}

const localProductImages = ['/images/product-gift-photo.png', '/images/product-single-photo.png']

const actionPages = {
  cases: ['案例库', '肩颈调理、妇科调理、古法制艾案例将陆续更新'],
  video: ['视频专区', '竖版视频、非遗工艺和门店体验内容将在后续接入'],
  experience: ['灸友之家', '到店核销券、体验套餐和活动专题将在后续接入'],
  distribution: ['分销中心', '佣金、推广码和下级管理将在后续接入']
}

const tabPages = {
  category: ['分类', '艾制品、器具、理疗套餐分类页将在后续接入'],
  cart: ['购物车', '购物车列表、结算和优惠核销将在后续接入'],
  mine: ['我的', '订单、会员、分销佣金和个人资料将在后续接入']
}

const actionRoutes = {
  cases: '/pages/cases/cases',
  video: '/pages/videos/videos',
  experience: '/pages/experience/experience',
  distribution: '/pages/distribution/distribution'
}

const tabRoutes = {
  category: '/pages/category/category',
  cart: '/pages/cart/cart',
  mine: '/pages/mine/mine'
}

function placeholderUrl(title, subtitle) {
  return `/pages/placeholder/placeholder?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`
}

function formatPrice(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

Page({
  data: {
    loading: true,
    brandName: '百年老字号曜艾堂',
    searchPlaceholder: '搜索艾条/艾灸套餐/非遗产品',
    banners: [],
    products: [],
    homeConfig: defaultHomeConfig,
    currentBanner: 0,
    searchKeyword: '',
    searchTip: '',
    showModal: false,
    showBrandModal: false,
    showCertificateModal: false,
    showAboutModal: false,
    quickActions: [
      { key: 'distribution', label: '分销', iconUrl: '/images/icon-feature-distribution.png' },
      { key: 'cases', label: '案例库', iconUrl: '/images/icon-feature-case.png' },
      { key: 'video', label: '视频专区', iconUrl: '/images/icon-feature-video.png' },
      { key: 'experience', label: '灸友之家', iconUrl: '/images/icon-feature-experience.png' },
      { key: 'about', label: '关于我们', iconUrl: '/images/icon-feature-about.png' }
    ],
    tabs: [
      { key: 'home', label: '首页', icon: 'home', iconUrl: '/images/tab-home-active.png', active: true },
      { key: 'category', label: '分类', icon: 'category', iconUrl: '/images/tab-category.png', active: false },
      { key: 'cart', label: '购物车', icon: 'cart', iconUrl: '/images/tab-cart.png', active: false },
      { key: 'mine', label: '我的', icon: 'mine', iconUrl: '/images/tab-mine.png', active: false }
    ]
  },

  onLoad() {
    this.loadHome()
  },

  async onPullDownRefresh() {
    await this.loadHome()
    wx.stopPullDownRefresh()
    wx.showToast({ title: '首页已刷新', icon: 'success' })
  },

  async loadHome() {
    this.setData({ loading: true })
    const home = await getHome()
    const banners = (home.banners || []).map((item) => ({
      ...item,
      visualUrl: item.imageUrl || '/images/home-banner.png'
    }))
    const products = (home.products || []).slice(0, 2).map((item, index) => ({
      ...item,
      displayName: item.name || (index === 0 ? '伊尹艾礼盒装' : '伊尹艾单支装'),
      displaySubtitle: item.subtitle || (index === 0 ? '优选薪艾 · 匠心制作' : '优选薪艾 · 手工卷制'),
      displayPrice: formatPrice(item.price),
      visualUrl: item.imageUrl || localProductImages[index] || localProductImages[0]
    }))
    this.setData({
      loading: false,
      brandName: home.brandName || '百年老字号曜艾堂',
      searchPlaceholder: home.searchPlaceholder || '搜索艾条/艾灸套餐/非遗产品',
      banners,
      products,
      homeConfig: { ...defaultHomeConfig, ...(home.homeConfig || {}) }
    })
  },

  onSearchInput(event) {
    const value = String(event.detail.value || '')
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
      .slice(0, 20)
    this.setData({ searchKeyword: value })
  },

  onSearchConfirm() {
    const keyword = this.data.searchKeyword.trim()
    if (!keyword) {
      this.setData({ searchTip: '请输入搜索关键词' })
      setTimeout(() => this.setData({ searchTip: '' }), 2000)
      return
    }
    if (keyword.includes('违规')) {
      wx.showModal({ title: '提示', content: '关键词包含违规内容，请重新输入', showCancel: false })
      return
    }
    wx.navigateTo({ url: `/pages/products/list?keyword=${encodeURIComponent(keyword)}` })
  },

  onBannerChange(event) {
    this.setData({ currentBanner: event.detail.current })
  },

  onBannerTap() {
    const banner = this.data.banners[this.data.currentBanner]
    if (banner && banner.linkType === 'certificate') {
      this.setData({ showModal: true, showCertificateModal: true })
      return
    }
    if (banner && banner.linkType === 'product' && banner.linkValue) {
      wx.navigateTo({ url: `/pages/products/detail?id=${banner.linkValue}` })
      return
    }
    if (banner && banner.linkType === 'activity') {
      wx.navigateTo({ url: placeholderUrl(banner.title || '活动专题', banner.subtitle || '专题活动将在后续接入') })
      return
    }
    wx.navigateTo({ url: placeholderUrl('专题详情', '对应专题将在后续版本接入') })
  },

  onBannerLongPress() {
    wx.showActionSheet({
      itemList: ['保存图片到手机'],
      success: () => wx.showToast({ title: '演示模式暂不保存', icon: 'none' })
    })
  },

  onLogoTap() {
    this.setData({ showModal: true, showBrandModal: true })
  },

  onActionTap(event) {
    const key = event.currentTarget.dataset.key
    if (key === 'about') {
      this.setData({ showModal: true, showAboutModal: true })
      return
    }
    if (actionRoutes[key]) {
      if (key === 'distribution' && !isLoggedIn()) {
        navigateToLogin(actionRoutes[key])
        return
      }
      wx.navigateTo({ url: actionRoutes[key] })
      return
    }
    if (key === 'distribution') {
      const target = placeholderUrl(actionPages.distribution[0], actionPages.distribution[1])
      if (!isLoggedIn()) {
        navigateToLogin(target)
        return
      }
      wx.navigateTo({ url: target })
      return
    }
    const action = this.data.quickActions.find((item) => item.key === key)
    const page = actionPages[key] || [action.label, `${action.label}功能将在后续接入`]
    wx.navigateTo({ url: placeholderUrl(page[0], page[1]) })
  },

  onActivityTap(event) {
    const key = event.currentTarget.dataset.key
    if (key === 'group') {
      wx.navigateTo({ url: '/pages/group/group' })
      return
    }
    if (key === 'market') {
      wx.navigateTo({ url: '/pages/market/market' })
      return
    }
    const title = event.currentTarget.dataset.title
    const subtitle = key === 'group'
      ? '拼团活动列表、开团和参团流程将在后续接入'
      : '古法艾条、非遗礼盒和养生好物专区将在后续接入'
    wx.navigateTo({ url: placeholderUrl(title, subtitle) })
  },

  onMoreProducts() {
    wx.navigateTo({ url: '/pages/products/list' })
  },

  onProductTap(event) {
    wx.navigateTo({ url: `/pages/products/detail?id=${event.currentTarget.dataset.id}` })
  },

  onTabTap(event) {
    const key = event.currentTarget.dataset.key
    const tabs = this.data.tabs.map((item) => {
      const active = item.key === key
      return {
        ...item,
        active,
        iconUrl: `/images/tab-${item.icon}${active ? '-active' : ''}.png`
      }
    })
    this.setData({ tabs })
    if (key === 'home') {
      wx.pageScrollTo({ scrollTop: 0, duration: 250 })
      this.loadHome()
      return
    }
    if (key === 'cart' || key === 'mine') {
      const target = tabRoutes[key] || placeholderUrl(tabPages[key][0], tabPages[key][1])
      if (!isLoggedIn()) {
        navigateToLogin(target)
        return
      }
      wx.redirectTo({ url: target })
      return
    }
    wx.redirectTo({ url: tabRoutes.category })
  },

  closeModal() {
    this.setData({
      showModal: false,
      showBrandModal: false,
      showCertificateModal: false,
      showAboutModal: false
    })
  },

  noop() {}
})
