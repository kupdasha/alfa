#!/bin/zsh
# ПУБЛИКАЦИЯ: проверить код, отправить на GitHub (kupdasha/alfa), прогреть jsDelivr и обновить копию на воркере.
# Страницу отдает воркер kup-version (/alfa): HTML берет с GitHub по последнему коммиту main, файлы — с jsDelivr по его номеру
# (workers.dev в России часто душат, jsDelivr проходит — схема как у «Армии спорта»). Если не проходит jsDelivr,
# index.html сам переключается на копию файлов с воркера (public/alfa) — поэтому копию обновляем при каждой публикации.
cd "$(dirname "$0")" || exit 1
node --check al.js || exit 1
git add -A
git commit -q -m "${1:-Обновление}" || echo "нечего коммитить"
git push -q origin main || exit 1
sha=$(git rev-parse HEAD)
W=../kupdasha/tilda/version-worker
mkdir -p $W/public/alfa
rsync -a --delete --exclude '.git' --exclude 'publish.sh' --exclude 'CLAUDE.md' --exclude '.DS_Store' ./ $W/public/alfa/
(cd $W && npx wrangler deploy 2>&1 | grep -E "Deployed|Error" )
# по новому номеру jsDelivr первый раз собирает файлы несколько секунд — запрашиваем их заранее
{ echo al.css; echo al.js; ls fonts/*.woff2 fonts/*.woff; echo img/hud.json; ls img/*-s.webp img/logo/* img/*.mp4; } | xargs -P 8 -I{} curl -s -o /dev/null --max-time 60 "https://cdn.jsdelivr.net/gh/kupdasha/alfa@$sha/{}"
echo "опубликовано: ${sha:0:7} — https://kup-version.kupdaria26.workers.dev/alfa/"
