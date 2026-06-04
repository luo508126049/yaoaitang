const { readCart, removeCartItem, updateCartItem } = require('../../utils/cart')
const { isLoggedIn, navigateToLogin } = require('../../utils/auth')

function formatPrice(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

function decorate(items) {
  return items.map((item) => ({
    ...item,
    displayPrice: formatPrice(item.price),
    lineTotal: formatPrice(Number(item.price) * Number(item.count || 1))
  }))
}

Page({
  data: {
    items: [],
    totalPrice: '0.00',
    totalCount: 0,
    allSelected: true,
    tabs: [
      { key: 'home', label: '首页', iconUrl: '/images/tab-home.png', active: false },
      { key: 'category', label: '分类', iconUrl: '/images/tab-category.png', active: false },
      { key: 'cart', label: '购物车', iconUrl: '/images/tab-cart-active.png', active: true },
      { key: 'mine', label: '我的', iconUrl: '/images/tab-mine.png', active: false }
    ]
  },

  onShow() {
    if (!isLoggedIn()) {
      navigateToLogin('/pages/cart/cart')
      return
    }
    this.loadCart()
  },

  loadCart() {
    const items = decorate(readCart())
    const selectedItems = items.filter((item) => item.selected !== false)
    const totalPrice = selectedItems.reduce((sum, item) => sum + Number(item.price) * Number(item.count || 1), 0)
    const totalCount = selectedItems.reduce((sum, item) => sum + Number(item.count || 1), 0)
    this.setData({
      items,
      totalPrice: formatPrice(totalPrice),
      totalCount,
      allSelected: items.length > 0 && selectedItems.length === items.length
    })
  },

  onToggle(event) {
    const selected = event.currentTarget.dataset.selected === true || event.currentTarget.dataset.selected === 'true'
    updateCartItem(event.currentTarget.dataset.id, { selected: !selected })
    this.loadCart()
  },

  onSelectAll() {
    const selected = !this.data.allSelected
    readCart().forEach((item) => updateCartItem(item.id, { selected }))
    this.loadCart()
  },

  onMinus(event) {
    const id = event.currentTarget.dataset.id
    const current = this.data.items.find((item) => String(item.id) === String(id))
    if (!current) return
    updateCartItem(id, { count: Math.max(1, Number(current.count) - 1) })
    this.loadCart()
  },

  onPlus(event) {
    const id = event.currentTarget.dataset.id
    const current = this.data.items.find((item) => String(item.id) === String(id))
    if (!current) return
    updateCartItem(id, { count: Number(current.count) + 1 })
    this.loadCart()
  },

  onRemove(event) {
    removeCartItem(event.currentTarget.dataset.id)
    this.loadCart()
  },

  onProductTap(event) {
    wx.navigateTo({ url: `/pages/products/detail?id=${event.currentTarget.dataset.id}` })
  },

  onGoShopping() {
    wx.redirectTo({ url: '/pages/category/category' })
  },

  onCheckout() {
    if (!this.data.totalCount) {
      wx.showToast({ title: '请先选择商品', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: '/pages/placeholder/placeholder?title=确认订单&subtitle=订单结算、优惠核销和微信支付将在后续版本接入'
    })
  },

  onTabTap(event) {
    const key = event.currentTarget.dataset.key
    if (key === 'cart') return
    if (key === 'home') {
      wx.redirectTo({ url: '/pages/index/index' })
      return
    }
    if (key === 'mine' && !isLoggedIn()) {
      navigateToLogin('/pages/mine/mine')
      return
    }
    wx.redirectTo({ url: `/pages/${key}/${key}` })
  }
})
