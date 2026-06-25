前端开发时建议**不要把整页切成图片**，只切「不可用 CSS / Iconfont / 组件实现」的视觉素材。文字、按钮、卡片、价格、底部导航都建议前端组件化实现。

下面是这套 UI 需要准备的切图元素清单。

------

## 1. 通用全局切图元素

| 元素                     | 建议文件名                 | 用途                       | 建议格式   |
| ------------------------ | -------------------------- | -------------------------- | ---------- |
| 品牌 Logo 圆形图标       | `logo_emblem.svg`          | 顶部品牌标识、会员徽章     | SVG        |
| 品牌文字 Logo            | `logo_text.png / svg`      | “百年老字号 曜艾堂”        | SVG 优先   |
| 背景宣纸纹理             | `bg_rice_paper.png`        | 全局浅米色背景             | PNG / WebP |
| 淡山水背景纹理           | `bg_landscape_light.png`   | 个人中心、购物车空状态背景 | PNG / WebP |
| 云纹装饰 1               | `decor_cloud_01.svg`       | Banner、卡片角落装饰       | SVG        |
| 云纹装饰 2               | `decor_cloud_02.svg`       | 个人中心背景装饰           | SVG        |
| 分割线花纹               | `decor_divider_flower.svg` | “您或许会喜欢”等标题分割   | SVG        |
| 小程序右上角胶囊按钮背景 | 不建议切图                 | 用 CSS 实现                | CSS        |

------

## 2. 首页需要的切图元素

| 元素                       | 建议文件名                    | 用途                         | 建议格式   |
| -------------------------- | ----------------------------- | ---------------------------- | ---------- |
| 首页主 Banner              | `banner_home_01.webp`         | 首页轮播图                   | WebP / JPG |
| Banner 证书图片            | `img_certificate.webp`        | 非遗证书展示                 | WebP       |
| 艾草产品包装图 1           | `product_yiyu_ai_box_01.webp` | 商品卡片                     | WebP / PNG |
| 艾草产品包装图 2           | `product_yiyu_ai_box_02.webp` | 商品卡片                     | WebP / PNG |
| 艾绒家庭装图               | `product_airong_family.webp`  | 商品卡片                     | WebP / PNG |
| 首页功能入口图标：分销     | `icon_distribution.svg`       | 首页宫格入口                 | SVG        |
| 首页功能入口图标：案例库   | `icon_case.svg`               | 首页宫格入口                 | SVG        |
| 首页功能入口图标：视频专区 | `icon_video.svg`              | 首页宫格入口                 | SVG        |
| 首页功能入口图标：关于我们 | `icon_about.svg`              | 首页宫格入口                 | SVG        |
| 首页功能入口图标：拼团     | `icon_group.svg`              | 首页宫格入口                 | SVG        |
| 首页功能入口图标：非遗大集 | `icon_heritage.svg`           | 首页宫格入口                 | SVG        |
| 首页功能入口图标：灸友之家 | `icon_friend.webp`            | 若使用真实照片入口，需要切图 | WebP       |

------

## 3. 分类页需要的切图元素

| 元素                 | 建议文件名                      | 用途                   | 建议格式 |
| -------------------- | ------------------------------- | ---------------------- | -------- |
| 分类侧栏选中装饰条   | 不建议切图                      | CSS `border-left` 实现 | CSS      |
| 艾草海盐足浴包商品图 | `product_footbath_seasalt.webp` | 商品列表图             | WebP     |
| 中药足浴包商品图     | `product_footbath_tcm.webp`     | 商品列表图             | WebP     |
| 中药沐浴包商品图     | `product_bath_tcm.webp`         | 商品列表图             | WebP     |
| 加入购物车圆形图标   | `icon_cart_add.svg`             | 商品列表按钮           | SVG      |
| 搜索图标             | `icon_search.svg`               | 搜索框                 | SVG      |

分类页中左侧分类栏、商品标题、销量、价格、划线价、会员价标签，都建议前端直接写，不建议切成图片。

------

## 4. 购物车页需要的切图元素

| 元素                 | 建议文件名                       | 用途                  | 建议格式 |
| -------------------- | -------------------------------- | --------------------- | -------- |
| 空购物车图标         | `empty_cart.svg`                 | 空状态展示            | SVG      |
| 公告喇叭图标         | `icon_notice.svg`                | 顶部库存提示          | SVG      |
| 艾草茶商品图         | `product_ai_tea_10g.webp`        | 推荐商品 / 购物车商品 | WebP     |
| 艾草海盐足浴包商品图 | `product_footbath_seasalt.webp`  | 商品卡片              | WebP     |
| 购物车加号图标       | `icon_cart_plus.svg`             | 推荐商品按钮          | SVG      |
| 勾选框未选中         | 不建议切图                       | CSS 圆形边框实现      | CSS      |
| 勾选框选中           | `icon_checkbox_checked.svg` 可选 | 购物车选择状态        | SVG      |

底部结算栏建议用前端布局实现，不建议切图。

------

## 5. 我的 / 用户中心页需要的切图元素

| 元素             | 建议文件名                     | 用途                | 建议格式   |
| ---------------- | ------------------------------ | ------------------- | ---------- |
| 默认用户头像     | `avatar_default.png`           | 用户头像            | PNG / WebP |
| 会员徽章         | `badge_member.svg`             | 普通会员标识        | SVG        |
| 深绿色数据卡背景 | 不建议切图                     | CSS 渐变 + 云纹 SVG | CSS + SVG  |
| 收藏图标         | `icon_favorite.svg`            | 我的收藏            | SVG        |
| 足迹图标         | `icon_footprint.svg`           | 我的足迹            | SVG        |
| 待付款图标       | `icon_order_pay.svg`           | 我的订单            | SVG        |
| 待发货图标       | `icon_order_ship.svg`          | 我的订单            | SVG        |
| 待收货图标       | `icon_order_receive.svg`       | 我的订单            | SVG        |
| 已完成图标       | `icon_order_done.svg`          | 我的订单            | SVG        |
| 售后图标         | `icon_order_refund.svg`        | 我的订单            | SVG        |
| 积分图标         | `icon_points.svg`              | 资产卡片            | SVG        |
| 余额图标         | `icon_balance.svg`             | 资产卡片            | SVG        |
| 优惠券图标       | `icon_coupon.svg`              | 资产卡片            | SVG        |
| 卡券图标         | `icon_ticket.svg`              | 资产卡片            | SVG        |
| 会员中心图标     | `icon_member_center.svg`       | 菜单栏              | SVG        |
| 分销中心图标     | `icon_distribution_center.svg` | 菜单栏              | SVG        |
| 一键发圈图标     | `icon_share_circle.svg`        | 菜单栏              | SVG        |
| 余额记录图标     | `icon_balance_record.svg`      | 菜单栏              | SVG        |
| 预约图标         | `icon_reservation.svg`         | 菜单栏              | SVG        |
| 收货地址图标     | `icon_address.svg`             | 菜单栏              | SVG        |
| 个人资料图标     | `icon_profile.svg`             | 菜单栏              | SVG        |
| 账单中心图标     | `icon_bill.svg`                | 菜单栏              | SVG        |
| 客服图标         | `icon_service.svg`             | 菜单栏              | SVG        |

------

## 6. 底部 TabBar 切图元素

建议统一做成 SVG 图标，前端根据选中态切换颜色。

| Tab    | 未选中图标         | 选中图标                  |
| ------ | ------------------ | ------------------------- |
| 首页   | `tab_home.svg`     | `tab_home_active.svg`     |
| 分类   | `tab_category.svg` | `tab_category_active.svg` |
| 购物车 | `tab_cart.svg`     | `tab_cart_active.svg`     |
| 我的   | `tab_user.svg`     | `tab_user_active.svg`     |

颜色建议：

```
--color-primary: #B57A3A;
--color-primary-dark: #7A4B22;
--color-green: #0F3D32;
--color-bg: #FFF9EC;
--color-card: #FFFFFF;
--color-text-main: #1F1A17;
--color-text-sub: #8A8178;
--color-price: #D84536;
--color-border: #E8D6BA;
```

------

## 7. 推荐前端目录结构

```
assets/
  images/
    banner/
      banner_home_01.webp
    product/
      product_yiyu_ai_box_01.webp
      product_yiyu_ai_box_02.webp
      product_airong_family.webp
      product_footbath_seasalt.webp
      product_footbath_tcm.webp
      product_bath_tcm.webp
      product_ai_tea_10g.webp
    background/
      bg_rice_paper.png
      bg_landscape_light.png
    avatar/
      avatar_default.png

  icons/
    common/
      logo_emblem.svg
      icon_search.svg
      icon_cart_add.svg
      icon_notice.svg
      empty_cart.svg
    home/
      icon_distribution.svg
      icon_case.svg
      icon_video.svg
      icon_about.svg
      icon_group.svg
      icon_heritage.svg
    user/
      icon_order_pay.svg
      icon_order_ship.svg
      icon_order_receive.svg
      icon_order_done.svg
      icon_order_refund.svg
      icon_points.svg
      icon_balance.svg
      icon_coupon.svg
      icon_ticket.svg
    tabbar/
      tab_home.svg
      tab_home_active.svg
      tab_category.svg
      tab_category_active.svg
      tab_cart.svg
      tab_cart_active.svg
      tab_user.svg
      tab_user_active.svg
```

------

## 8. 哪些内容不建议切图

这些应该交给前端实现：

1. 搜索框、按钮、圆角卡片、阴影；
2. 商品标题、销量、价格、会员价；
3. TabBar 文字；
4. 左侧分类栏；
5. 购物车结算栏；
6. 用户中心订单卡片；
7. 积分、余额、优惠券、卡券数值；
8. 小程序右上角胶囊按钮；
9. 页面标题、导航栏文字。

这样前端开发时才方便适配不同屏幕、动态数据和接口返回内容。