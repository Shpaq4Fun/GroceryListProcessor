from playwright.sync_api import sync_playwright
import json
import time

def verify_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Subscribe to console logs
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"Page error: {exc}"))

        # Define data for localStorage
        grocery_data = {
            "generalNotes": [],
            "categories": [
                {
                    "name": "Dairy",
                    "items": [
                        {"id": "item1", "name": "Milk", "checked": False, "quantity": "1 gal"},
                        {"id": "item2", "name": "Cheese", "checked": True}
                    ]
                }
            ]
        }

        # Go to app
        page.goto("http://localhost:3000/")

        # Inject data safely by passing object
        # Note: we need to stringify it because localStorage stores strings
        page.evaluate("""(data) => {
            console.log("Injecting data:", data);
            localStorage.setItem('smartGroceryList_v1', JSON.stringify(data));
        }""", grocery_data)

        print("Reloading page...")
        page.reload()

        # Wait for content
        try:
            # Try waiting for the app container first
            page.wait_for_selector("#root", timeout=5000)
            print("Root element found.")

            # Wait for either the empty state or the list state
            # Empty state has "Grocery List Processor"
            # List state has "Shopping List"

            # We expect "Shopping List"
            page.wait_for_selector("text=Shopping List", timeout=5000)
            print("Shopping List found.")

        except Exception as e:
            print(f"Timeout waiting for content: {e}")
            page.screenshot(path="verification/verify_timeout.png")
            print("Page content:")
            print(page.inner_text("body"))
            browser.close()
            return

        # Check for aria attributes
        dairy_button = page.locator("button").filter(has_text="Dairy").first
        if dairy_button.count() > 0:
            print(f"Dairy button found")
            print(f"Dairy button aria-expanded: {dairy_button.get_attribute('aria-expanded')}")

            # Check for chevron
            chevron = dairy_button.locator("svg.lucide-chevron-down")
            if chevron.count() > 0:
                 print(f"Chevron aria-hidden: {chevron.first.get_attribute('aria-hidden')}")
            else:
                 print("Chevron not found via css selector svg.lucide-chevron-down")
        else:
            print("Dairy button not found")

        # Focus on the first item
        item1 = page.locator("div[role='checkbox']").first
        if item1.count() > 0:
            item1.focus()

            # Take screenshot of focused item
            page.screenshot(path="verification/verify_accessibility.png")
            print("Screenshot taken.")

            # Test keyboard interaction
            # Press Space to toggle
            page.keyboard.press("Space")
            # Check if aria-checked changed (it was false)
            # wait a bit for react state update
            page.wait_for_timeout(500)

            checked_state = item1.get_attribute('aria-checked')
            print(f"Item 1 aria-checked after Space: {checked_state}")
        else:
            print("No checkbox items found")

        browser.close()

if __name__ == "__main__":
    verify_accessibility()
