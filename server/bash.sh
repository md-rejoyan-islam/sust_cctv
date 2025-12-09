#!/bin/bash

# BASE_URL="http://localhost:5080/api/v1/public"

BASE_URL="https://cctv-api.neuronomous.net/api/v1/public"
IPS_URL="$BASE_URL/cameras-ips"
CAMERA_URL="$BASE_URL/cameras"

X_TOKEN="33333333333"
X_ID="5f9f1b9d6b9b9c001234abcd"
X_UNIQUE_NUMBER="33333333333"
SLEEP=3



while true; do
  echo "=== Running check at $(date) ==="

  # Get IP list from API
  RESPONSE=$(curl -s -H "x-token: $X_TOKEN=" -H "x-id: $X_ID" -H "x-unique-number: $X_UNIQUE_NUMBER" "$IPS_URL")

  # Console log the full response for debugging
  echo "Full response: $RESPONSE"

  # Extract IPs from payload.data
  IP_LIST=$(echo "$RESPONSE" | jq -r '.data[]')
  if [ -z "$IP_LIST" ]; then
    echo "❌ No IPs found in response."
    sleep $SLEEP
    continue
  fi

  echo "Received IPs:"
  echo "$IP_LIST"

    # Build JSON array of status results
  STATUS_ARRAY="["
  for ip in $IP_LIST; do
    echo "Checking $ip ..."
    curl -s --connect-timeout 1 "http://$ip" >/dev/null
    if [ $? -eq 0 ]; then
      STATUS=true
    else
      STATUS=false
    fi
    STATUS_ARRAY="$STATUS_ARRAY{\"ip\":\"$ip\",\"status\":$STATUS},"
  done
  STATUS_ARRAY="${STATUS_ARRAY%,}]"

  echo "Sending results: $STATUS_ARRAY"


  # Send status array to camera endpoint
  curl -s -X PATCH "$CAMERA_URL" \
    -H "Content-Type: application/json" \
    -H "x-unique-number: $X_UNIQUE_NUMBER" \
    -H "x-token: $X_TOKEN" \
    -H "x-id: $X_ID" \
    -d "$STATUS_ARRAY" || echo "❌ Failed to send results"

  echo "✅ Cycle complete. Waiting 5 minutes..."

  sleep $SLEEP
done
