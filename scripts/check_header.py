"""Check what the header actually looks like on the homepage."""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto("http://localhost:3000")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)
    page.screenshot(path="C:\\Users\\USUARIO\\benso-nextjs\\tmp\\homepage-hero.png", full_page=True)
    
    # Check the header element
    header_bg = page.evaluate("""
        () => {
            const h = document.querySelector('header:not(.admin-header)');
            if (!h) return 'no header found';
            const bg = getComputedStyle(h).background;
            const classes = h.className;
            const top = getComputedStyle(h).top;
            const pos = getComputedStyle(h).position;
            return {background: bg, classes, top, position: pos};
        }
    """)
    print("HEADER:", header_bg)
    
    # Check nav-wrapper
    nw = page.evaluate("""
        () => {
            const nw = document.querySelector('.nav-wrapper');
            if (!nw) return 'no nav-wrapper';
            return {
                bg: getComputedStyle(nw).background,
                height: getComputedStyle(nw).height,
                zIndex: getComputedStyle(nw).zIndex,
            };
        }
    """)
    print("NAV-WRAPPER:", nw)

    # Check body bg
    body_bg = page.evaluate("() => getComputedStyle(document.body).background")
    print("BODY BG:", body_bg)

    # Check main-content
    mc = page.evaluate("""
        () => {
            const mc = document.getElementById('main-content');
            if (!mc) return 'no main-content';
            return {
                paddingTop: getComputedStyle(mc).paddingTop,
                bg: getComputedStyle(mc).background,
                marginTop: getComputedStyle(mc).marginTop,
            };
        }
    """)
    print("MAIN-CONTENT:", mc)

    # Check hero section
    hero = page.evaluate("""
        () => {
            const h = document.querySelector('.hero');
            if (!h) return 'no hero';
            return {
                bg: getComputedStyle(h).background,
                paddingTop: getComputedStyle(h).paddingTop,
                marginTop: getComputedStyle(h).marginTop,
                minHeight: getComputedStyle(h).minHeight,
            };
        }
    """)
    print("HERO:", hero)

    # Check root variables
    root_vars = page.evaluate("""
        () => {
            const r = document.documentElement;
            return {
                navbarHeight: getComputedStyle(r).getPropertyValue('--navbar-height').trim(),
                bannerHeight: getComputedStyle(r).getPropertyValue('--banner-height').trim(),
                primary: getComputedStyle(r).getPropertyValue('--primary').trim(),
            };
        }
    """)
    print("ROOT VARS:", root_vars)

    # Check what's behind the header
    behind_header = page.evaluate("""
        () => {
            const h = document.querySelector('header:not(.admin-header)');
            if (!h) return 'no header';
            const rect = h.getBoundingClientRect();
            // Get the element at the center of the header area (from viewport POV)
            // The header is at rect.top to rect.bottom
            const midX = rect.left + rect.width / 2;
            const midY = rect.top + rect.height / 2;
            const elem = document.elementFromPoint(midX, midY);
            if (!elem) return 'no element found';
            const bg = getComputedStyle(elem).background;
            return {
                tag: elem.tagName,
                id: elem.id,
                class: elem.className,
                bg: bg,
                rect: {top: rect.top, bottom: rect.bottom, height: rect.height},
                midY: midY,
            };
        }
    """)
    print("BEHIND HEADER:", behind_header)

    browser.close()
