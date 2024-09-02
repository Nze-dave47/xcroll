#!/bin/bash

URL_FILE="./data/links.txt"
OUTPUT_DIR="data"

mkdir -p "$OUTPUT_DIR"

if [[ ! -f "$URL_FILE" ]]; then
  echo "URL file '$URL_FILE' does not exist."
  exit 1
fi

while IFS= read -r url; do
  if [[ -n "$url" && ! "$url" =~ ^# ]]; then
    echo "Downloading: $url"
    yt-dlp -o "$OUTPUT_DIR/%(title)s.%(ext)s" "$url"
  fi
done <"$URL_FILE"

echo "Download complete."
