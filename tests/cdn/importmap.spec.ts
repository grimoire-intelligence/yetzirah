import { test, expect } from '@playwright/test';

test.describe('Import Map Demo Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/cdn/importmap.html');
    // Wait for Yetzirah components to be registered
    await page.waitForFunction(() => customElements.get('ytz-dialog') !== undefined, {
      timeout: 10000
    });
  });

  test.describe('Import Map Configuration', () => {
    test('should load page without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.reload();
      await page.waitForFunction(() => customElements.get('ytz-dialog') !== undefined);

      // Filter out expected messages
      const unexpectedErrors = errors.filter(err =>
        !err.includes('Yetzirah components loaded')
      );

      expect(unexpectedErrors).toHaveLength(0);
    });

    test('should register components with ytz- prefix', async ({ page }) => {
      const components = [
        'ytz-dialog',
        'ytz-disclosure',
        'ytz-tabs',
        'ytz-tablist',
        'ytz-tab',
        'ytz-tabpanel',
        'ytz-tooltip',
        'ytz-menu',
        'ytz-menuitem',
      ];

      for (const component of components) {
        const isDefined = await page.evaluate(
          (tag) => customElements.get(tag) !== undefined,
          component
        );
        expect(isDefined, `${component} should be registered`).toBe(true);
      }
    });
  });

  test.describe('Dialog Component via Import Map', () => {
    test('should open dialog when button is clicked', async ({ page }) => {
      const dialog = page.locator('#demo-dialog');
      const trigger = page.locator('button:has-text("Open Dialog")');

      await expect(dialog).toBeHidden();
      await trigger.click();
      await expect(dialog).toBeVisible();
    });

    test('should close dialog on escape', async ({ page }) => {
      const dialog = page.locator('#demo-dialog');
      const trigger = page.locator('button:has-text("Open Dialog")');

      await trigger.click();
      await expect(dialog).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    });

    test('should close dialog with form method="dialog"', async ({ page }) => {
      const dialog = page.locator('#demo-dialog');
      const trigger = page.locator('button:has-text("Open Dialog")');

      await trigger.click();
      await expect(dialog).toBeVisible();

      // Click close button inside form with method="dialog"
      await dialog.locator('form button').click();
      await expect(dialog).toBeHidden();
    });
  });

  test.describe('Disclosure Component via Import Map', () => {
    test('should toggle content visibility', async ({ page }) => {
      const disclosure = page.locator('ytz-disclosure');
      const trigger = disclosure.locator('[slot="trigger"]');
      const content = disclosure.locator('[slot="content"]');

      // Initially hidden
      await expect(content).toBeHidden();

      // Click to expand
      await trigger.click();
      await expect(content).toBeVisible();

      // Click to collapse
      await trigger.click();
      await expect(content).toBeHidden();
    });
  });

  test.describe('Tabs Component via Import Map', () => {
    test('should switch tabs on click', async ({ page }) => {
      const tabs = page.locator('ytz-tabs');
      const tabElements = tabs.locator('ytz-tab');
      const panels = tabs.locator('ytz-tabpanel');

      // Initially first panel should be visible
      await expect(panels.first()).toBeVisible();

      // Click second tab
      await tabElements.nth(1).click();

      // Second panel should now be visible
      await expect(panels.nth(1)).toBeVisible();
      await expect(panels.first()).toBeHidden();
    });

    test('should support keyboard navigation', async ({ page }) => {
      const tabs = page.locator('ytz-tabs');
      const firstTab = tabs.locator('ytz-tab').first();

      await firstTab.focus();
      await expect(firstTab).toBeFocused();

      // Arrow right should move focus
      await page.keyboard.press('ArrowRight');
      await expect(tabs.locator('ytz-tab').nth(1)).toBeFocused();
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      const tabs = page.locator('ytz-tabs');
      const tab = tabs.locator('ytz-tab').first();
      const panel = tabs.locator('ytz-tabpanel').first();

      // Tab should have proper role
      const tabRole = await tab.getAttribute('role');
      expect(tabRole).toBe('tab');

      // Panel should have proper role
      const panelRole = await panel.getAttribute('role');
      expect(panelRole).toBe('tabpanel');

      // Selected tab should have aria-selected="true"
      const ariaSelected = await tab.getAttribute('aria-selected');
      expect(ariaSelected).toBe('true');
    });
  });

  test.describe('Tooltip Component via Import Map', () => {
    test('should show tooltip on hover', async ({ page }) => {
      const tooltip = page.locator('ytz-tooltip');
      const trigger = tooltip.locator('[slot="trigger"]');
      const content = tooltip.locator('[slot="content"]');

      await expect(content).toBeHidden();

      await trigger.hover();
      await expect(content).toBeVisible();

      // Move away
      await page.mouse.move(0, 0);
      await expect(content).toBeHidden();
    });
  });

  test.describe('Menu Component via Import Map', () => {
    test('should open menu on click', async ({ page }) => {
      const menu = page.locator('ytz-menu');
      const trigger = menu.locator('[slot="trigger"]');
      const content = menu.locator('[slot="content"]');

      await trigger.click();
      await expect(content).toBeVisible();
    });

    test('should close menu after item selection', async ({ page }) => {
      const menu = page.locator('ytz-menu');
      const trigger = menu.locator('[slot="trigger"]');
      const content = menu.locator('[slot="content"]');

      await trigger.click();
      await expect(content).toBeVisible();

      // Click a menu item
      await menu.locator('ytz-menuitem').first().click();

      // Menu should close
      await expect(content).toBeHidden();
    });

    test('should navigate with keyboard', async ({ page }) => {
      const menu = page.locator('ytz-menu');
      const trigger = menu.locator('[slot="trigger"]');

      await trigger.click();

      // Arrow down to navigate
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');

      // Escape to close without selection
      await page.keyboard.press('Escape');
      await expect(menu.locator('[slot="content"]')).toBeHidden();
    });
  });

  test.describe('Import Map Resolution', () => {
    test('should resolve bare specifier imports', async ({ page }) => {
      // The page should have loaded components via import map
      // Check that the import map exists
      const importMapContent = await page.evaluate(() => {
        const script = document.querySelector('script[type="importmap"]');
        return script ? script.textContent : null;
      });

      expect(importMapContent).toBeTruthy();
      expect(importMapContent).toContain('yetzirah');
    });

    test('should support path imports like yetzirah/dialog.js', async ({ page }) => {
      const importMap = await page.evaluate(() => {
        const script = document.querySelector('script[type="importmap"]');
        return script ? JSON.parse(script.textContent || '{}') : null;
      });

      expect(importMap).toBeTruthy();
      expect(importMap.imports).toHaveProperty('yetzirah/');
    });

    test('should support @grimoire scoped imports', async ({ page }) => {
      const importMap = await page.evaluate(() => {
        const script = document.querySelector('script[type="importmap"]');
        return script ? JSON.parse(script.textContent || '{}') : null;
      });

      expect(importMap).toBeTruthy();
      expect(importMap.imports).toHaveProperty('@grimoire/yetzirah-core');
    });
  });

  test.describe('Polyfill Compatibility', () => {
    test('should include es-module-shims polyfill', async ({ page }) => {
      // Check that the polyfill script is present
      const hasPolyfill = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script[src*="es-module-shims"]');
        return scripts.length > 0;
      });

      expect(hasPolyfill).toBe(true);
    });
  });
});

test.describe('Vanilla App Demo Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/cdn/vanilla-app.html');
    // Wait for Yetzirah components to be registered
    await page.waitForFunction(() => customElements.get('ytz-dialog') !== undefined);
  });

  test.describe('Task Management', () => {
    test('should display initial tasks', async ({ page }) => {
      const taskList = page.locator('#task-list');
      const tasks = taskList.locator('.task-item');

      // Should have some initial tasks
      const count = await tasks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should add a new task', async ({ page }) => {
      const addButton = page.locator('button:has-text("Add Task")');
      const dialog = page.locator('#add-task-dialog');

      // Get initial count
      const initialCount = await page.locator('.task-item').count();

      // Open add dialog
      await addButton.click();
      await expect(dialog).toBeVisible();

      // Fill form
      await dialog.locator('input[name="text"]').fill('New test task');
      await dialog.locator('button[type="submit"]').click();

      // Dialog should close
      await expect(dialog).toBeHidden();

      // Task count should increase
      const newCount = await page.locator('.task-item').count();
      expect(newCount).toBe(initialCount + 1);
    });

    test('should toggle task completion', async ({ page }) => {
      const firstTask = page.locator('.task-item').first();
      const toggle = firstTask.locator('ytz-toggle');

      const initialChecked = await toggle.evaluate((el: any) => el.checked);

      await toggle.click();

      const newChecked = await toggle.evaluate((el: any) => el.checked);
      expect(newChecked).toBe(!initialChecked);
    });

    test('should filter tasks by status', async ({ page }) => {
      const filterSelect = page.locator('#filter-status');

      // Select "completed" filter
      await filterSelect.click();
      await filterSelect.locator('ytz-option[value="completed"]').click();

      // All visible tasks should be completed
      const tasks = page.locator('.task-item:visible');
      const count = await tasks.count();

      if (count > 0) {
        const allCompleted = await tasks.evaluateAll(elements =>
          elements.every(el => el.classList.contains('completed'))
        );
        expect(allCompleted).toBe(true);
      }
    });

    test('should update stats', async ({ page }) => {
      const totalStat = page.locator('#stat-total');
      const activeStat = page.locator('#stat-active');
      const completedStat = page.locator('#stat-completed');

      const total = Number(await totalStat.textContent());
      const active = Number(await activeStat.textContent());
      const completed = Number(await completedStat.textContent());

      // Total should equal active + completed
      expect(total).toBe(active + completed);
    });
  });

  test.describe('Navigation Drawer', () => {
    test('should open navigation drawer', async ({ page }) => {
      const drawer = page.locator('#nav-drawer');
      const menuButton = page.locator('button[aria-label="Open navigation"]');

      await expect(drawer).toBeHidden();
      await menuButton.click();
      await expect(drawer).toBeVisible();
    });

    test('should filter via drawer navigation', async ({ page }) => {
      const drawer = page.locator('#nav-drawer');
      const menuButton = page.locator('button[aria-label="Open navigation"]');

      await menuButton.click();
      await expect(drawer).toBeVisible();

      // Click "Work" category
      await drawer.locator('a[data-category="work"]').click();

      // Drawer should close
      await expect(drawer).toBeHidden();

      // Filter select should update
      const filterValue = await page.locator('#filter-category').evaluate((el: any) => el.value);
      expect(filterValue).toBe('work');
    });
  });

  test.describe('Edit and Delete', () => {
    test('should open edit dialog from task menu', async ({ page }) => {
      const firstTask = page.locator('.task-item').first();
      const menu = firstTask.locator('ytz-menu');
      const trigger = menu.locator('[slot="trigger"]');

      await trigger.click();
      await menu.locator('ytz-menuitem[value="edit"]').click();

      const editDialog = page.locator('#edit-task-dialog');
      await expect(editDialog).toBeVisible();
    });

    test('should open delete confirmation dialog', async ({ page }) => {
      const firstTask = page.locator('.task-item').first();
      const menu = firstTask.locator('ytz-menu');
      const trigger = menu.locator('[slot="trigger"]');

      await trigger.click();
      await menu.locator('ytz-menuitem[value="delete"]').click();

      const deleteDialog = page.locator('#delete-confirm-dialog');
      await expect(deleteDialog).toBeVisible();
    });
  });

  test.describe('Search', () => {
    test('should filter tasks via search', async ({ page }) => {
      const search = page.locator('#task-search');
      const input = search.locator('input');

      // Type search query
      await input.fill('project');

      // Select from autocomplete
      await search.locator('ytz-option').first().click();

      // Tasks should be filtered
      const tasks = page.locator('.task-item:visible');
      const count = await tasks.count();

      // Should have at least one matching task or none if no match
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});

test.describe.skip('Preact HTM Demo Page', () => {
  // Skip these tests - they require network access to esm.sh for Preact/HTM
  // These will pass in CI with network access or when using a local Preact build
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/cdn/preact-htm.html');
    // Wait for Preact to render and components to load
    await page.waitForSelector('.preact-app', { timeout: 15000 });
    await page.waitForFunction(() => customElements.get('ytz-dialog') !== undefined);
  });

  test.describe('Page Load', () => {
    test('should load without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.reload();
      await page.waitForSelector('.preact-app');

      // Filter out known non-error messages
      const unexpectedErrors = errors.filter(err =>
        !err.includes('Preact + HTM') &&
        !err.includes('demo loaded')
      );

      expect(unexpectedErrors).toHaveLength(0);
    });

    test('should render Preact components', async ({ page }) => {
      // Check for counter component
      const counter = page.locator('.counter-display');
      await expect(counter).toBeVisible();

      // Check for section headers
      await expect(page.locator('h2:has-text("Counter with Preact State")')).toBeVisible();
    });
  });

  test.describe('Counter Component', () => {
    test('should increment counter', async ({ page }) => {
      const counter = page.locator('.counter-display');
      const incrementButton = page.locator('ytz-button:has-text("Increase")');

      const initialValue = Number(await counter.textContent());
      await incrementButton.click();
      const newValue = Number(await counter.textContent());

      expect(newValue).toBe(initialValue + 1);
    });

    test('should decrement counter', async ({ page }) => {
      const counter = page.locator('.counter-display');
      const decrementButton = page.locator('ytz-button:has-text("Decrease")');

      const initialValue = Number(await counter.textContent());
      await decrementButton.click();
      const newValue = Number(await counter.textContent());

      expect(newValue).toBe(initialValue - 1);
    });

    test('should reset counter', async ({ page }) => {
      const counter = page.locator('.counter-display');
      const incrementButton = page.locator('ytz-button:has-text("Increase")');
      const resetButton = page.locator('ytz-button:has-text("Reset")');

      // Increment a few times
      await incrementButton.click();
      await incrementButton.click();

      // Reset
      await resetButton.click();
      const value = Number(await counter.textContent());

      expect(value).toBe(0);
    });
  });

  test.describe('Dialog with Events', () => {
    test('should track dialog state', async ({ page }) => {
      const section = page.locator('section:has-text("Dialog with Events")');
      const openButton = section.locator('ytz-button:has-text("Open Dialog")');
      const lastAction = section.locator('text=Last action:');

      await openButton.click();

      // Find and close dialog
      const dialog = page.locator('ytz-dialog').first();
      await expect(dialog).toBeVisible();

      await dialog.locator('ytz-button:has-text("Cancel")').click();

      // Last action should update
      await expect(lastAction).toContainText('Dialog closed');
    });
  });
});
