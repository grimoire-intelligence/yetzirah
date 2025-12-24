import { test, expect } from '@playwright/test';

test.describe('CDN Demo Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/cdn/index.html');
    // Wait for Yetzirah components to be registered
    await page.waitForFunction(() => customElements.get('ytz-dialog') !== undefined);
  });

  test.describe('Page Load', () => {
    test('should load without console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.reload();
      await page.waitForFunction(() => customElements.get('ytz-dialog') !== undefined);

      // Filter out expected messages (like component registration logs)
      const unexpectedErrors = errors.filter(err =>
        !err.includes('Yetzirah components loaded')
      );

      expect(unexpectedErrors).toHaveLength(0);
    });

    test('should register all Tier 1 components', async ({ page }) => {
      const components = [
        'ytz-button',
        'ytz-dialog',
        'ytz-drawer',
        'ytz-tabs',
        'ytz-tab',
        'ytz-tabpanel',
        'ytz-accordion',
        'ytz-accordion-item',
        'ytz-disclosure',
        'ytz-tooltip',
        'ytz-popover',
        'ytz-menu',
        'ytz-menuitem',
        'ytz-autocomplete',
        'ytz-select',
        'ytz-listbox',
        'ytz-option',
      ];

      for (const component of components) {
        const isDefined = await page.evaluate(
          (tag) => customElements.get(tag) !== undefined,
          component
        );
        expect(isDefined, `${component} should be registered`).toBe(true);
      }
    });

    test('should register Tier 2 components', async ({ page }) => {
      const components = [
        'ytz-toggle',
        'ytz-chip',
        'ytz-icon-button',
        'ytz-slider',
        'ytz-theme-toggle',
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

  test.describe('Button Component', () => {
    test('should render as button element', async ({ page }) => {
      const button = page.locator('ytz-button').first();
      await expect(button).toBeVisible();

      // Check that it's focusable
      await button.focus();
      await expect(button).toBeFocused();
    });

    test('should handle click events', async ({ page }) => {
      const button = page.locator('ytz-button').first();
      let clicked = false;

      await page.exposeFunction('testButtonClick', () => {
        clicked = true;
      });

      await button.evaluate(el => {
        el.addEventListener('click', () => (window as any).testButtonClick());
      });

      await button.click();
      expect(clicked).toBe(true);
    });

    test('should support disabled state', async ({ page }) => {
      const disabledButton = page.locator('ytz-button[disabled]');
      await expect(disabledButton).toBeVisible();
      await expect(disabledButton).toBeDisabled();
    });
  });

  test.describe('Dialog Component', () => {
    test('should open when showModal is called', async ({ page }) => {
      const dialog = page.locator('#demo-dialog');
      const trigger = page.locator('button:has-text("Open Dialog")').first();

      await expect(dialog).toBeHidden();
      await trigger.click();
      await expect(dialog).toBeVisible();
    });

    test('should close on escape key', async ({ page }) => {
      const dialog = page.locator('#demo-dialog');
      const trigger = page.locator('button:has-text("Open Dialog")').first();

      await trigger.click();
      await expect(dialog).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    });

    test('should close when close button is clicked', async ({ page }) => {
      const dialog = page.locator('#demo-dialog');
      const trigger = page.locator('button:has-text("Open Dialog")').first();

      await trigger.click();
      await expect(dialog).toBeVisible();

      await dialog.locator('button:has-text("Close")').click();
      await expect(dialog).toBeHidden();
    });

    test('should trap focus within dialog', async ({ page }) => {
      const dialog = page.locator('#demo-dialog');
      const trigger = page.locator('button:has-text("Open Dialog")').first();

      await trigger.click();
      await expect(dialog).toBeVisible();

      // Tab through the dialog - focus should stay within
      const closeButton = dialog.locator('button:has-text("Close")');
      await closeButton.focus();

      // Tab forward - should cycle within dialog
      await page.keyboard.press('Tab');
      const focusedInDialog = await dialog.evaluate(el => {
        return el.contains(document.activeElement);
      });
      expect(focusedInDialog).toBe(true);
    });

    test('static dialog should not close on backdrop click', async ({ page }) => {
      const staticDialog = page.locator('#static-dialog');
      const trigger = page.locator('button:has-text("Static Dialog")');

      await trigger.click();
      await expect(staticDialog).toBeVisible();

      // Click outside the dialog content (on backdrop)
      await page.mouse.click(10, 10);

      // Dialog should still be visible
      await expect(staticDialog).toBeVisible();

      // Clean up - close via button
      await staticDialog.locator('button:has-text("Cancel")').click();
    });
  });

  test.describe('Drawer Component', () => {
    test('should open from left', async ({ page }) => {
      const drawer = page.locator('#left-drawer');
      const trigger = page.locator('button:has-text("Left Drawer")');

      await expect(drawer).toBeHidden();
      await trigger.click();
      await expect(drawer).toBeVisible();

      // Close it
      await drawer.locator('button:has-text("Close")').click();
      await expect(drawer).toBeHidden();
    });

    test('should open from right', async ({ page }) => {
      const drawer = page.locator('#right-drawer');
      const trigger = page.locator('button:has-text("Right Drawer")');

      await trigger.click();
      await expect(drawer).toBeVisible();

      await drawer.locator('button:has-text("Close")').click();
    });

    test('should open from bottom', async ({ page }) => {
      const drawer = page.locator('#bottom-drawer');
      const trigger = page.locator('button:has-text("Bottom Drawer")');

      await trigger.click();
      await expect(drawer).toBeVisible();

      await drawer.locator('button:has-text("Close")').click();
    });
  });

  test.describe('Tabs Component', () => {
    test('should switch tabs on click', async ({ page }) => {
      const tabs = page.locator('ytz-tabs').first();
      const overviewPanel = tabs.locator('#overview');
      const featuresPanel = tabs.locator('#features');
      const featuresTab = tabs.locator('ytz-tab:has-text("Features")');

      // Initially overview should be visible
      await expect(overviewPanel).toBeVisible();
      await expect(featuresPanel).toBeHidden();

      // Click features tab
      await featuresTab.click();

      // Features panel should now be visible
      await expect(featuresPanel).toBeVisible();
      await expect(overviewPanel).toBeHidden();
    });

    test('should support keyboard navigation', async ({ page }) => {
      const tabs = page.locator('ytz-tabs').first();
      const overviewTab = tabs.locator('ytz-tab:has-text("Overview")');

      // Focus first tab
      await overviewTab.focus();
      await expect(overviewTab).toBeFocused();

      // Arrow right to next tab
      await page.keyboard.press('ArrowRight');
      await expect(tabs.locator('ytz-tab:has-text("Features")')).toBeFocused();
    });
  });

  test.describe('Accordion Component', () => {
    test('should expand item on click', async ({ page }) => {
      const accordion = page.locator('ytz-accordion').first();
      const firstItem = accordion.locator('ytz-accordion-item').first();
      const trigger = firstItem.locator('button');
      const content = firstItem.locator('div').last();

      // Click to expand
      await trigger.click();

      // Content should be visible
      await expect(content).toBeVisible();
    });

    test('exclusive mode should collapse other items', async ({ page }) => {
      const accordion = page.locator('ytz-accordion[exclusive]');
      const items = accordion.locator('ytz-accordion-item');

      // Open first item
      await items.nth(0).locator('button').click();

      // Open second item
      await items.nth(1).locator('button').click();

      // First item should be collapsed (exclusive mode)
      const firstContent = items.nth(0).locator('div').last();
      await expect(firstContent).toBeHidden();
    });
  });

  test.describe('Disclosure Component', () => {
    test('should toggle content visibility', async ({ page }) => {
      const disclosure = page.locator('ytz-disclosure').first();
      const trigger = disclosure.locator('button');
      const content = disclosure.locator('div').last();

      // Initially collapsed
      await expect(content).toBeHidden();

      // Click to expand
      await trigger.click();
      await expect(content).toBeVisible();

      // Click to collapse
      await trigger.click();
      await expect(content).toBeHidden();
    });
  });

  test.describe('Tooltip Component', () => {
    test('should show on hover', async ({ page }) => {
      const tooltip = page.locator('ytz-tooltip').first();
      const trigger = tooltip.locator('button');
      const content = tooltip.locator('[slot="content"]');

      // Initially hidden
      await expect(content).toBeHidden();

      // Hover to show
      await trigger.hover();
      await expect(content).toBeVisible();

      // Move away to hide
      await page.mouse.move(0, 0);
      await expect(content).toBeHidden();
    });
  });

  test.describe('Menu Component', () => {
    test('should open on trigger click', async ({ page }) => {
      const menu = page.locator('ytz-menu').first();
      const trigger = menu.locator('[slot="trigger"]');
      const items = menu.locator('ytz-menuitem');

      await trigger.click();
      await expect(items.first()).toBeVisible();
    });

    test('should emit select event on item click', async ({ page }) => {
      const menu = page.locator('ytz-menu').first();
      const trigger = menu.locator('[slot="trigger"]');

      let selectedValue = '';
      await page.exposeFunction('captureSelect', (value: string) => {
        selectedValue = value;
      });

      await menu.evaluate(el => {
        el.addEventListener('select', (e: any) => {
          (window as any).captureSelect(e.detail.value);
        });
      });

      await trigger.click();
      await menu.locator('ytz-menuitem').first().click();

      expect(selectedValue).toBeTruthy();
    });

    test('should support keyboard navigation', async ({ page }) => {
      const menu = page.locator('ytz-menu').first();
      const trigger = menu.locator('[slot="trigger"]');

      await trigger.click();

      // Arrow down to navigate
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');

      // Enter to select
      await page.keyboard.press('Enter');

      // Menu should close
      await expect(menu.locator('ytz-menuitem').first()).toBeHidden();
    });
  });

  test.describe('Select Component', () => {
    test('should show options on click', async ({ page }) => {
      const select = page.locator('ytz-select').first();
      const options = select.locator('ytz-option');

      await select.click();
      await expect(options.first()).toBeVisible();
    });

    test('should update value on selection', async ({ page }) => {
      const select = page.locator('ytz-select').first();

      await select.click();
      await select.locator('ytz-option[value="green"]').click();

      const value = await select.evaluate((el: any) => el.value);
      expect(value).toBe('green');
    });
  });

  test.describe('Autocomplete Component', () => {
    test('should filter options based on input', async ({ page }) => {
      const autocomplete = page.locator('ytz-autocomplete').first();
      const input = autocomplete.locator('input');

      await input.fill('app');

      // Should show matching options
      const options = autocomplete.locator('ytz-option:visible');
      const count = await options.count();
      expect(count).toBeGreaterThan(0);

      // All visible options should contain 'app'
      const texts = await options.allTextContents();
      for (const text of texts) {
        expect(text.toLowerCase()).toContain('app');
      }
    });
  });

  test.describe('Toggle Component', () => {
    test('should toggle state on click', async ({ page }) => {
      const toggle = page.locator('ytz-toggle').first();

      const initialState = await toggle.evaluate((el: any) => el.checked);
      await toggle.click();
      const newState = await toggle.evaluate((el: any) => el.checked);

      expect(newState).toBe(!initialState);
    });
  });

  test.describe('Slider Component', () => {
    test('should update value on drag', async ({ page }) => {
      const slider = page.locator('ytz-slider').first();
      const box = await slider.boundingBox();

      if (box) {
        // Click near the right side to increase value
        await page.mouse.click(box.x + box.width * 0.8, box.y + box.height / 2);

        const value = await slider.evaluate((el: any) => el.value);
        expect(Number(value)).toBeGreaterThan(50);
      }
    });
  });

  test.describe('Chip Component', () => {
    test('deletable chip should emit delete event', async ({ page }) => {
      const chip = page.locator('ytz-chip[deletable]').first();

      let deleted = false;
      await page.exposeFunction('captureDelete', () => {
        deleted = true;
      });

      await chip.evaluate(el => {
        el.addEventListener('delete', () => {
          (window as any).captureDelete();
        });
      });

      // Click the delete button within the chip
      await chip.locator('button, [role="button"]').click();

      expect(deleted).toBe(true);
    });
  });
});
