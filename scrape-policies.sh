#!/bin/bash

# Script to scrape People's Party policy URLs
BASE_URL="https://election69.peoplesparty.or.th"
OUTPUT_FILE="policy-urls.txt"
TEMP_DIR="temp_scrape"

mkdir -p "$TEMP_DIR"
> "$OUTPUT_FILE"

echo "Starting to scrape policy URLs..."

for CATEGORY in A B C D; do
  URL="${BASE_URL}/policy/1/${CATEGORY}"
  echo "Fetching: $URL"
  
  # Download the page
  curl -s "$URL" > "${TEMP_DIR}/category_${CATEGORY}.html"
  
  # Extract policy links using grep
  grep -oP 'href="(/policy/\d+/[A-Z]-[^"]+)"' "${TEMP_DIR}/category_${CATEGORY}.html" | \
    sed 's/href="//; s/"$//' | \
    sed "s|^|${BASE_URL}|" >> "${TEMP_DIR}/all_urls.txt"
done

# Sort and remove duplicates
sort -u "${TEMP_DIR}/all_urls.txt" > "$OUTPUT_FILE"

# Count URLs
URL_COUNT=$(wc -l < "$OUTPUT_FILE")
echo ""
echo "Total unique policy URLs found: $URL_COUNT"
echo "✅ URLs saved to $OUTPUT_FILE"

# Clean up temp files
rm -rf "$TEMP_DIR"

# Show first 10 URLs as preview
echo ""
echo "Preview (first 10 URLs):"
head -10 "$OUTPUT_FILE"
