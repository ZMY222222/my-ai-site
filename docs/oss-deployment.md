# my-ai-site 阿里云 OSS 静态托管部署指南

## 架构概览

```
┌─────────┐    git push     ┌───────────┐   npm run build    ┌─────────────┐
│  本地开发  │ ──────────────→ │  GitHub     │                    │  Next.js      │
│  (Win/Mac) │               │  仓库      │                    │  static export │
└─────────┘                 └───────────┘                    └──────┬──────┘
                                                                    │ out/
                                                          ┌─────────▼─────────┐
                                                          │  阿里云 OSS Bucket  │
                                                          │  (静态网站托管)      │
                                                          └─────────┬─────────┘
                                                                    │
                                                    ┌───────────────▼───────────────┐
                                                    │  阿里云 CDN (可选，推荐)        │
                                                    │  • 全球加速 + HTTPS            │
                                                    │  • 自定义域名绑定              │
                                                    └───────────────────────────────┘
```

**方案说明**：
- Next.js 开启 `output: 'export'` 模式，将所有页面预渲染为纯静态 HTML/CSS/JS
- 输出目录 `out/` 直接上传至阿里云 OSS
- OSS 开启「静态网站托管」功能，设置默认首页和 404 页面
- 可选：CDN 加速 + 自定义域名 + 免费 SSL 证书

---

## 前置准备

### 1. 阿里云账号 & OSS 开通

- 注册 [阿里云账号](https://account.aliyun.com)
- 开通 [OSS 服务](https://oss.console.aliyun.com)
- 创建 Bucket：
  - **Bucket 名称**：全局唯一，如 `my-ai-site`
  - **地域**：选择离用户最近的（如 `华东1-杭州` = `oss-cn-hangzhou`）
  - **存储类型**：标准存储
  - **读写权限**：**公共读**（静态网站必须）

### 2. 安装 ossutil CLI（2.x）

[官方文档](https://help.aliyun.com/zh/oss/developer-reference/ossutil-overview)

**Windows（PowerShell）：**

```powershell
# 下载
Invoke-WebRequest -Uri "https://gosspublic.alicdn.com/ossutil/v2/2.3.0/ossutil-2.3.0-windows-amd64.zip" -OutFile "$env:USERPROFILE\ossutil.zip"

# 解压
Expand-Archive -Path "$env:USERPROFILE\ossutil.zip" -DestinationPath "$env:USERPROFILE\ossutil"

# 配置凭证（按提示输入 AccessKey ID / Secret / Region）
& "$env:USERPROFILE\ossutil\ossutil-2.3.0-windows-amd64\ossutil.exe" config
```

**macOS / Linux：**

```bash
# 下载（以 Linux x86_64 为例）
curl -o ossutil.zip https://gosspublic.alicdn.com/ossutil/v2/2.3.0/ossutil-2.3.0-linux-amd64.zip
unzip ossutil.zip
chmod +x ossutil-2.3.0-linux-amd64/ossutil
sudo mv ossutil-2.3.0-linux-amd64/ossutil /usr/local/bin/

# 配置凭证
ossutil config
```

### 3. AccessKey 获取

在 [RAM 访问控制](https://ram.console.aliyun.com/users) 创建子用户，授予 `AliyunOSSFullAccess` 权限，获取 AccessKey ID 和 Secret。

### 4. 安装 aliyun CLI（CDN 刷新用，可选）

```bash
# macOS
brew install aliyun-cli
aliyun configure
```

---

## 一键部署

### Step 1：填写配置文件

```bash
cp scripts/env.oss.example scripts/env.oss
```

编辑 `scripts/env.oss`，填入你的实际配置：

```bash
OSS_BUCKET=my-ai-site                  # 你的 Bucket 名称
OSS_REGION=oss-cn-hangzhou             # Bucket 所在地域
OSS_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com

# 可选：启用 CDN 刷新
# CDN_DOMAIN=www.example.com
# CDN_REFRESH_PATH=http://www.example.com/
```

### Step 2：执行部署

**Windows（PowerShell）：**

```powershell
.\scripts\deploy-oss.ps1
```

**macOS / Linux（Bash）：**

```bash
chmod +x scripts/deploy-oss.sh
./scripts/deploy-oss.sh
```

脚本自动完成：
1. `npm ci` — 安装依赖
2. `DEPLOY_TARGET=oss npm run build` — 构建静态站点到 `out/`
3. 上传所有 HTML 文件（Cache-Control: `no-cache`）
4. 上传 JS/CSS/图片等静态资源（Cache-Control: `max-age=31536000, immutable`）
5. 配置 Bucket 静态网站托管（默认首页 `index.html`，404 页 `404.html`）
6. （可选）刷新 CDN 缓存

---

## 路由 & 路径说明

构建后 `out/` 目录结构（`trailingSlash: true`）：

```
out/
├── index.html                 → /
├── 404.html                   → 任意不存在的路径
├── home/
│   └── index.html             → /home/
├── about/
│   └── index.html             → /about/
├── portfolio/
│   ├── index.html             → /portfolio/
│   ├── ai-text-to-image-gallery/
│   │   └── index.html         → /portfolio/ai-text-to-image-gallery/
│   ├── ai-text-to-video-gallery/
│   │   └── index.html         → /portfolio/ai-text-to-video-gallery/
│   ├── ai-image-to-video-gallery/
│   │   └── index.html         → /portfolio/ai-image-to-video-gallery/
│   └── ai-info-and-eval-collection/
│       └── index.html         → /portfolio/ai-info-and-eval-collection/
├── projects/
│   └── index.html             → /projects/
├── skills/
│   └── index.html             → /skills/
├── education/
│   └── index.html             → /education/
├── experience/
│   └── index.html             → /experience/
├── A1.jpg                     → /A1.jpg
├── A2.jpg                     → /A2.jpg
├── B1.jpg                     → /B1.jpg
├── B2.jpg                     → /B2.jpg
└── _next/
    └── static/                → JS/CSS chunk 文件（带 content hash）
```

**关键配置：**
- `trailingSlash: true` — 确保 `{path}/index.html` 目录结构，与 OSS 默认索引文档机制完全兼容
- `_next/static/` — Next.js 编译产物，文件名含 content hash，更新部署自动缓存失效
- `/api/health` — 静态导出模式不包含 API 路由，该接口需用函数计算等方案独立部署

**404 处理：**
- 任何不存在的路径，OSS 会返回 `404.html`（已在脚本中通过 `--error-document 404.html` 配置）
- `not-found.tsx` → `out/404.html`，包含返回首页和项目页的导航链接

---

## 绑定自定义域名

### 方式一：OSS 直接绑定（推荐用于测试）

1. 进入 [OSS 控制台](https://oss.console.aliyun.com) → 选择 Bucket
2. 左侧菜单 **传输管理** → **域名管理**
3. 点击 **绑定域名**，输入你的域名（如 `www.example.com`）
4. 在域名 DNS 服务商处添加 CNAME 记录：
   ```
   主机记录: www
   记录类型: CNAME
   记录值:   {bucket}.{region}.aliyuncs.com
   ```
5. 如需 HTTPS，在域名管理页面开启「自动跳转」并上传 SSL 证书

### 方式二：CDN 加速域名绑定（推荐用于生产）

此方式同时获得 CDN 加速 + HTTPS：

1. 进入 [CDN 控制台](https://cdn.console.aliyun.com) → **域名管理** → **添加域名**
2. 填写：
   - **加速域名**：`www.example.com`
   - **业务类型**：图片小文件
   - **源站信息**：OSS 域名，选择对应的 Bucket
   - **端口**：80 / 443

3. 在域名 DNS 服务商添加 CNAME：
   ```
   主机记录: www
   记录类型: CNAME
   记录值:   {CDN分配的CNAME地址}.w.kunlun{xx}.com
   ```

---

## CDN 加速配置

### 推荐缓存策略

| 资源类型 | 路径 | 缓存时间 | 说明 |
|---------|------|---------|------|
| HTML 页面 | `*.html` | 不缓存 / 短缓存 | 保证用户第一时间看到最新内容 |
| JS / CSS | `_next/static/*` | 365 天 | 文件名含 content hash，更新即失效 |
| 图片 | `*.jpg, *.png, *.svg` | 30 天 | 图片更新频率低 |
| 字体 | `*.woff2, *.ttf` | 365 天 | 字体文件很少变动 |

### CDN 控制台配置

1. 进入 CDN 域名管理 → 点击域名 → **缓存配置**
2. 添加缓存规则：

```
路径: /                          类型: 目录  过期时间: 0秒 (不缓存)
路径: *.html                     类型: 文件  过期时间: 0秒 (不缓存)
路径: _next/static/              类型: 目录  过期时间: 365天
路径: *.jpg|*.png|*.svg|*.webp   类型: 文件  过期时间: 30天
```

### CDN 刷新

部署脚本末尾已包含 CDN 刷新命令。手动刷新：

```bash
# 刷新目录（推荐）
aliyun cdn RefreshObjectCaches --ObjectPath https://www.example.com/ --ObjectType Directory

# 刷新具体文件
aliyun cdn RefreshObjectCaches --ObjectPath https://www.example.com/index.html --ObjectType File
```

---

## HTTPS 配置

### 在 CDN 中配置 HTTPS（推荐）

1. CDN 控制台 → 域名管理 → 点击域名 → **HTTPS 配置**
2. 开启 **HTTPS 安全加速**
3. 证书来源选择：
   - **免费证书**：阿里云提供免费 DV 证书（自动续期）
   - **云盾证书**：已购买的商业证书
   - **自定义上传**：自有 SSL 证书
4. 开启 **强制跳转**（HTTP → HTTPS）
5. 推荐 TLS 协议版本：TLSv1.2 + TLSv1.3

### 在 OSS 中配置 HTTPS（不使用 CDN 时）

1. OSS 控制台 → Bucket → 域名管理 → 绑定域名
2. 证书管理 → 上传证书（.pem + .key）
3. 开启 **自动跳转**

---

## 常见问题

### Q: 刷新页面出现 404？

**原因**：Hash Router 与静态托管不兼容。

本项目使用 `trailingSlash: true` 且输出为目录式结构（`/home/index.html`），OSS 配置了 `index.html` 为默认索引文档，访问 `/home/` 会自动返回 `home/index.html`，**不会出现此问题**。

### Q: 图片加载不出来？

检查：
1. `public/` 目录下的文件是否正确上传到 Bucket 根目录
2. `next.config.ts` 中 `images.unoptimized: true` 是否生效（已默认包含在 OSS 构建模式下）

### Q: CSS / JS 缓存不更新？

部署脚本上传静态资源时使用了 `immutable` 缓存标记，但 Next.js 的构建产物文件名包含 content hash（如 `main-abc123.js`），文件内容变化时 hash 不同，所以浏览器会自动请求新文件，无需担心缓存过期问题。

### Q: /api/health 接口不可用？

OSS 是静态文件托管服务，不支持服务端 API。如需 API：
- 使用阿里云函数计算 (FC) 单独部署 API
- 或使用 Vercel 部署（保留 SSR 能力）

### Q: 构建报错 "API routes are not supported"？

`next.config.ts` 已通过 `DEPLOY_TARGET=oss` 环境变量条件开启 `output: 'export'`。Vercel 部署时不会触发此模式。确保部署脚本使用 `DEPLOY_TARGET=oss npm run build`。

### Q: 本地如何测试构建结果？

```bash
DEPLOY_TARGET=oss npm run build
npx serve out
```

访问 `http://localhost:3000` 验证静态站点是否正常运行。

---

## 目录结构总结

```
my-ai-site/
├── next.config.ts               # 条件导出配置（DEPLOY_TARGET=oss → static export）
├── scripts/
│   ├── env.oss.example          # OSS 配置模板
│   ├── env.oss                  # 你的实际配置（已 gitignore）
│   └── deploy-oss.sh            # 一键部署脚本
├── out/                         # 构建产物（已 gitignore）
│   ├── index.html
│   ├── 404.html
│   ├── home/index.html
│   ├── portfolio/index.html
│   ├── portfolio/{id}/index.html
│   └── _next/static/            # JS/CSS chunk + 字体
└── public/
    ├── A1.jpg, A2.jpg           # 照片（自动复制到 out/）
    ├── B1.jpg, B2.jpg
    └── portfolio/               # 作品集图片（自动复制到 out/）
```
