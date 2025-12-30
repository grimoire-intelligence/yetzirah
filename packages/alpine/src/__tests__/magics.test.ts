import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createYtzMagic, type YtzMagic } from '../magics'

describe('$ytz magic methods', () => {
  let ytz: YtzMagic

  beforeEach(() => {
    ytz = createYtzMagic()
    // Clean up any elements from previous tests
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('open()', () => {
    it('opens a dialog by selector', () => {
      document.body.innerHTML = '<ytz-dialog id="my-dialog"></ytz-dialog>'
      const dialog = document.querySelector('#my-dialog')!

      expect(dialog.hasAttribute('open')).toBe(false)

      ytz.open('#my-dialog')

      expect(dialog.hasAttribute('open')).toBe(true)
    })

    it('opens a drawer by selector', () => {
      document.body.innerHTML = '<ytz-drawer id="my-drawer"></ytz-drawer>'
      const drawer = document.querySelector('#my-drawer')!

      expect(drawer.hasAttribute('open')).toBe(false)

      ytz.open('#my-drawer')

      expect(drawer.hasAttribute('open')).toBe(true)
    })

    it('opens a menu by selector', () => {
      document.body.innerHTML = '<ytz-menu id="my-menu"></ytz-menu>'
      const menu = document.querySelector('#my-menu')!

      expect(menu.hasAttribute('open')).toBe(false)

      ytz.open('#my-menu')

      expect(menu.hasAttribute('open')).toBe(true)
    })

    it('opens an element reference directly', () => {
      document.body.innerHTML = '<ytz-dialog id="my-dialog"></ytz-dialog>'
      const dialog = document.querySelector('#my-dialog') as HTMLElement

      expect(dialog.hasAttribute('open')).toBe(false)

      ytz.open(dialog)

      expect(dialog.hasAttribute('open')).toBe(true)
    })

    it('handles non-existent selector gracefully', () => {
      expect(() => ytz.open('#non-existent')).not.toThrow()
    })
  })

  describe('close()', () => {
    it('closes a dialog by selector', () => {
      document.body.innerHTML = '<ytz-dialog id="my-dialog" open></ytz-dialog>'
      const dialog = document.querySelector('#my-dialog')!

      expect(dialog.hasAttribute('open')).toBe(true)

      ytz.close('#my-dialog')

      expect(dialog.hasAttribute('open')).toBe(false)
    })

    it('closes a drawer by selector', () => {
      document.body.innerHTML = '<ytz-drawer id="my-drawer" open></ytz-drawer>'
      const drawer = document.querySelector('#my-drawer')!

      expect(drawer.hasAttribute('open')).toBe(true)

      ytz.close('#my-drawer')

      expect(drawer.hasAttribute('open')).toBe(false)
    })

    it('closes an element reference directly', () => {
      document.body.innerHTML = '<ytz-dialog id="my-dialog" open></ytz-dialog>'
      const dialog = document.querySelector('#my-dialog') as HTMLElement

      expect(dialog.hasAttribute('open')).toBe(true)

      ytz.close(dialog)

      expect(dialog.hasAttribute('open')).toBe(false)
    })

    it('handles non-existent selector gracefully', () => {
      expect(() => ytz.close('#non-existent')).not.toThrow()
    })
  })

  describe('toggle()', () => {
    it('opens a closed component', () => {
      document.body.innerHTML = '<ytz-dialog id="my-dialog"></ytz-dialog>'
      const dialog = document.querySelector('#my-dialog')!

      expect(dialog.hasAttribute('open')).toBe(false)

      ytz.toggle('#my-dialog')

      expect(dialog.hasAttribute('open')).toBe(true)
    })

    it('closes an open component', () => {
      document.body.innerHTML = '<ytz-dialog id="my-dialog" open></ytz-dialog>'
      const dialog = document.querySelector('#my-dialog')!

      expect(dialog.hasAttribute('open')).toBe(true)

      ytz.toggle('#my-dialog')

      expect(dialog.hasAttribute('open')).toBe(false)
    })

    it('toggles with element reference', () => {
      document.body.innerHTML = '<ytz-drawer id="sidebar"></ytz-drawer>'
      const drawer = document.querySelector('#sidebar') as HTMLElement

      expect(drawer.hasAttribute('open')).toBe(false)

      ytz.toggle(drawer)
      expect(drawer.hasAttribute('open')).toBe(true)

      ytz.toggle(drawer)
      expect(drawer.hasAttribute('open')).toBe(false)
    })

    it('handles non-existent selector gracefully', () => {
      expect(() => ytz.toggle('#non-existent')).not.toThrow()
    })
  })

  describe('show()', () => {
    it('opens an existing snackbar', () => {
      document.body.innerHTML = '<ytz-snackbar id="notification">Initial message</ytz-snackbar>'
      const snackbar = document.querySelector('#notification')!

      expect(snackbar.hasAttribute('open')).toBe(false)

      ytz.show('#notification')

      expect(snackbar.hasAttribute('open')).toBe(true)
      expect(snackbar.textContent).toBe('Initial message')
    })

    it('sets message and opens snackbar', () => {
      document.body.innerHTML = '<ytz-snackbar id="notification"></ytz-snackbar>'
      const snackbar = document.querySelector('#notification')!

      ytz.show('#notification', 'Hello World!')

      expect(snackbar.hasAttribute('open')).toBe(true)
      expect(snackbar.textContent).toBe('Hello World!')
    })

    it('works with element reference', () => {
      document.body.innerHTML = '<ytz-snackbar id="notification"></ytz-snackbar>'
      const snackbar = document.querySelector('#notification') as HTMLElement

      ytz.show(snackbar, 'Direct reference!')

      expect(snackbar.hasAttribute('open')).toBe(true)
      expect(snackbar.textContent).toBe('Direct reference!')
    })

    it('handles non-existent selector gracefully', () => {
      expect(() => ytz.show('#non-existent', 'message')).not.toThrow()
    })
  })

  describe('snackbar()', () => {
    it('creates and shows a programmatic snackbar', () => {
      const snackbar = ytz.snackbar('Test message')

      expect(snackbar).toBeInstanceOf(HTMLElement)
      expect(snackbar.tagName.toLowerCase()).toBe('ytz-snackbar')
      expect(snackbar.textContent).toBe('Test message')
      expect(snackbar.hasAttribute('open')).toBe(true)
      expect(document.body.contains(snackbar)).toBe(true)
    })

    it('sets duration option', () => {
      const snackbar = ytz.snackbar('Test', { duration: 5000 })

      expect(snackbar.getAttribute('duration')).toBe('5000')
    })

    it('sets position option', () => {
      const snackbar = ytz.snackbar('Test', { position: 'top-right' })

      expect(snackbar.getAttribute('position')).toBe('top-right')
    })

    it('removes snackbar on close event', () => {
      const snackbar = ytz.snackbar('Test')

      expect(document.body.contains(snackbar)).toBe(true)

      snackbar.dispatchEvent(new CustomEvent('close'))

      expect(document.body.contains(snackbar)).toBe(false)
    })
  })

  describe('openDialog() / closeDialog()', () => {
    it('openDialog opens a dialog', () => {
      document.body.innerHTML = '<ytz-dialog id="dialog"></ytz-dialog>'
      const dialog = document.querySelector('#dialog')!

      ytz.openDialog('#dialog')

      expect(dialog.hasAttribute('open')).toBe(true)
    })

    it('closeDialog closes a dialog', () => {
      document.body.innerHTML = '<ytz-dialog id="dialog" open></ytz-dialog>'
      const dialog = document.querySelector('#dialog')!

      ytz.closeDialog('#dialog')

      expect(dialog.hasAttribute('open')).toBe(false)
    })
  })

  describe('openDrawer() / closeDrawer()', () => {
    it('openDrawer opens a drawer', () => {
      document.body.innerHTML = '<ytz-drawer id="drawer"></ytz-drawer>'
      const drawer = document.querySelector('#drawer')!

      ytz.openDrawer('#drawer')

      expect(drawer.hasAttribute('open')).toBe(true)
    })

    it('closeDrawer closes a drawer', () => {
      document.body.innerHTML = '<ytz-drawer id="drawer" open></ytz-drawer>'
      const drawer = document.querySelector('#drawer')!

      ytz.closeDrawer('#drawer')

      expect(drawer.hasAttribute('open')).toBe(false)
    })
  })

  describe('theme methods', () => {
    beforeEach(() => {
      document.documentElement.removeAttribute('data-theme')
    })

    it('getTheme returns light by default', () => {
      expect(ytz.getTheme()).toBe('light')
    })

    it('getTheme returns current theme', () => {
      document.documentElement.setAttribute('data-theme', 'dark')
      expect(ytz.getTheme()).toBe('dark')
    })

    it('setTheme sets the theme', () => {
      ytz.setTheme('dark')
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

      ytz.setTheme('light')
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })

    it('toggleTheme toggles from light to dark', () => {
      document.documentElement.setAttribute('data-theme', 'light')

      const result = ytz.toggleTheme()

      expect(result).toBe('dark')
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })

    it('toggleTheme toggles from dark to light', () => {
      document.documentElement.setAttribute('data-theme', 'dark')

      const result = ytz.toggleTheme()

      expect(result).toBe('light')
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })
  })
})
