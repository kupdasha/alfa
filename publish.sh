#!/bin/zsh
# ПУБЛИКАЦИЯ: проверить код, отправить на GitHub (kupdasha/alfa) и прогреть новую версию на jsDelivr.
# Страницу отдает воркер kup-version (/alfa): HTML берет с GitHub по последнему коммиту main, файлы — с jsDelivr по его номеру.
# Так файлы не идут через workers.dev, который в России часто не открывается без VPN (схема как у «Армии спорта»).
cd "$(dirname "$0")" || exit 1
node --check al.js || exit 1
git add -A
git commit -q -m "${1:-Обновление}" || echo "нечего коммитить"
git push -q origin main || exit 1
sha=$(git rev-parse HEAD)
# по новому номеру jsDelivr первый раз собирает файлы несколько секунд — запрашиваем их заранее
{ echo al.css; echo al.js; ls fonts/*.woff2 fonts/*.woff; echo img/hud.json; ls img/*-s.webp img/logo/* img/*.mp4; } | xargs -P 8 -I{} curl -s -o /dev/null --max-time 60 "https://cdn.jsdelivr.net/gh/kupdasha/alfa@$sha/{}"
echo "опубликовано: ${sha:0:7} — https://kup-version.kupdaria26.workers.dev/alfa/"
