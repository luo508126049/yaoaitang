# 曜艾堂小程序 + 运营后台

本仓库包含三个子项目：

- `server/`：Java Spring Boot 3 API，MyBatis-Plus + MySQL。
- `admin/`：React + Vite Web 运营后台。
- `miniprogram/`：微信小程序原生首页。

## 后端启动

需要 Java 17+、Maven、MySQL。

1. 创建数据库：

```sql
CREATE DATABASE yaoaitang DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 配置环境变量，或直接使用默认本地配置：

```powershell
$env:MYSQL_URL="jdbc:mysql://localhost:3306/yaoaitang?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&useSSL=false"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="your_password"
$env:JWT_SECRET="replace-with-a-long-random-secret"
```

3. 启动：

```powershell
cd server
mvn spring-boot:run
```

默认会执行 `schema.sql` 和 `data.sql`，初始化表和示例数据。

默认后台账号：

- 超级管理员：`admin` / `admin123`
- 运营员：`operator` / `admin123`

首次登录成功后，后端会把明文 seed 密码升级为 BCrypt 哈希。

## 运营后台启动

```powershell
cd admin
npm install
npm run dev
```

默认访问：`http://localhost:5173`

Vite 已代理：

- `/api` -> `http://localhost:8080`
- `/assets` -> `http://localhost:8080`
- `/uploads` -> `http://localhost:8080`

## 微信小程序预览

用微信开发者工具导入 `miniprogram/`。

当前 `project.config.json` 使用测试 appid，并关闭了本地开发域名校验。小程序默认请求：

```text
http://localhost:8080
```

如果后端未启动，小程序首页会使用本地 fallback 数据，仍可预览 UI 和交互。

## 首版功能范围

- 后台：登录、轮播图、素材库、商品、订单、首页配置、账号权限。
- 小程序：首页读取公开接口、轮播、搜索校验、品牌/证书/关于弹窗、快捷入口、活动卡、商品卡、底部 Tab。
- 未包含：微信支付、物流、退款、分销佣金结算、真实拼团规则、完整多页小程序。
