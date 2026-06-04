const CART_KEY = 'yaoaitang_cart_items'

function readCart() {
  const items = wx.getStorageSync(CART_KEY)
  return Array.isArray(items) ? items : []
}

function writeCart(items) {
  wx.setStorageSync(CART_KEY, items)
}

function normalizeCartProduct(product) {
  return {
    id: product.id,
    name: product.name || product.displayName || '曜艾堂艾制好物',
    subtitle: product.subtitle || product.displaySubtitle || '非遗艾灸养生推荐',
    imageUrl: product.imageUrl || product.visualUrl || '/images/product-gift-photo.png',
    price: Number(product.price) || 0
  }
}

function addToCart(product, count = 1) {
  const cartProduct = normalizeCartProduct(product)
  const items = readCart()
  const nextCount = Math.max(1, Number(count) || 1)
  const current = items.find((item) => String(item.id) === String(cartProduct.id))
  if (current) {
    current.count += nextCount
  } else {
    items.unshift({ ...cartProduct, count: nextCount, selected: true })
  }
  writeCart(items)
  return items
}

function updateCartItem(id, patch) {
  const items = readCart().map((item) => {
    if (String(item.id) !== String(id)) return item
    const next = { ...item, ...patch }
    next.count = Math.max(1, Number(next.count) || 1)
    return next
  })
  writeCart(items)
  return items
}

function removeCartItem(id) {
  const items = readCart().filter((item) => String(item.id) !== String(id))
  writeCart(items)
  return items
}

function clearCart() {
  writeCart([])
}

module.exports = {
  addToCart,
  clearCart,
  readCart,
  removeCartItem,
  updateCartItem
}
