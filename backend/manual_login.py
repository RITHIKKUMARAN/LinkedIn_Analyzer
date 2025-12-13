import asyncio
import os
import json
from playwright.async_api import async_playwright

# Config
OUTPUT_FILE = "linkedin_cookies.json"

async def main():
    print("="*60)
    print("LINKEDIN MANUAL LOGIN HELPER")
    print("="*60)
    print("This script will open a browser window.")
    print("1. Log in to LinkedIn manually.")
    print("2. Wait for your feed to load.")
    print("3. The script will automatically save your cookies and close.")
    print("="*60)

    async with async_playwright() as p:
        # Launch visible browser
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        print("\nLaunching browser...")
        await page.goto("https://www.linkedin.com/login")

        print("Waiting for you to log in...")
        
        # specific check for feed to ensure login complete
        try:
            await page.wait_for_url("**/feed/**", timeout=120000) # 2 mins to login
            print("Login detected!")
            
            # Allow a moment for all cookies to set
            await asyncio.sleep(3)
            
            cookies = await context.cookies()
            
            with open(OUTPUT_FILE, "w") as f:
                json.dump(cookies, f, indent=2)
                
            print(f"\nSUCCESS! Cookies saved to {OUTPUT_FILE}")
            print("You can now restart your Docker container.")
            
        except Exception as e:
            print(f"\nTimeout or Error: {e}")
            print("Did you log in successfully?")
            
        finally:
            await browser.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nCancelled.")
