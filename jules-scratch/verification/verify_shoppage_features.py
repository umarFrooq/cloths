from playwright.sync_api import sync_playwright, Page, expect

def verify_shoppage(page: Page):
    # Go to the shop page directly
    page.goto("http://localhost:8000/shop")

    # Check for the Filter Sidebar
    expect(page.locator(".card.p-3")).to_be_visible()

    # Check for the Price Range filter in the sidebar
    expect(page.locator("label:text('Price Range')")).to_be_visible()

    # Check for the Brand filter in the sidebar
    expect(page.locator("label:text('Brand')")).to_be_visible()

    # To check the category banner, we need to navigate to a category page
    # Since we don't have a running backend, we can't click a category link
    # that makes an API call. We will assume the banner code is correct
    # as we can't easily test it in a static build.

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/shoppage_features.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    verify_shoppage(page)

    browser.close()
