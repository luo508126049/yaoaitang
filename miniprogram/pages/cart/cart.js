const { readCart, removeCartItem, updateCartItem } = require('../../utils/cart')
const { isLoggedIn, navigateToLogin } = require('../../utils/auth')
const { createOrder, getServerCart, removeServerCartItem, updateServerCartItem } = require('../../utils/api')

function formatPrice(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

function decorate(items) {
  return items.map((item) => ({
    ...item,
    serverBacked: item.serverBacked === true,
    imageUrl: item.imageUrl || '/images/product-gift-photo.png',
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

  async loadCart() {
    let items = []
    try {
      items = decorate((await getServerCart()).map((item) => ({ ...item, serverBacked: true })))
    } catch (error) {
      items = decorate(readCart())
    }
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

  async onToggle(event) {
    const selected = event.currentTarget.dataset.selected === true || event.currentTarget.dataset.selected === 'true'
    const item = this.data.items.find((cartItem) => String(cartItem.id) === String(event.currentTarget.dataset.id))
    try {
      if (item && item.serverBacked) {
        await updateServerCartItem(item.id, { selected: !selected })
      } else {
        updateCartItem(event.currentTarget.dataset.id, { selected: !selected })
      }
    } catch (error) {
      updateCartItem(event.currentTarget.dataset.id, { selected: !selected })
    }
    await this.loadCart()
  },

  async onSelectAll() {
    const selected = !this.data.allSelected
    try {
      await Promise.all(this.data.items.map((item) => item.serverBacked
        ? updateServerCartItem(item.id, { selected })
        : Promise.resolve(updateCartItem(item.id, { selected }))))
    } catch (error) {
      readCart().forEach((item) => updateCartItem(item.id, { selected }))
    }
    await this.loadCart()
  },

  async onMinus(event) {
    const id = event.currentTarget.dataset.id
    const current = this.data.items.find((item) => String(item.id) === String(id))
    if (!current) return
    const count = Math.max(1, Number(current.count) - 1)
    try {
      if (current.serverBacked) await updateServerCartItem(id, { quantity: count })
      else updateCartItem(id, { count })
    } catch (error) {
      updateCartItem(id, { count })
    }
    await this.loadCart()
  },

  async onPlus(event) {
    const id = event.currentTarget.dataset.id
    const current = this.data.items.find((item) => String(item.id) === String(id))
    if (!current) return
    const count = Number(current.count) + 1
    try {
      if (current.serverBacked) await updateServerCartItem(id, { quantity: count })
      else updateCartItem(id, { count })
    } catch (error) {
      updateCartItem(id, { count })
    }
    await this.loadCart()
  },

  async onRemove(event) {
    const id = event.currentTarget.dataset.id
    const current = this.data.items.find((item) => String(item.id) === String(id))
    try {
      if (current && current.serverBacked) await removeServerCartItem(id)
      else removeCartItem(id)
    } catch (error) {
      removeCartItem(id)
    }
    await this.loadCart()
  },

  onProductTap(event) {
    wx.navigateTo({ url: `/pages/products/detail?id=${event.currentTarget.dataset.id}` })
  },

  onGoShopping() {
    wx.redirectTo({ url: '/pages/category/category' })
  },

  async onCheckout() {
    if (!this.data.totalCount) {
      wx.showToast({ title: '请先选择商品', icon: 'none' })
      return
    }
    const selectedIds = this.data.items.filter((item) => item.selected !== false && item.serverBacked).map((item) => item.id)
    try {
      if (selectedIds.length) {
        const order = await createOrder(selectedIds)
        wx.showModal({
          title: '订单已创建',
          content: `订单号：${order.orderNo}\n暂未接入微信支付，请在后台订单中继续处理。`,
          showCancel: false,
          success: () => this.loadCart()
        })
        return
      }
    } catch (error) {
      wx.showToast({ title: '下单失败，请稍后重试', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/placeholder/placeholder?title=确认订单&subtitle=订单结算、优惠核销和微信支付将在后续版本接入' })
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
