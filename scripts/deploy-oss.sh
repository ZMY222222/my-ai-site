#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# my-ai-site 阿里云 OSS 一键部署脚本
# =============================================================================
# 用法:
#   1. 复制 scripts/env.oss.example 为 scripts/env.oss 并填入你的配置
#   2. chmod +x scripts/deploy-oss.sh
#   3. ./scripts/deploy-oss.sh
#
# 前置依赖:
#   - Node.js >= 18
#   - ossutil 2.x (阿里云官方 CLI) 已安装并配置
#     安装: https://help.aliyun.com/zh/oss/developer-reference/ossutil-overview
# =============================================================================

# --------------- 加载配置 ---------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$SCRIPT_DIR/env.oss"

if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
else
  echo "❌ 未找到配置文件: $ENV_FILE"
  echo "   请复制 scripts/env.oss.example 为 scripts/env.oss 并填入配置"
  exit 1
fi

# --------------- 校验必要变量 ---------------
REQUIRED_VARS=(OSS_BUCKET OSS_REGION OSS_ENDPOINT)
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "❌ 缺少必要配置: $var"
    exit 1
  fi
done

# --------------- 可选配置默认值 ---------------
CACHE_CONTROL_HTML="${CACHE_CONTROL_HTML:-no-cache}"
CACHE_CONTROL_ASSETS="${CACHE_CONTROL_ASSETS:-public,max-age=31536000,immutable}"
BUILD_DIR="${PROJECT_DIR}/out"

echo "============================================"
echo "  my-ai-site → 阿里云 OSS 部署"
echo "============================================"
echo ""
echo "  Bucket:   ${OSS_BUCKET}"
echo "  Region:   ${OSS_REGION}"
echo "  Endpoint: ${OSS_ENDPOINT}"
echo ""

# --------------- Step 1: 安装依赖 ---------------
echo "📦 [1/5] 安装依赖..."
cd "$PROJECT_DIR"
npm ci --prefer-offline

# --------------- Step 2: 静态构建 ---------------
echo ""
echo "🔨 [2/5] 构建静态站点 (output: export)..."
DEPLOY_TARGET=oss npm run build

if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ 构建失败：未生成 out/ 目录"
  exit 1
fi

echo "✅ 构建完成，输出目录: $BUILD_DIR"

# --------------- Step 3: 上传 HTML 文件 ---------------
echo ""
echo "📤 [3/5] 上传 HTML 文件 (Cache-Control: $CACHE_CONTROL_HTML)..."

ossutil cp "$BUILD_DIR" "oss://${OSS_BUCKET}" \
  --recursive \
  --include "*.html" \
  --endpoint "$OSS_ENDPOINT" \
  --meta "Cache-Control:${CACHE_CONTROL_HTML}" \
  --update

# --------------- Step 4: 上传静态资源 ---------------
echo ""
echo "📤 [4/5] 上传静态资源 (Cache-Control: $CACHE_CONTROL_ASSETS)..."

# JS / CSS / 字体 / 图片 等长缓存
ossutil cp "$BUILD_DIR" "oss://${OSS_BUCKET}" \
  --recursive \
  --include "*.js" --include "*.css" --include "*.woff2" \
  --include "*.woff" --include "*.ttf" --include "*.svg" \
  --include "*.png" --include "*.jpg" --include "*.jpeg" \
  --include "*.gif" --include "*.webp" --include "*.ico" \
  --include "*.json" --include "*.txt" --include "*.xml" \
  --endpoint "$OSS_ENDPOINT" \
  --meta "Cache-Control:${CACHE_CONTROL_ASSETS}" \
  --update

# --------------- Step 5: 设置 Bucket 静态网站托管 ---------------
echo ""
echo "⚙️  [5/5] 配置 Bucket 静态网站托管..."

ossutil website "oss://${OSS_BUCKET}" \
  --method put \
  --index-document index.html \
  --error-document 404.html \
  --endpoint "$OSS_ENDPOINT"

# --------------- 完成 ---------------
echo ""
echo "============================================"
echo "  ✅ 部署完成！"
echo "============================================"
echo ""
echo "  OSS 默认域名:"
echo "  http://${OSS_BUCKET}.${OSS_REGION}.aliyuncs.com"
echo ""

if [ -n "${CDN_DOMAIN:-}" ]; then
  echo "  刷新 CDN 缓存..."
  if [ -n "${CDN_REFRESH_PATH:-}" ]; then
    aliyun cdn RefreshObjectCaches \
      --ObjectPath "${CDN_REFRESH_PATH}" \
      --ObjectType Directory
  fi
  echo "  CDN 域名: https://${CDN_DOMAIN}"
  echo ""
fi

echo "  下一步:"
echo "  1. 在 OSS 控制台绑定自定义域名: https://oss.console.aliyun.com/bucket/${OSS_REGION}/${OSS_BUCKET}/domain"
echo "  2. 如需 HTTPS，在 CDN 或 OSS 域名管理中添加 SSL 证书"
echo "  3. 检查默认首页和 404 页面是否生效"
echo ""
