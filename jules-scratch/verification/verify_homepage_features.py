from playwright.sync_api import sync_playwright, Page, expect

def verify_homepage(page: Page):
    page.goto("http://localhost:8000")

    # Check for Hero Section
    expect(page.locator(".hero-section")).to_be_visible()

    # Check for Deals of the Day (Special Offer Banner)
    expect(page.locator(".special-offer-banner")).to_be_visible()

    # Check for Wishlist icon in Navbar
    expect(page.locator(".wishlist-link")).to_be_visible()

    # Check for Category dropdown in Navbar
    expect(page.locator("#shop-dropdown")).to_be_visible()

    # Check for new footer links
    expect(page.locator("a[href='/shipping-policy']")).to_be_visible()
    expect(page.locator("a[href='/returns-policy']")).to_be_visible()

    # Check for social media icons in footer
    expect(page.locator("a[href='https://instagram.com']")).to_be_visible()
    expect(page.locator("a[href='https://tiktok.com']")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/homepage_features.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    verify_homepage(page)

    browser.close()
