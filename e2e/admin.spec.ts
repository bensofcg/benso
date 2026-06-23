import { test, expect } from '@playwright/test';

const ADMIN_URL = 'http://localhost:3000/benso/admin';

test.describe('Admin Sidebar', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(ADMIN_URL);
    await page.fill('input[aria-label="Contraseña de administrador"]', 'benso-admin-2024');
    await page.click('text=Entrar');
    await page.waitForSelector('.app-sidebar', { timeout: 10000 });
    await page.waitForTimeout(800);
  });

  test('sidebar is 200px wide on desktop', async ({ page }) => {
    const width = await page.evaluate(
      () => document.querySelector('.app-sidebar')!.getBoundingClientRect().width
    );
    expect(Math.round(width)).toBe(200);
  });

  test('sidebar collapses to 64px and expands back', async ({ page }) => {
    // Initial: 200px
    let w = await page.evaluate(() => 
      document.querySelector('.app-sidebar')!.getBoundingClientRect().width
    );
    expect(Math.round(w)).toBe(200);

    // Collapse via native JS click (Playwright click has React event issues)
    await page.evaluate(() => {
      (document.querySelector('.sidebar-toggle') as HTMLButtonElement)?.click();
    });
    await page.waitForTimeout(500);

    w = await page.evaluate(() =>
      document.querySelector('.app-sidebar')!.getBoundingClientRect().width
    );
    expect(Math.round(w)).toBe(64);

    // Expand again
    await page.evaluate(() => {
      (document.querySelector('.sidebar-toggle') as HTMLButtonElement)?.click();
    });
    await page.waitForTimeout(500);

    w = await page.evaluate(() =>
      document.querySelector('.app-sidebar')!.getBoundingClientRect().width
    );
    expect(Math.round(w)).toBe(200);
  });

  test('sidebar has correct action-oriented icons', async ({ page }) => {
    // Sidebar is OPEN → should show PanelLeftClose (left arrow ←)
    const openSvg = await page.evaluate(() => {
      const svg = document.querySelector('.sidebar-toggle svg');
      return svg ? svg.innerHTML : '';
    });
    expect(openSvg).toContain('m16 15-3-3'); // PanelLeftClose path

    // Collapse sidebar
    await page.evaluate(() => {
      (document.querySelector('.sidebar-toggle') as HTMLButtonElement)?.click();
    });
    await page.waitForTimeout(500);

    // Sidebar is COLLAPSED → should show PanelLeftOpen (right arrow →)
    const closedSvg = await page.evaluate(() => {
      const svg = document.querySelector('.sidebar-toggle svg');
      return svg ? svg.innerHTML : '';
    });
    expect(closedSvg).toContain('m14 9 3 3'); // PanelLeftOpen path
  });

  test('footer buttons are visible on desktop', async ({ page }) => {
    const footerButtons = await page.evaluate(() => {
      const footer = document.querySelector('.sidebar-footer');
      if (!footer) return null;
      return Array.from(footer.querySelectorAll('button')).map(b => ({
        text: b.textContent?.trim() || '',
        html: b.innerHTML.substring(0, 100),
      }));
    });
    // Both buttons should exist (one may say "Cargando..." if data is loading)
    expect(footerButtons).not.toBeNull();
    expect(footerButtons!.length).toBe(2);
    // The "Salir" button is always present
    expect(footerButtons!.some(b => b.text.includes('Salir'))).toBe(true);
    // And there's a refresh/loading button (text depends on loading state)
    expect(footerButtons!.some(b => b.text.includes('Actualizar') || b.text.includes('Cargando'))).toBe(true);
  });

  test('navigation items navigate between tabs', async ({ page }) => {
    const tabs = ['Pedidos', 'Citas', 'Productos', 'Servicios', 'Eventos'];
    for (const tab of tabs) {
      await page.evaluate((t: string) => {
        const buttons = document.querySelectorAll('button.sidebar-item');
        for (const btn of buttons) {
          if (btn.textContent?.includes(t)) {
            (btn as HTMLButtonElement).click();
            break;
          }
        }
      }, tab);
      await page.waitForTimeout(300);
      await expect(page.locator('.admin-toolbar')).toBeVisible();
    }
  });
});

test.describe('Admin Responsive', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(ADMIN_URL);
    await page.fill('input[aria-label="Contraseña de administrador"]', 'benso-admin-2024');
    await page.click('text=Entrar');
    await page.waitForSelector('.app-sidebar', { timeout: 10000 });
    await page.waitForTimeout(600);
  });

  test('sidebar collapses automatically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const width = await page.evaluate(() =>
      document.querySelector('.app-sidebar')!.getBoundingClientRect().width
    );
    expect(Math.round(width)).toBe(64);
  });

  test('dashboard grid stacks to 1 column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const gridCols = await page.evaluate(() => {
      const grid = document.querySelector('.dashboard-grid');
      if (!grid) return null;
      return getComputedStyle(grid).gridTemplateColumns;
    });

    // If data loaded, should be 1 column on mobile
    if (gridCols) {
      const parts = gridCols.split(' ').filter(Boolean);
      expect(parts.length).toBe(1);
    }
  });

  test('popular bento visible on both mobile and desktop', async ({ page }) => {
    // Check on mobile: if bento exists, it should be visible
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const mobileDisplay = await page.evaluate(() => {
      const bento = document.querySelector('.popular-bento');
      if (!bento) return 'not-found';
      return getComputedStyle(bento).display;
    });
    
    if (mobileDisplay !== 'not-found') {
      expect(mobileDisplay).not.toBe('none');
    }

    // Back to desktop: should be visible (if data has popular items)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);

    const desktopDisplay = await page.evaluate(() => {
      const bento = document.querySelector('.popular-bento');
      if (!bento) return 'not-found';
      return getComputedStyle(bento).display;
    });

    if (desktopDisplay !== 'not-found') {
      // On desktop, bento should be in its normal grid display
      expect(desktopDisplay === 'grid' || desktopDisplay === 'not-found').toBe(true);
    }
  });

  test('sidebar expands as overlay on mobile when toggle clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Verify collapsed first
    let w = await page.evaluate(() =>
      document.querySelector('.app-sidebar')!.getBoundingClientRect().width
    );
    expect(Math.round(w)).toBe(64);

    // Expand via native JS click
    await page.evaluate(() => {
      (document.querySelector('.sidebar-toggle') as HTMLButtonElement)?.click();
    });
    await page.waitForTimeout(500);

    w = await page.evaluate(() =>
      document.querySelector('.app-sidebar')!.getBoundingClientRect().width
    );
    expect(Math.round(w)).toBe(200);

    // Backdrop should be visible (mobile overlay pattern)
    const hasBackdrop = await page.evaluate(() => !!document.querySelector('.sidebar-backdrop'));
    expect(hasBackdrop).toBe(true);
  });
});
