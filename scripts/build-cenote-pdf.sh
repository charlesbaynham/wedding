#!/usr/bin/env bash
# Prints the built cenote-directions-print page to _site/cenote-directions.pdf.
# Run after `jekyll build`. CHROME defaults to the runner's google-chrome.
set -euo pipefail
CHROME="${CHROME:-google-chrome}"
BASEURL=$(sed -n 's/^baseurl:[[:space:]]*"\(.*\)"/\1/p' _config.yml)

# Serve _site under its baseurl (/pr/N on previews) so absolute links resolve.
DIR="$PWD/_site"
if [ -n "$BASEURL" ]; then
  DIR=$(mktemp -d)
  mkdir -p "$DIR$(dirname "$BASEURL")"
  ln -s "$PWD/_site" "$DIR$BASEURL"
fi
python3 -m http.server 8471 --bind 127.0.0.1 --directory "$DIR" >/dev/null 2>&1 &
trap 'kill $!' EXIT
sleep 1

"$CHROME" --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=15000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="$PWD/_site/cenote-directions.pdf" \
  "http://127.0.0.1:8471${BASEURL}/cenote-directions-print/"
test -s _site/cenote-directions.pdf
