# 曜艾堂项目代理上下文

后续新会话在执行任何开发、调试、构建、联调任务前，先阅读本文件，并按这里的环境事实判断，避免重复误判。

## 本机 Java 环境

- 不要默认认为本机只有 JDK 1.8。
- IDEA 可用 JDK 17：
  - `C:\Users\LUOYUNHENG\.jdks\ms-17.0.18`
- IntelliJ IDEA 2025 自带 JBR 21：
  - `E:\Program Files\JetBrains\IntelliJ IDEA 2025.3.3\jbr`
- `server` 是 Spring Boot 3 项目，可用上述 JDK 17/JBR 21 编译运行。
- 如果 shell 默认 `java -version` 显示 JDK 1.8，不要直接判定后端无法运行；应在当前命令里临时设置：

```powershell
$env:JAVA_HOME='C:\Users\LUOYUNHENG\.jdks\ms-17.0.18'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

## 运行服务与端口

- `8080` 可能已有 IDEA 启动的 Java 后端服务。
- `3306` 是 MySQL，当前项目使用 `yaoaitang` 数据库。
- 本地数据库连接信息：
  - Host：`localhost`
  - Port：`3306`
  - Database：`yaoaitang`
  - Username：`root`
  - Password：`123456`
- Admin 优先使用：
  - `http://localhost:5174/`
- 小程序首页 Java API：
  - `http://localhost:8080/api/public/home`
- Vite 代理下也可访问：
  - `http://localhost:5174/api/public/home`

## 编码与接口验证

- PowerShell 直接打印接口中文时可能显示乱码。
- 不要根据 PowerShell 输出乱码判断接口数据损坏。
- 验证中文 JSON 时，优先用 Node、浏览器或其他能正确按 UTF-8 解析 JSON 的方式。

示例：

```powershell
@'
async function main() {
  const res = await fetch('http://localhost:5174/api/public/home')
  const body = await res.json()
  console.log(JSON.stringify({
    brandName: body.data.brandName,
    searchPlaceholder: body.data.searchPlaceholder,
    firstBanner: body.data.banners[0],
    firstProduct: body.data.products[0]
  }, null, 2))
}
main().catch((err) => { console.error(err); process.exit(1) })
'@ | node -
```

## 当前开发约定

- 小程序首页应优先读取 `GET /api/public/home` 的真实接口数据。
- 接口失败时才使用本地 fallback。
- 小程序首页视觉资源优先使用 PNG，避免微信开发者工具里 SVG 渲染不稳定。
- 后台上传素材、轮播图、商品、首页配置保存后，应能通过公开首页接口被小程序读取。
- 后台登录账号：
  - 用户名：`admin`
  - 密码：`admin123`

## 已验证结论

- 使用 `C:\Users\LUOYUNHENG\.jdks\ms-17.0.18` 后，`server` 可执行 `mvn -DskipTests package` 并构建成功。
- `http://localhost:5174/api/public/home` 已验证可返回正确中文和 PNG 路径。
- `http://localhost:5174/assets/banner-heritage.png`、`http://localhost:5174/assets/product-gift.png` 已验证返回 `200`。
