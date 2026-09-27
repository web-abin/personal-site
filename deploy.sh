#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REMOTE_HOST="${DEPLOY_HOST:-root@49.233.191.112}"
REMOTE_BASE="/var/www/weioxabin-portfolio"
REMOTE_CURRENT="${REMOTE_BASE}/current"
NGINX_CONF="/etc/nginx/conf.d/abin.website.conf"
SITE_URL="https://abin.website"
RELEASE_ID="$(date +%Y%m%d_%H%M%S)"
REMOTE_RELEASE="${REMOTE_BASE}/releases/${RELEASE_ID}"
NGINX_BACKUP="${NGINX_CONF}.bak_${RELEASE_ID}"

for command_name in npm ssh rsync curl; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "缺少命令：${command_name}" >&2
    exit 1
  fi
done

cd "${PROJECT_DIR}"

echo "[1/5] 安装锁定版本的依赖"
npm ci

echo "[2/5] 构建静态网站"
npm run build

BUILD_DIR="${PROJECT_DIR}/dist/client"

if [[ ! -f "${BUILD_DIR}/index.html" ]]; then
  echo "构建失败：未生成 dist/client/index.html" >&2
  exit 1
fi

echo "[3/5] 上传新版本"
ssh "${REMOTE_HOST}" "mkdir -p '${REMOTE_RELEASE}'"
rsync -az --delete --exclude '.DS_Store' "${BUILD_DIR}/" "${REMOTE_HOST}:${REMOTE_RELEASE}/"

PREVIOUS_RELEASE="$(ssh "${REMOTE_HOST}" "readlink -f '${REMOTE_CURRENT}' 2>/dev/null || true")"

echo "[4/5] 原子切换线上版本"
ssh "${REMOTE_HOST}" bash -s -- \
  "${REMOTE_BASE}" \
  "${REMOTE_RELEASE}" \
  "${REMOTE_CURRENT}" \
  "${NGINX_CONF}" \
  "${NGINX_BACKUP}" <<'REMOTE_SCRIPT'
set -Eeuo pipefail

remote_base="$1"
remote_release="$2"
remote_current="$3"
nginx_conf="$4"
nginx_backup="$5"
old_root='root  /usr/share/nginx/html;'
new_root="root ${remote_current};"
old_try_files='try_files $uri $uri/ =404;'
new_try_files='try_files $uri $uri.html $uri/ =404;'
config_changed=0

test -f "${remote_release}/index.html"
mkdir -p "${remote_base}/releases"

ln -sfn "${remote_release}" "${remote_current}.next"
mv -Tf "${remote_current}.next" "${remote_current}"

if grep -Fq "${old_root}" "${nginx_conf}"; then
  cp -a "${nginx_conf}" "${nginx_backup}"
  sed -i "s#${old_root}#${new_root}#" "${nginx_conf}"
  if grep -Fq "${old_try_files}" "${nginx_conf}"; then
    sed -i "s#${old_try_files}#${new_try_files}#" "${nginx_conf}"
  elif ! grep -Fq "${new_try_files}" "${nginx_conf}"; then
    cp -a "${nginx_backup}" "${nginx_conf}"
    echo "Nginx 路由配置与预期不符，已停止部署。" >&2
    exit 1
  fi
  config_changed=1
elif ! grep -Fq "${new_root}" "${nginx_conf}"; then
  echo "Nginx 根目录配置与预期不符，已停止部署。" >&2
  exit 1
elif grep -Fq "${old_try_files}" "${nginx_conf}"; then
  cp -a "${nginx_conf}" "${nginx_backup}"
  sed -i "s#${old_try_files}#${new_try_files}#" "${nginx_conf}"
  config_changed=1
elif ! grep -Fq "${new_try_files}" "${nginx_conf}"; then
  echo "Nginx 路由配置与预期不符，已停止部署。" >&2
  exit 1
fi

if ! nginx -t; then
  if [[ "${config_changed}" == "1" ]]; then
    cp -a "${nginx_backup}" "${nginx_conf}"
  fi
  exit 1
fi

if [[ "${config_changed}" == "1" ]]; then
  systemctl reload nginx
fi
REMOTE_SCRIPT

rollback() {
  echo "线上检查失败，正在回滚……" >&2
  if [[ -n "${PREVIOUS_RELEASE}" ]]; then
    ssh "${REMOTE_HOST}" "ln -sfn '${PREVIOUS_RELEASE}' '${REMOTE_CURRENT}.rollback' && mv -Tf '${REMOTE_CURRENT}.rollback' '${REMOTE_CURRENT}'"
  elif ssh "${REMOTE_HOST}" "test -f '${NGINX_BACKUP}'"; then
    ssh "${REMOTE_HOST}" "cp -a '${NGINX_BACKUP}' '${NGINX_CONF}' && nginx -t && systemctl reload nginx"
  fi
}

echo "[5/5] 检查线上页面"
if ! curl --fail --silent --show-error --location --max-time 20 "${SITE_URL}/" >/dev/null; then
  rollback
  exit 1
fi

if ! curl --fail --silent --show-error --location --max-time 20 "${SITE_URL}/works" >/dev/null; then
  rollback
  exit 1
fi

if ! curl --fail --silent --show-error --location --max-time 20 "${SITE_URL}/works/raglab" >/dev/null; then
  rollback
  exit 1
fi

echo "部署完成：${SITE_URL}"
