#!/usr/bin/env sh
set -eu

# Copy the API endpoint for this verified site from Baidu Search Resource Platform.
: "${BAIDU_PUSH_URL:?Set BAIDU_PUSH_URL to the API submission URL for blog.ywenrou.cn}"
url_file="${1:-urls.txt}"

if [ ! -s "$url_file" ]; then
  echo "Provide a non-empty URL list (one URL per line): $url_file" >&2
  exit 1
fi

if awk 'NF && $0 !~ /^https:\/\/blog\.ywenrou\.cn\// { invalid = 1 } END { exit !invalid }' "$url_file"; then
  echo 'The URL list contains addresses outside https://blog.ywenrou.cn/.' >&2
  exit 1
fi

curl --fail-with-body --silent --show-error \
  -H 'Content-Type: text/plain' \
  --data-binary "@$url_file" \
  "$BAIDU_PUSH_URL"
