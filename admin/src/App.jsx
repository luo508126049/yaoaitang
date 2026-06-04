import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  Boxes,
  ChevronRight,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Upload
} from 'lucide-react'
import { api, assetUrl, clearToken, getToken, setToken } from './lib/api'
import yaoAiTangMark from './assets/yaoaitang-mark.png'

const nav = [
  ['overview', '首页总览', LayoutDashboard],
  ['banners', '轮播图管理', Image],
  ['materials', '素材库', Upload],
  ['products', '商品管理', Package],
  ['orders', '订单管理', ShoppingBag],
  ['homeConfig', '首页配置', Settings],
  ['users', '账号权限', ShieldCheck]
]

const emptyBanner = {
  title: '',
  subtitle: '',
  imageUrl: '/assets/banner-heritage.png',
  linkType: 'certificate',
  linkValue: '',
  sortOrder: 1,
  enabled: 1
}

const emptyProduct = {
  name: '',
  subtitle: '',
  category: '艾制品',
  imageUrl: '/assets/product-moxa.png',
  price: 0,
  marketPrice: 0,
  stock: 0,
  enabled: 1,
  featured: 1,
  description: ''
}

const emptyUser = {
  username: '',
  password: '',
  displayName: '',
  roleCode: 'OPERATOR',
  enabled: 1
}

export default function App() {
  const [tokenReady, setTokenReady] = useState(Boolean(getToken()))
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('yaoaitang_admin_user') || 'null'))
  const [active, setActive] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState({
    home: null,
    banners: [],
    materials: [],
    products: [],
    orders: [],
    config: [],
    users: []
  })

  async function loadAll(section = active) {
    if (!tokenReady) return
    setLoading(true)
    setError('')
    try {
      const [home, banners, materials, products, orders, config] = await Promise.all([
        api.overview(),
        api.banners(),
        api.materials(),
        api.products(),
        api.orders(),
        api.homeConfig()
      ])
      let users = data.users
      if (section === 'users' || active === 'users') {
        users = await api.users()
      }
      setData({ home, banners, materials, products, orders, config, users })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenReady])

  async function handleLogin(credentials) {
    const result = await api.login(credentials)
    setToken(result.token)
    localStorage.setItem('yaoaitang_admin_user', JSON.stringify(result.user))
    setUser(result.user)
    setTokenReady(true)
  }

  function logout() {
    clearToken()
    localStorage.removeItem('yaoaitang_admin_user')
    setTokenReady(false)
    setUser(null)
  }

  if (!tokenReady) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <img className="brand-logo" src={yaoAiTangMark} alt="" />
          <div>
            <strong>曜艾堂</strong>
            <small>运营管理系统</small>
          </div>
        </div>
        <nav>
          {nav.map(([key, label, Icon]) => (
            <button
              key={key}
              className={active === key ? 'active' : ''}
              onClick={() => {
                setActive(key)
                if (key === 'users') loadAll('users')
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="searchbox">
            <Search size={18} />
            <input placeholder="搜索订单、商品、素材" />
          </div>
          <div className="top-actions">
            {loading && <span className="syncing">同步中...</span>}
            {error && <span className="error-pill">{error}</span>}
            <Bell size={18} />
            <span className="avatar">{user?.displayName?.slice(0, 1) || '管'}</span>
            <span>{user?.displayName || '管理员'}</span>
            <button className="icon-button" onClick={logout} title="退出登录">
              <LogOut size={17} />
            </button>
          </div>
        </header>

        {active === 'overview' && <Overview data={data} setActive={setActive} />}
        {active === 'banners' && <Banners rows={data.banners} onSaved={loadAll} />}
        {active === 'materials' && <Materials rows={data.materials} onSaved={loadAll} />}
        {active === 'products' && <Products rows={data.products} onSaved={loadAll} />}
        {active === 'orders' && <Orders rows={data.orders} onSaved={loadAll} />}
        {active === 'homeConfig' && <HomeConfig rows={data.config} onSaved={loadAll} />}
        {active === 'users' && <Users rows={data.users} onSaved={() => loadAll('users')} />}
      </main>
    </div>
  )
}

function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onLogin(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <img className="login-logo" src={yaoAiTangMark} alt="" />
        <h1>曜艾堂运营后台</h1>
        <label>
          账号
          <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </label>
        <label>
          密码
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}

function Overview({ data, setActive }) {
  const stats = [
    ['待处理订单', data.orders.filter((item) => item.status === 'PENDING' || item.status === 'PAID').length, ShoppingBag],
    ['上架商品', data.products.filter((item) => item.enabled === 1).length, Package],
    ['轮播图', data.banners.length, Image],
    ['素材资源', data.materials.length, Boxes]
  ]
  const featured = data.products.filter((item) => item.featured === 1).slice(0, 2)

  return (
    <section className="page-grid">
      <div className="main-column">
        <div className="metric-grid">
          {stats.map(([label, value, Icon]) => (
            <article className="metric-card" key={label}>
              <Icon size={21} />
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
        <Panel title="最近订单" action="查看全部" onAction={() => setActive('orders')}>
          <OrderTable rows={data.orders.slice(0, 6)} compact />
        </Panel>
      </div>
      <aside className="side-column">
        <Panel title="小程序首页预览">
          <MiniPreview banners={data.banners} products={featured} />
        </Panel>
        <div className="quick-actions">
          <button onClick={() => setActive('materials')}>
            上传素材 <ChevronRight size={16} />
          </button>
          <button onClick={() => setActive('products')}>
            新增商品 <ChevronRight size={16} />
          </button>
          <button onClick={() => setActive('homeConfig')}>
            发布首页 <ChevronRight size={16} />
          </button>
        </div>
      </aside>
    </section>
  )
}

function Banners({ rows, onSaved }) {
  const [editing, setEditing] = useState(null)
  async function remove(id) {
    await api.deleteBanner(id)
    await onSaved()
  }
  return (
    <Panel title="轮播图管理" action="新增轮播图" onAction={() => setEditing(emptyBanner)}>
      <div className="card-list">
        {rows.map((row) => (
          <article className="asset-row" key={row.id}>
            <img src={assetUrl(row.imageUrl)} alt="" />
            <div>
              <strong>{row.title}</strong>
              <span>{row.subtitle}</span>
              <small>排序 {row.sortOrder} · {row.enabled ? '已启用' : '已停用'}</small>
            </div>
            <button onClick={() => setEditing(row)}>编辑</button>
            <button className="ghost-danger" onClick={() => remove(row.id)}>删除</button>
          </article>
        ))}
      </div>
      {editing && <BannerForm value={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </Panel>
  )
}

function BannerForm({ value, onClose, onSaved }) {
  const [form, setForm] = useState(value)
  async function submit(event) {
    event.preventDefault()
    await api.saveBanner(form)
    onClose()
    await onSaved()
  }
  return (
    <Modal title={form.id ? '编辑轮播图' : '新增轮播图'} onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <Field label="标题" value={form.title} onChange={(title) => setForm({ ...form, title })} />
        <Field label="副标题" value={form.subtitle || ''} onChange={(subtitle) => setForm({ ...form, subtitle })} />
        <Field label="图片地址" value={form.imageUrl || ''} onChange={(imageUrl) => setForm({ ...form, imageUrl })} />
        <Field label="链接类型" value={form.linkType || ''} onChange={(linkType) => setForm({ ...form, linkType })} />
        <Field label="链接值" value={form.linkValue || ''} onChange={(linkValue) => setForm({ ...form, linkValue })} />
        <Field label="排序" type="number" value={form.sortOrder || 0} onChange={(sortOrder) => setForm({ ...form, sortOrder: Number(sortOrder) })} />
        <label className="checkbox-line">
          <input
            type="checkbox"
            checked={form.enabled === 1}
            onChange={(event) => setForm({ ...form, enabled: event.target.checked ? 1 : 0 })}
          />
          启用
        </label>
        <button className="primary">保存</button>
      </form>
    </Modal>
  )
}

function Materials({ rows, onSaved }) {
  const [uploading, setUploading] = useState(false)
  async function upload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')
    setUploading(true)
    await api.uploadMaterial(formData)
    setUploading(false)
    await onSaved()
  }
  return (
    <Panel title="素材库">
      <label className="upload-zone">
        <Upload size={24} />
        <span>{uploading ? '上传中...' : '上传素材'}</span>
        <input type="file" accept="image/*" onChange={upload} />
      </label>
      <div className="material-grid">
        {rows.map((row) => (
          <article key={row.id}>
            <img src={assetUrl(row.url)} alt="" />
            <strong>{row.name}</strong>
            <small>{row.type} · {row.mimeType || 'asset'}</small>
          </article>
        ))}
      </div>
    </Panel>
  )
}

function Products({ rows, onSaved }) {
  const [editing, setEditing] = useState(null)
  async function remove(id) {
    await api.deleteProduct(id)
    await onSaved()
  }
  return (
    <Panel title="商品管理" action="新增商品" onAction={() => setEditing(emptyProduct)}>
      <div className="product-table">
        {rows.map((row) => (
          <article key={row.id}>
            <img src={assetUrl(row.imageUrl)} alt="" />
            <div>
              <strong>{row.name}</strong>
              <span>{row.subtitle}</span>
            </div>
            <b>¥{row.price}</b>
            <em>{row.enabled ? '上架' : '下架'}</em>
            <button onClick={() => setEditing(row)}>编辑</button>
            <button className="ghost-danger" onClick={() => remove(row.id)}>删除</button>
          </article>
        ))}
      </div>
      {editing && <ProductForm value={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </Panel>
  )
}

function ProductForm({ value, onClose, onSaved }) {
  const [form, setForm] = useState(value)
  async function submit(event) {
    event.preventDefault()
    await api.saveProduct(form)
    onClose()
    await onSaved()
  }
  return (
    <Modal title={form.id ? '编辑商品' : '新增商品'} onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <Field label="商品名" value={form.name} onChange={(name) => setForm({ ...form, name })} />
        <Field label="副标题" value={form.subtitle || ''} onChange={(subtitle) => setForm({ ...form, subtitle })} />
        <Field label="分类" value={form.category || ''} onChange={(category) => setForm({ ...form, category })} />
        <Field label="图片地址" value={form.imageUrl || ''} onChange={(imageUrl) => setForm({ ...form, imageUrl })} />
        <Field label="价格" type="number" value={form.price || 0} onChange={(price) => setForm({ ...form, price })} />
        <Field label="划线价" type="number" value={form.marketPrice || 0} onChange={(marketPrice) => setForm({ ...form, marketPrice })} />
        <Field label="库存" type="number" value={form.stock || 0} onChange={(stock) => setForm({ ...form, stock: Number(stock) })} />
        <label className="checkbox-line">
          <input type="checkbox" checked={form.enabled === 1} onChange={(event) => setForm({ ...form, enabled: event.target.checked ? 1 : 0 })} />
          上架
        </label>
        <label className="checkbox-line">
          <input type="checkbox" checked={form.featured === 1} onChange={(event) => setForm({ ...form, featured: event.target.checked ? 1 : 0 })} />
          首页推荐
        </label>
        <button className="primary">保存</button>
      </form>
    </Modal>
  )
}

function Orders({ rows, onSaved }) {
  async function update(id, status) {
    await api.updateOrder(id, status)
    await onSaved()
  }
  return (
    <Panel title="订单管理">
      <OrderTable rows={rows} onUpdate={update} />
    </Panel>
  )
}

function OrderTable({ rows, compact, onUpdate }) {
  return (
    <table className="orders-table">
      <thead>
        <tr>
          <th>订单号</th>
          <th>客户</th>
          <th>金额</th>
          <th>状态</th>
          {!compact && <th>操作</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.orderNo}</td>
            <td>{row.customerName}</td>
            <td>¥{row.totalAmount}</td>
            <td><span className={`status ${row.status}`}>{statusText(row.status)}</span></td>
            {!compact && (
              <td>
                <button onClick={() => onUpdate(row.id, 'SHIPPED')}>发货</button>
                <button onClick={() => onUpdate(row.id, 'DONE')}>完成</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function HomeConfig({ rows, onSaved }) {
  const [draft, setDraft] = useState(rows)
  useEffect(() => setDraft(rows), [rows])
  async function submit() {
    await api.saveHomeConfig(draft)
    await onSaved()
  }
  return (
    <Panel title="首页配置" action="发布首页" onAction={submit}>
      <div className="config-list">
        {draft.map((row, index) => (
          <label key={row.configKey}>
            <span>{row.configKey}</span>
            <input
              value={row.configValue || ''}
              onChange={(event) => {
                const next = [...draft]
                next[index] = { ...row, configValue: event.target.value }
                setDraft(next)
              }}
            />
          </label>
        ))}
      </div>
    </Panel>
  )
}

function Users({ rows, onSaved }) {
  const [editing, setEditing] = useState(null)
  async function remove(id) {
    await api.deleteUser(id)
    await onSaved()
  }
  return (
    <Panel title="账号权限" action="新增账号" onAction={() => setEditing(emptyUser)}>
      <div className="product-table">
        {rows.map((row) => (
          <article key={row.id}>
            <span className="avatar">{row.displayName?.slice(0, 1)}</span>
            <div>
              <strong>{row.displayName}</strong>
              <span>{row.username}</span>
            </div>
            <b>{row.roleCode}</b>
            <em>{row.enabled ? '启用' : '停用'}</em>
            <button onClick={() => setEditing({ ...row, password: '' })}>编辑</button>
            <button className="ghost-danger" onClick={() => remove(row.id)}>删除</button>
          </article>
        ))}
      </div>
      {editing && <UserForm value={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </Panel>
  )
}

function UserForm({ value, onClose, onSaved }) {
  const [form, setForm] = useState(value)
  async function submit(event) {
    event.preventDefault()
    await api.saveUser(form)
    onClose()
    await onSaved()
  }
  return (
    <Modal title={form.id ? '编辑账号' : '新增账号'} onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <Field label="账号" value={form.username} onChange={(username) => setForm({ ...form, username })} />
        <Field label="密码" type="password" value={form.password || ''} onChange={(password) => setForm({ ...form, password })} />
        <Field label="姓名" value={form.displayName} onChange={(displayName) => setForm({ ...form, displayName })} />
        <label>
          角色
          <select value={form.roleCode} onChange={(event) => setForm({ ...form, roleCode: event.target.value })}>
            <option value="OPERATOR">运营员</option>
            <option value="SUPER_ADMIN">超级管理员</option>
          </select>
        </label>
        <label className="checkbox-line">
          <input type="checkbox" checked={form.enabled === 1} onChange={(event) => setForm({ ...form, enabled: event.target.checked ? 1 : 0 })} />
          启用
        </label>
        <button className="primary">保存</button>
      </form>
    </Modal>
  )
}

function MiniPreview({ banners, products }) {
  const banner = banners[0]
  return (
    <div className="mini-preview">
      <div className="mini-head">
        <span className="mini-seal">品</span>
        <strong>百年老字号曜艾堂</strong>
      </div>
      <div className="mini-search">搜索艾条/艾灸套餐/非遗产品</div>
      <img src={assetUrl(banner?.imageUrl || '/assets/banner-heritage.png')} alt="" />
      <div className="mini-icons">{['分销', '案例库', '视频', '先灸', '我们'].map((item) => <span key={item}>{item}</span>)}</div>
      <div className="mini-products">
        {products.map((product) => <span key={product.id}>{product.name}</span>)}
      </div>
    </div>
  )
}

function Panel({ title, action, onAction, children }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{title}</h2>
        {action && <button className="primary small" onClick={onAction}>{action}</button>}
      </div>
      {children}
    </section>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="panel-head">
          <h2>{title}</h2>
          <button onClick={onClose}>关闭</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label>
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function statusText(status) {
  return {
    PENDING: '待付款',
    PAID: '已支付',
    SHIPPED: '已发货',
    DONE: '已完成',
    CLOSED: '已关闭'
  }[status] || status
}
