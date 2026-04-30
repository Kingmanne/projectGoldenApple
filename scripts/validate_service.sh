#!/bin/bash
echo "🔍 Validating Sour Mango application..."
HOST=localhost
PORT=3000
URL="http://$HOST:$PORT"
MAX_RETRIES=10
RETRY_DELAY=3

for attempt in $(seq 1 "$MAX_RETRIES"); do
  echo "⏳ Attempt $attempt/$MAX_RETRIES: checking $URL"
  HTTP_CODE=$(curl -sS -o /tmp/validate_service_response.txt -w "%{http_code}" "$URL")

  if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ SUCCESS! Sour Mango is serving sweet success! HTTP $HTTP_CODE"
    rm -f /tmp/validate_service_response.txt
    exit 0
  fi

  echo "⚠️  Received HTTP $HTTP_CODE"
  if [ -s /tmp/validate_service_response.txt ]; then
    echo "Response body preview:"
    sed -n '1,20p' /tmp/validate_service_response.txt | sed 's/^/    /'
  fi

  if [ "$attempt" -lt "$MAX_RETRIES" ]; then
    sleep "$RETRY_DELAY"
  fi
done

echo "❌ FAILED! Sour Mango validation failed after $MAX_RETRIES attempts. Last HTTP response: $HTTP_CODE"
echo "PM2 status:"
pm2 status sour-mango || true
echo "Last 20 lines of pm2 logs:"
pm2 logs sour-mango --lines 20 --nostream || true
rm -f /tmp/validate_service_response.txt
exit 1