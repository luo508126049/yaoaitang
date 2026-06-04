# 曜艾堂项目当前交接记录

更新时间：2026-06-04

新会话开始前请先阅读：

- `AGENTS.md`
- 本文件 `HANDOFF.md`

## 当前目标节点

项目正在做“曜艾堂小程序首页闭环”。

当前已完成：

- Java 后端、Web Admin、小程序首页已完成基础前后台联动。
- 小程序首页已优先读取 `GET /api/public/home`，接口失败才使用本地 fallback。
- 首页主要视觉资源已从 SVG 切换为 PNG。
- 首页 Banner 已改成全屏宽度铺满。
- 首页主要点击行为已从 toast 改为真实跳转或弹窗。
- 已新增小程序必要占位页和商品数据页。

下一步应从“微信开发者工具截图验收 + 继续视觉对齐”开始，不要重新设计整体架构。

## 已完成的关键功能

### 小程序首页

- 顶部品牌栏使用曜艾堂设计标：`miniprogram/images/yaoaitang-mark.png`
- 搜索框保留输入校验：
  - 空输入提示“请输入搜索关键词”
  - 违规词弹窗提示
  - 有关键词跳转商品列表页
- Banner：
  - 读取接口 `banners`
  - 使用 PNG 资源
  - 当前接口返回三张 Banner：
    - `/assets/banner-heritage.png`
    - `/assets/banner-gift.png`
    - `/assets/banner-experience.png`
  - WXML 中 Banner 容器已从 `button` 改为 `view`，避免微信 button 默认样式导致图片无法铺满。
  - WXSS 中 `.banner` 当前为 `width: 750rpx; margin: 20rpx -28rpx 0;`，用于抵消页面 padding，实现横向铺满。
- 五入口：
  - 分销：未登录跳登录页；已登录跳占位页
  - 案例库、视频专区、先灸后玉：跳占位页
  - 关于我们：保留弹窗
- 活动双卡：
  - 拼团、非遗大集跳占位页
- 商品卡：
  - 点击跳商品详情页
  - 商品字段优先使用接口数据
  - 本地 fallback 使用 PNG 商品图
- 底部 Tab：
  - 首页：滚动置顶并刷新
  - 分类：跳占位页
  - 购物车、我的：未登录跳登录页；已登录跳占位页

### 新增小程序页面

已注册到 `miniprogram/app.json`：

- `pages/products/list`
  - 商品列表/搜索结果页
  - 调用 `GET /api/public/products?keyword=...`
  - 接口失败或中文搜索空结果时使用本地 fallback 兜底
- `pages/products/detail`
  - 商品详情占位页
  - 调用 `GET /api/public/products/{id}`
  - 加购/购买未登录时跳登录
- `pages/login/login`
  - 微信快捷登录占位页
  - 不接真实微信授权
  - 登录后设置 `app.globalData.isLoggedIn = true` 和本地 storage
- `pages/placeholder/placeholder`
  - 通用业务占位页
  - 承接分类、案例库、视频、先灸后玉、拼团、非遗大集、分销、购物车、我的等入口

### 小程序工具

- `miniprogram/utils/api.js`
  - 已有 `getHome()`
  - 新增 `getProducts(keyword)`
  - 新增 `getProduct(id)`
  - `normalizeUrl()` 会将后端 `/assets/...`、`/uploads/...` 拼成 `http://localhost:8080/...`
  - 保留 fallback，后端关闭时不白屏
- `miniprogram/utils/auth.js`
  - 新增 `isLoggedIn()`
  - 新增 `markLoggedIn()`
  - 新增 `logout()`
  - 新增 `navigateToLogin(redirect)`

## 后端和后台当前状态

### 后端

- 技术栈：Spring Boot 3 + MyBatis-Plus + MySQL
- 可用 JDK：
  - `C:\Users\LUOYUNHENG\.jdks\ms-17.0.18`
- 当前使用数据库：`yaoaitang`
- 当前公开接口：
  - `GET /api/public/home`
  - `GET /api/public/products`
  - `GET /api/public/products/{id}`
- 当前后台接口：
  - 登录
  - 轮播图
  - 素材
  - 商品
  - 订单
  - 首页配置
  - 用户
- `server/src/main/resources/application.yml` 已增加 UTF-8 相关配置：
  - `server.tomcat.uri-encoding: UTF-8`
  - `server.servlet.encoding.charset: UTF-8`
  - `server.servlet.encoding.enabled: true`
  - `server.servlet.encoding.force: true`
- 注意：如果 `8080` 是修改前由 IDEA 启动的老进程，需要重启后端，新的 UTF-8 配置才会生效。

### Admin

- Admin 优先访问：`http://localhost:5174/`
- 默认账号：
  - `admin`
  - `admin123`
- Admin 已使用曜艾堂设计标替换原“品”字圆标。
- Admin build 已通过。

## 当前资源文件

小程序 PNG 资源主要在：

- `miniprogram/images/banner-heritage.png`
- `miniprogram/images/banner-gift.png`
- `miniprogram/images/banner-experience.png`
- `miniprogram/images/banner-market.png`
- `miniprogram/images/card-group.png`
- `miniprogram/images/card-market.png`
- `miniprogram/images/product-gift.png`
- `miniprogram/images/product-moxa.png`
- `miniprogram/images/product-gift-photo.png`
- `miniprogram/images/product-single-photo.png`
- `miniprogram/images/icon-feature-*.png`
- `miniprogram/images/tab-*.png`
- `miniprogram/images/yaoaitang-mark.png`

后端静态资源同步在：

- `server/src/main/resources/static/assets/`

运行中 IDEA 后端读取的 classpath 资源在：

- `server/target/classes/static/assets/`

如果新增静态资源后不重启后端，必要时需要同步到 `target/classes/static/assets/`，否则 8080 可能访问不到最新资源。

## 已验证结果

最近一次验证通过：

- 小程序全部 JS 执行 `node --check` 通过。
- 小程序 JSON 文件解析通过。
- 小程序 `.wxss/.wxml/.js/.json` 未检测到 BOM。
- Admin 执行 `npm run build` 通过。
- 后端使用 JDK 17 执行 `mvn -DskipTests package` 通过。
- 使用 Node 验证以下接口返回正常中文：
  - `http://localhost:5174/api/public/home`
  - `http://localhost:5174/api/public/products`
  - `http://localhost:5174/api/public/products/1`
- 以下资源返回 `200`：
  - `http://localhost:5174/assets/banner-heritage.png`
  - `http://localhost:5174/assets/banner-gift.png`
  - `http://localhost:5174/assets/banner-experience.png`
  - `http://localhost:5174/assets/product-gift.png`
  - `http://localhost:5174/assets/product-moxa.png`

## 重要注意事项

- 不要用 PowerShell 直接打印中文接口响应来判断中文是否损坏；PowerShell 可能显示乱码。
- 验证中文接口请用 Node、浏览器或其他 UTF-8 JSON 解析方式。
- 不要再把本机误判为只有 JDK 1.8；本项目可用 JDK 17。
- 不要回退到 SVG 作为小程序首页主视觉资源；微信开发者工具里 SVG 渲染不稳定。
- 当前小程序还没有真实微信授权、支付、真实购物车、真实分销、真实拼团规则。

## 下一步建议

新对话建议从这里继续：

1. 让用户用微信开发者工具重新编译小程序。
2. 用户发送最新首页截图。
3. 按截图继续调首页视觉：
   - 顶部品牌栏和微信胶囊安全区
   - 搜索框宽高、边距、右侧艾草图标
   - Banner 高度、裁切、指示点位置
   - 五入口图标大小、间距、文字对齐
   - 活动卡尺寸与图片裁切
   - 商品卡图片、文字、价格、购物车按钮
   - 底部 Tab 高度和安全区
4. 测试首页入口跳转：
   - 搜索
   - 商品卡
   - 更多
   - Banner
   - 分销/案例/视频/先灸后玉/关于我们
   - 拼团/非遗大集
   - 首页/分类/购物车/我的 Tab
5. 如果视觉截图通过，再进入后台表单体验优化：
   - 上传素材后可一键选择图片到 Banner/商品
   - 首页配置预览更接近小程序
   - 表单校验和状态筛选
