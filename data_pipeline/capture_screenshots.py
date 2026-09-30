import subprocess
import time
import os

routes = [
    ("landing.png", "http://localhost:4173/"),
    ("dashboard_3d.png", "http://localhost:4173/dashboard"),
    ("simulation_compare.png", "http://localhost:4173/simulation"),
    ("analytics.png", "http://localhost:4173/analytics"),
    ("reports.png", "http://localhost:4173/reports"),
    ("assistant.png", "http://localhost:4173/assistant"),
    ("agents.png", "http://localhost:4173/agents"),
]

os.makedirs("docs/screenshots", exist_ok=True)
chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

for filename, url in routes:
    out_path = os.path.abspath(os.path.join("docs/screenshots", filename))
    print(f"Capturing {url} -> {out_path}...")
    cmd = [
        chrome_bin,
        "--headless",
        "--disable-gpu",
        "--enable-webgl",
        "--ignore-gpu-blocklist",
        "--window-size=1440,900",
        "--user-data-dir=/tmp/chrome_citytwin_profile",
        f"--screenshot={out_path}",
        url
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=12)
        if os.path.exists(out_path):
            print(f"  ✓ Saved {filename} ({os.path.getsize(out_path)} bytes)")
    except Exception as e:
        print(f"  ✗ Error capturing {filename}: {e}")

print("Screenshot capture complete.")
