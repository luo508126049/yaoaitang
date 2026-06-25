const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

const root = path.resolve(__dirname, '..')
const miniprogramRoot = path.join(root, 'miniprogram')

const touchedFiles = [
  'miniprogram/app.wxss',
  'miniprogram/utils/ui.js',
  'miniprogram/pages/index/index.js',
  'miniprogram/pages/index/index.wxml',
  'miniprogram/pages/index/index.wxss',
  'miniprogram/pages/category/category.js',
  'miniprogram/pages/category/category.wxml',
  'miniprogram/pages/category/category.wxss',
  'miniprogram/pages/cart/cart.js',
  'miniprogram/pages/cart/cart.wxml',
  'miniprogram/pages/cart/cart.wxss',
  'miniprogram/pages/mine/mine.js',
  'miniprogram/pages/mine/mine.wxml',
  'miniprogram/pages/mine/mine.wxss'
]

function walk(dir, predicate, result = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name)
    if (item.isDirectory()) walk(full, predicate, result)
    else if (!predicate || predicate(full)) result.push(full)
  }
  return result
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/')
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function verifyJsSyntax() {
  for (const file of walk(miniprogramRoot, (full) => full.endsWith('.js'))) {
    childProcess.execFileSync('node', ['--check', file], { stdio: 'pipe' })
  }
}

function verifyJson() {
  for (const file of walk(miniprogramRoot, (full) => full.endsWith('.json'))) {
    JSON.parse(fs.readFileSync(file, 'utf8'))
  }
}

function verifyNoBom() {
  for (const file of touchedFiles) {
    const bytes = fs.readFileSync(path.join(root, file))
    assert(!(bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf), `${file} has BOM`)
  }
}

function verifyWxssText() {
  for (const file of touchedFiles.filter((item) => item.endsWith('.wxss'))) {
    const lines = read(file).split(/\r?\n/)
    lines.forEach((line, index) => {
      assert(!line.includes('\ufffd'), `${file}:${index + 1} contains replacement character`)
      const doubleQuotes = (line.match(/"/g) || []).length
      const singleQuotes = (line.match(/'/g) || []).length
      assert(doubleQuotes % 2 === 0, `${file}:${index + 1} has unbalanced double quotes`)
      assert(singleQuotes % 2 === 0, `${file}:${index + 1} has unbalanced single quotes`)
    })
  }
}

function verifyImagesExist() {
  const files = touchedFiles.filter((file) => /\.(js|wxml)$/.test(file))
  const missing = []
  for (const file of files) {
    const text = read(file)
    for (const match of text.matchAll(/['"](\/images\/[^'"]+)['"]/g)) {
      const imagePath = path.join(miniprogramRoot, match[1])
      if (!fs.existsSync(imagePath)) missing.push(`${file} -> ${match[1]}`)
    }
  }
  assert(missing.length === 0, `Missing image references:\n${missing.join('\n')}`)
}

function verifyNoNestedButtons() {
  const files = [
    'miniprogram/pages/index/index.wxml',
    'miniprogram/pages/category/category.wxml',
    'miniprogram/pages/cart/cart.wxml',
    'miniprogram/pages/mine/mine.wxml'
  ]
  for (const file of files) {
    const text = read(file)
    const tagRe = /<\/?([a-zA-Z0-9-]+)(?:\s[^>]*)?>/g
    const stack = []
    let match
    while ((match = tagRe.exec(text))) {
      const raw = match[0]
      const tag = match[1]
      if (raw.startsWith('</')) {
        let popped
        do {
          popped = stack.pop()
        } while (popped && popped.tag !== tag)
        continue
      }
      const selfClosing = raw.endsWith('/>') || ['image', 'input'].includes(tag)
      if (tag === 'button' && stack.some((item) => item.tag === 'button')) {
        const line = text.slice(0, match.index).split(/\r?\n/).length
        throw new Error(`${file}:${line} contains nested button`)
      }
      if (!selfClosing) stack.push({ tag })
    }
  }
}

function verifyDesignCoverage() {
  const checks = {
    'miniprogram/pages/index/index.wxml': ['quick-grid', 'banner', 'product-row', 'yat-search', 'yat-capsule', 'yat-tabbar'],
    'miniprogram/pages/category/category.wxml': ['category-shell', 'side-item', 'product-row', 'member', 'market', 'yat-add-cart', 'yat-tabbar'],
    'miniprogram/pages/cart/cart.wxml': ['notice', 'empty-illustration', 'recommend-list', 'settle', 'select-all', 'yat-tabbar'],
    'miniprogram/pages/mine/mine.wxml': ['green-stats', 'order-grid', 'asset-grid', 'menu-grid', 'member-badge', 'yat-tabbar']
  }
  for (const [file, tokens] of Object.entries(checks)) {
    const text = read(file)
    for (const token of tokens) assert(text.includes(token), `${file} missing ${token}`)
  }
}

function verifyCartLayoutGuards() {
  const appWxss = read('miniprogram/app.wxss')
  const indexWxss = read('miniprogram/pages/index/index.wxss')
  const cartWxss = read('miniprogram/pages/cart/cart.wxss')
  assert(/\.yat-add-cart\s*\{[^}]*flex:\s*0 0 auto/s.test(appWxss), 'yat-add-cart should not stretch in flex layouts')
  assert(/\.yat-add-cart\s*\{[^}]*min-width:\s*60rpx/s.test(appWxss), 'yat-add-cart should keep a fixed circular width')
  assert(/\.product-card \.yat-add-cart\s*\{[^}]*flex:\s*0 0 50rpx/s.test(indexWxss), 'home product add button should keep its smaller circular size')
  assert(/\.product-card \.yat-add-cart\s*\{[^}]*min-width:\s*50rpx/s.test(indexWxss), 'home product add button should override global min width')
  assert(/\.total\s*\{[^}]*white-space:\s*nowrap/s.test(cartWxss), 'cart settlement total should stay on one line')
  assert(/\.recommend-price-row \.yat-add-cart\s*\{[^}]*flex:\s*0 0 60rpx/s.test(cartWxss), 'cart recommendation add button should stay circular')
}

function verifyStyleGuideTokens() {
  const appWxss = read('miniprogram/app.wxss')
  const cartWxss = read('miniprogram/pages/cart/cart.wxss')
  const mineWxss = read('miniprogram/pages/mine/mine.wxss')
  const required = {
    primary: '#b57a3a',
    primaryDark: '#7a4b22',
    green: '#0f3d32',
    bg: '#fff9ec',
    text: '#1f1a17',
    subText: '#8a8178',
    price: '#d84536',
    border: '#e8d6ba'
  }
  const combined = `${appWxss}\n${cartWxss}\n${mineWxss}`.toLowerCase()
  for (const [name, color] of Object.entries(required)) {
    assert(combined.includes(color), `style guide token ${name} ${color} is missing`)
  }
}

function verifyMineIconVariants() {
  const mineWxss = read('miniprogram/pages/mine/mine.wxss')
  const appWxss = read('miniprogram/app.wxss')
  const orderIcons = ['wallet', 'box', 'truck', 'clipboard', 'return']
  const menuIcons = ['member', 'distribution', 'share', 'balanceRecord', 'reservation', 'address', 'profile', 'bill', 'service']
  assert(/button\s*\{[^}]*width:\s*auto/s.test(appWxss), 'global button reset should remove WeChat default button width')
  assert(/\.top-icon\s*\{[^}]*flex:\s*0 0 54rpx/s.test(mineWxss), 'mine top icon buttons should stay circular')
  assert(/\.profile-row\s*\{[^}]*width:\s*100%/s.test(mineWxss), 'mine profile row should not shrink to button default width')
  assert(/\.menu-grid\s*\{[^}]*display:\s*flex/s.test(mineWxss), 'mine menu should use stable flex layout')
  assert(/\.menu-item\s*\{[^}]*width:\s*25%/s.test(mineWxss), 'mine menu should render four columns')
  for (const icon of orderIcons) {
    assert(mineWxss.includes(`.order-icon.${icon}`), `mine order icon ${icon} needs a specific shape`)
  }
  for (const icon of menuIcons) {
    assert(mineWxss.includes(`.menu-icon.${icon}`), `mine menu icon ${icon} needs a specific shape`)
  }
}

function createWxMock(successDataByPath) {
  const storage = { yaoaitang_logged_in: '' }
  const calls = {
    navigateTo: [],
    redirectTo: [],
    showToast: [],
    showModal: []
  }
  global.__wxCalls = calls
  global.getApp = () => ({ globalData: { apiBase: 'http://localhost:0', isLoggedIn: false } })
  global.wx = {
    getStorageSync(key) { return storage[key] },
    setStorageSync(key, value) { storage[key] = value },
    removeStorageSync(key) { delete storage[key] },
    request(options) {
      const matched = Object.keys(successDataByPath).find((key) => options.url.includes(key))
      if (matched) {
        options.success({ data: { code: 0, data: successDataByPath[matched] } })
        return
      }
      if (options.fail) options.fail(new Error('mock network fail'))
    },
    navigateTo(options) { calls.navigateTo.push(options || {}) },
    redirectTo(options) { calls.redirectTo.push(options || {}) },
    navigateBack(options) { if (options && options.fail) options.fail() },
    pageScrollTo() {},
    stopPullDownRefresh() {},
    showToast(options) { calls.showToast.push(options || {}) },
    showModal(options) { calls.showModal.push(options || {}) },
    showActionSheet() {}
  }
}

async function loadPage(relativePath, successDataByPath = {}) {
  createWxMock(successDataByPath)
  let config
  global.Page = (pageConfig) => { config = pageConfig }
  const fullPath = path.join(root, relativePath)
  delete require.cache[require.resolve(fullPath)]
  require(fullPath)
  assert(config, `${relativePath} did not register Page`)
  config.data = JSON.parse(JSON.stringify(config.data || {}))
  config.setData = function setData(patch) {
    this.data = { ...this.data, ...patch }
  }
  if (config.onLoad) config.onLoad.call(config, {})
  if (config.onShow) config.onShow.call(config)
  await new Promise((resolve) => setTimeout(resolve, 50))
  return { data: config.data, page: config, calls: global.__wxCalls }
}

async function verifyPageSmoke() {
  const pages = [
    'miniprogram/pages/index/index.js',
    'miniprogram/pages/category/category.js',
    'miniprogram/pages/cart/cart.js',
    'miniprogram/pages/mine/mine.js'
  ]
  for (const page of pages) {
    const { data } = await loadPage(page)
    assert(Array.isArray(data.tabs) && data.tabs.length === 4, `${page} missing four tabs`)
  }
}

async function verifyMineMenuPreserved() {
  const mineData = {
    stats: [
      { title: '\u79ef\u5206', metadata: '7' },
      { title: '\u4f59\u989d', metadata: '8' }
    ],
    services: [
      { title: '\u6211\u7684\u8ba2\u5355', linkType: 'placeholder', linkValue: 'orders' },
      { title: '\u5206\u9500\u4e2d\u5fc3', linkType: 'page', linkValue: '/pages/distribution/distribution' },
      { title: '\u95e8\u5e97\u670d\u52a1', linkType: 'page', linkValue: '/pages/experience/experience' },
      { title: '\u4e2a\u4eba\u8d44\u6599', linkType: 'placeholder', linkValue: 'profile' }
    ]
  }
  const { data } = await loadPage('miniprogram/pages/mine/mine.js', { '/api/public/mine': mineData })
  assert(data.menuItems.length === 9, `mine menu should preserve 9 design items, got ${data.menuItems.length}`)
  assert(data.assetItems.find((item) => item.key === 'points').value === '7', 'mine stats were not applied')
}

async function verifyCategoryFillsDesignRows() {
  const products = [
    {
      id: 101,
      name: '\u63a5\u53e3\u5546\u54c1 A',
      subtitle: '\u5df2\u552e 1 \u4ef6',
      imageUrl: '/images/product-gift-photo.png',
      price: 198,
      memberPrice: 47.92
    },
    {
      id: 102,
      name: '\u63a5\u53e3\u5546\u54c1 B',
      subtitle: '\u5df2\u552e 2 \u4ef6',
      imageUrl: '/images/product-single-photo.png',
      price: 68,
      marketPrice: 98
    }
  ]
  const { data } = await loadPage('miniprogram/pages/category/category.js', { '/api/public/products': products })
  assert(data.products.length >= 3, `category should fill first screen to at least 3 products, got ${data.products.length}`)
  assert(data.products[0].id === 101 && data.products[1].id === 102, 'category should preserve API product order before fallbacks')
}

async function verifyWeakLoginGate() {
  const cart = await loadPage('miniprogram/pages/cart/cart.js')
  assert(cart.calls.navigateTo.length === 0, 'cart onShow should not force login navigation')
  cart.page.setData({ totalCount: 1, items: [{ id: 1, selected: true, serverBacked: false }] })
  await cart.page.onCheckout.call(cart.page)
  assert(cart.calls.navigateTo.some((item) => String(item.url || '').includes('/pages/login/login')), 'cart checkout should prompt login')

  const mine = await loadPage('miniprogram/pages/mine/mine.js')
  assert(mine.calls.navigateTo.length === 0, 'mine onShow should not force login navigation')
  mine.page.onProfileTap.call(mine.page)
  assert(mine.calls.navigateTo.some((item) => String(item.url || '').includes('/pages/login/login')), 'mine sensitive profile action should prompt login')
}

async function main() {
  verifyJsSyntax()
  verifyJson()
  verifyNoBom()
  verifyWxssText()
  verifyImagesExist()
  verifyNoNestedButtons()
  verifyDesignCoverage()
  verifyCartLayoutGuards()
  verifyStyleGuideTokens()
  verifyMineIconVariants()
  await verifyPageSmoke()
  await verifyMineMenuPreserved()
  await verifyCategoryFillsDesignRows()
  await verifyWeakLoginGate()
  console.log('miniprogram UI verification ok')
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error)
  process.exit(1)
})
