from playwright.sync_api import sync_playwright, Page, expect

def verify_customer_site(page: Page):
    page.goto("http://localhost:3000")

    # Click the language switcher
    page.click("#language-switcher-toggle")

    # Click the Urdu language option
    page.click("a.dropdown-item:text('اردو')")

    # Verify that the text has changed to Urdu
    expect(page.locator("h1:text('جدید ترین ڈیزائن')")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/customer_site_urdu.png")

def verify_admin_panel(page: Page):
    page.goto("http://localhost:3001")

    # Click the Urdu language button
    page.click("button:text('اردو (Urdu)')")

    # Verify that the text has changed to Urdu
    expect(page.locator("h1:text('خوش آمدید، ایڈمن!')")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/admin_panel_urdu.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    verify_customer_site(page)
    verify_admin_panel(page)

    browser.close()
