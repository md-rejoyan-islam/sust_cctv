#!/usr/bin/env python3

import time
from datetime import datetime

import requests

BASE_URL = "https://cctv-api.neuronomous.net/api/v1/public"
IPS_URL = f"{BASE_URL}/cameras-ips"
CAMERA_URL = f"{BASE_URL}/cameras"

X_TOKEN = "33333333333"
X_ID = "5f9f1b9d6b9b9c001234abcd"
X_UNIQUE_NUMBER = "33333333333"
SLEEP = 3  # seconds

HEADERS = {
    "x-token": X_TOKEN,
    "x-id": X_ID,
    "x-unique-number": X_UNIQUE_NUMBER,
    "Content-Type": "application/json"
}


def get_ip_list():
    try:
        response = requests.get(IPS_URL, headers=HEADERS, timeout=5)
        response.raise_for_status()
        data = response.json()
        return data.get("data", [])
    except Exception as e:
        print(f"❌ Failed to fetch IP list: {e}")
        return []


def check_ip(ip):
    try:
        requests.get(f"http://{ip}", timeout=1)
        return True
    except:
        return False


def send_status(status_array):
    try:
        response = requests.patch(
            CAMERA_URL, json=status_array, headers=HEADERS)
        response.raise_for_status()
        print("✅ Results sent successfully")
    except Exception as e:
        print(f"❌ Failed to send results: {e}")


def main():
    while True:
        print(f"=== Running check at {datetime.now()} ===")

        ip_list = get_ip_list()
        if not ip_list:
            print("❌ No IPs found in response.")
            time.sleep(SLEEP)
            continue

        print("Received IPs:")
        print(ip_list)

        status_array = [{"ip": ip, "status": check_ip(ip)} for ip in ip_list]
        print("Sending results:", status_array)

        send_status(status_array)

        print("✅ Cycle complete. Waiting 3 seconds...")
        time.sleep(SLEEP)


if __name__ == "__main__":
    main()
