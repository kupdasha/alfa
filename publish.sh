#!/bin/zsh
# ПУБЛИКАЦИЯ: проверить код и выложить страницу на Cloudflare — воркер kup-version отдает ее по адресу /alfa/
# (файлы лежат в его статике: ../kupdasha/tilda/version-worker/public/alfa, в git сайта не идут).
cd "$(dirname "$0")" || exit 1
node --check al.js || exit 1
W=../kupdasha/tilda/version-worker
mkdir -p $W/public/alfa
rsync -a --delete --exclude '.git' --exclude 'publish.sh' --exclude 'CLAUDE.md' --exclude '.DS_Store' ./ $W/public/alfa/
git add -A && git commit -q -m "${1:-Обновление}" 2>/dev/null
(cd $W && npx wrangler deploy) || exit 1
echo "опубликовано: https://kup-version.kupdaria26.workers.dev/alfa/"
