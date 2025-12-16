/**
 * ytz-tabs - Tabbed interface Web Components.
 * @module @yetzirah/core/tabs
 * @example
 * <ytz-tabs>
 *   <ytz-tab panel="tab1">Account</ytz-tab>
 *   <ytz-tabpanel id="tab1">Account content</ytz-tabpanel>
 * </ytz-tabs>
 */

import { createKeyNav } from './utils/key-nav.js'

let tabId = 0

/** @class YtzTabs */
class YtzTabs extends HTMLElement {
  static observedAttributes = ['value', 'orientation']
  #keyNav = null

  connectedCallback() {
    this.setAttribute('role', 'tablist')
    this.#setupKeyNav()
    if (!this.hasAttribute('value')) {
      const firstTab = this.querySelector('ytz-tab')
      if (firstTab?.getAttribute('panel')) {
        this.setAttribute('value', firstTab.getAttribute('panel'))
      }
    }
    this.#updateSelection()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return
    if (name === 'value' && oldVal !== newVal) {
      this.#updateSelection()
      if (oldVal !== null) {
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: newVal } }))
      }
    }
    if (name === 'orientation') this.#setupKeyNav()
  }

  #setupKeyNav() {
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal'
    this.#keyNav = createKeyNav(
      () => [...this.querySelectorAll('ytz-tab')],
      {
        orientation,
        wrap: true,
        autoActivate: true,
        onActivate: (tab) => {
          const panel = tab.getAttribute('panel')
          if (panel) this.value = panel
        }
      }
    )
    this.addEventListener('keydown', this.#handleKeyDown)
  }

  #handleKeyDown = (e) => this.#keyNav?.handleKeyDown(e)

  #updateSelection() {
    const value = this.getAttribute('value')
    this.querySelectorAll('ytz-tab').forEach((tab) => {
      const isSelected = tab.getAttribute('panel') === value
      tab.setAttribute('aria-selected', String(isSelected))
      tab.setAttribute('tabindex', isSelected ? '0' : '-1')
    })
    this.querySelectorAll('ytz-tabpanel').forEach((panel) => {
      panel.hidden = panel.id !== value
    })
  }

  get value() { return this.getAttribute('value') }
  set value(v) { v ? this.setAttribute('value', v) : this.removeAttribute('value') }

  get orientation() {
    return this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal'
  }
  set orientation(v) { this.setAttribute('orientation', v) }
}

/** @class YtzTab */
class YtzTab extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'tab')
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1')
    if (!this.id) this.id = `ytz-tab-${++tabId}`
    const panelId = this.getAttribute('panel')
    if (panelId) this.setAttribute('aria-controls', panelId)
    this.addEventListener('click', this.#handleClick)
  }

  disconnectedCallback() { this.removeEventListener('click', this.#handleClick) }

  #handleClick = () => {
    const tabs = this.closest('ytz-tabs')
    const panel = this.getAttribute('panel')
    if (tabs && panel) tabs.value = panel
  }

  get panel() { return this.getAttribute('panel') }
  set panel(v) {
    if (v) {
      this.setAttribute('panel', v)
      this.setAttribute('aria-controls', v)
    } else {
      this.removeAttribute('panel')
      this.removeAttribute('aria-controls')
    }
  }
}

/** @class YtzTabPanel */
class YtzTabPanel extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'tabpanel')
    const tabs = this.closest('ytz-tabs')
    if (tabs) {
      this.hidden = this.id !== tabs.getAttribute('value')
    } else {
      this.hidden = true
    }
    this.#linkToTab()
  }

  #linkToTab() {
    const tabs = this.closest('ytz-tabs')
    if (!tabs || !this.id) return
    const tab = tabs.querySelector(`ytz-tab[panel="${this.id}"]`)
    if (tab) {
      if (!tab.id) tab.id = `ytz-tab-${++tabId}`
      this.setAttribute('aria-labelledby', tab.id)
    }
  }
}

customElements.define('ytz-tabs', YtzTabs)
customElements.define('ytz-tab', YtzTab)
customElements.define('ytz-tabpanel', YtzTabPanel)

export { YtzTabs, YtzTab, YtzTabPanel }
