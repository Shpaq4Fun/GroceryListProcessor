from playwright.sync_api import sync_playwright
import json
import time

def verify_icons():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Define data for localStorage
        grocery_data = {
            "generalNotes": ["Don't forget the milk!", "Check for discounts."],
            "categories": [
                {
                    "name": "Dairy",
                    "items": [
                        {"id": "item1", "name": "Milk", "checked": True, "quantity": "1 gal"},
                        {"id": "item2", "name": "Cheese", "checked": False}
                    ]
                }
            ]
        }

        grocery_data_str = json.dumps(grocery_data)

        # Go to app
        page.goto("http://localhost:3000/")

        # Inject data safely
        page.evaluate("(data) => localStorage.setItem('smartGroceryList_v1', data)", grocery_data_str)

        # Reload to pick up data
        page.reload()

        # Wait for content
        try:
            page.wait_for_selector("text=Shopping List", timeout=5000)
            # Take screenshot of the list view
            page.screenshot(path="verification/verification_list.png")
            print("List view screenshot taken.")
        except Exception as e:
            print(f"Failed to load list view: {e}")
            page.screenshot(path="verification/verification_list_failed.png")

        # Now test error state
        # Click "New List"
        try:
            if page.locator("text=New List").is_visible():
                 page.get_by_text("New List").click()
            else:
                 print("New List button not found, maybe failing earlier.")

            # Enter text
            page.fill("textarea", "Milk, Cheese, Bread")

            # Click "Organize My List"
            page.get_by_text("Organize My List").click()

            # Wait for error (it should appear quickly since API key is likely missing/invalid)
            # The error message container has "Error" text and the icon
            try:
                page.wait_for_selector("text=Error", timeout=10000)
                page.screenshot(path="verification/verification_error.png")
                print("Error view screenshot taken.")
            except Exception as e:
                 print(f"Error element not found: {e}")
                 page.screenshot(path="verification/verification_error_failed.png")

        except Exception as e:
            print(f"Error did not appear in time or something else happened: {e}")
            page.screenshot(path="verification/verification_failed_general.png")

        browser.close()

if __name__ == "__main__":
    verify_icons()
