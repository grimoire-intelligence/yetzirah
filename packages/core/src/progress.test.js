/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './progress.js'

describe('YtzProgress', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    test('renders with role="progressbar"', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.getAttribute('role')).toBe('progressbar')
    })

    test('renders circular SVG by default', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')
      const svg = progress.querySelector('svg')

      expect(svg).not.toBeNull()
      expect(svg.classList.contains('ytz-progress-circular')).toBe(true)
    })

    test('renders linear div when linear attribute is present', () => {
      document.body.innerHTML = '<ytz-progress linear></ytz-progress>'
      const progress = document.querySelector('ytz-progress')
      const track = progress.querySelector('.ytz-progress-track')
      const svg = progress.querySelector('svg')

      expect(track).not.toBeNull()
      expect(svg).toBeNull()
    })

    test('SVG contains track and indicator circles', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')
      const track = progress.querySelector('.ytz-progress-track')
      const indicator = progress.querySelector('.ytz-progress-indicator')

      expect(track).not.toBeNull()
      expect(indicator).not.toBeNull()
    })

    test('linear contains track and indicator divs', () => {
      document.body.innerHTML = '<ytz-progress linear></ytz-progress>'
      const progress = document.querySelector('ytz-progress')
      const track = progress.querySelector('.ytz-progress-track')
      const indicator = progress.querySelector('.ytz-progress-indicator')

      expect(track).not.toBeNull()
      expect(indicator).not.toBeNull()
    })
  })

  describe('indeterminate mode', () => {
    test('is indeterminate when no value attribute', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.indeterminate).toBe(true)
      expect(progress.value).toBeNull()
    })

    test('has data-indeterminate attribute when indeterminate', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.hasAttribute('data-indeterminate')).toBe(true)
    })

    test('removes ARIA value attributes when indeterminate', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.hasAttribute('aria-valuenow')).toBe(false)
      expect(progress.hasAttribute('aria-valuemin')).toBe(false)
      expect(progress.hasAttribute('aria-valuemax')).toBe(false)
    })
  })

  describe('determinate mode', () => {
    test('is determinate when value attribute is set', () => {
      document.body.innerHTML = '<ytz-progress value="50"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.indeterminate).toBe(false)
      expect(progress.value).toBe(50)
    })

    test('does not have data-indeterminate attribute when determinate', () => {
      document.body.innerHTML = '<ytz-progress value="50"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.hasAttribute('data-indeterminate')).toBe(false)
    })

    test('sets ARIA value attributes when determinate', () => {
      document.body.innerHTML = '<ytz-progress value="75"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.getAttribute('aria-valuenow')).toBe('75')
      expect(progress.getAttribute('aria-valuemin')).toBe('0')
      expect(progress.getAttribute('aria-valuemax')).toBe('100')
    })

    test('clamps value to 0-100 range', () => {
      document.body.innerHTML = '<ytz-progress value="150"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.value).toBe(100)

      progress.value = -10
      expect(progress.value).toBe(0)
    })

    test('sets linear bar width for determinate linear progress', () => {
      document.body.innerHTML = '<ytz-progress linear value="50"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')
      const bar = progress.querySelector('.ytz-progress-indicator')

      expect(bar.style.width).toBe('50%')
    })

    test('sets CSS custom property for progress percent', () => {
      document.body.innerHTML = '<ytz-progress value="75"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.style.getPropertyValue('--progress-percent')).toBe('75')
    })
  })

  describe('accessibility', () => {
    test('applies aria-label from label attribute', () => {
      document.body.innerHTML = '<ytz-progress label="Loading content"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.getAttribute('aria-label')).toBe('Loading content')
    })

    test('removes aria-label when label attribute is removed', () => {
      document.body.innerHTML = '<ytz-progress label="Loading"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.hasAttribute('aria-label')).toBe(true)

      progress.removeAttribute('label')

      expect(progress.hasAttribute('aria-label')).toBe(false)
    })

    test('SVG has aria-hidden', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')
      const svg = progress.querySelector('svg')

      expect(svg.getAttribute('aria-hidden')).toBe('true')
    })

    test('linear track has aria-hidden', () => {
      document.body.innerHTML = '<ytz-progress linear></ytz-progress>'
      const progress = document.querySelector('ytz-progress')
      const track = progress.querySelector('.ytz-progress-track')

      expect(track.getAttribute('aria-hidden')).toBe('true')
    })
  })

  describe('property getters/setters', () => {
    test('value property getter', () => {
      document.body.innerHTML = '<ytz-progress value="60"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.value).toBe(60)
    })

    test('value property setter', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.value).toBeNull()

      progress.value = 40
      expect(progress.getAttribute('value')).toBe('40')
      expect(progress.value).toBe(40)

      progress.value = null
      expect(progress.hasAttribute('value')).toBe(false)
      expect(progress.value).toBeNull()
    })

    test('linear property getter', () => {
      document.body.innerHTML = '<ytz-progress linear></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.linear).toBe(true)
    })

    test('linear property setter', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.linear).toBe(false)

      progress.linear = true
      expect(progress.hasAttribute('linear')).toBe(true)
      expect(progress.querySelector('.ytz-progress-track')).not.toBeNull() // Re-renders as linear
    })

    test('indeterminate property is read-only', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.indeterminate).toBe(true)

      // Setting value makes it determinate
      progress.value = 50
      expect(progress.indeterminate).toBe(false)

      // Removing value makes it indeterminate again
      progress.value = null
      expect(progress.indeterminate).toBe(true)
    })

    test('size property', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.size).toBe('medium') // default

      progress.size = 'large'
      expect(progress.getAttribute('size')).toBe('large')
      expect(progress.getAttribute('data-size')).toBe('large')
    })
  })

  describe('attribute change reactions', () => {
    test('switching from circular to linear re-renders', () => {
      document.body.innerHTML = '<ytz-progress value="50"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.querySelector('svg')).not.toBeNull()
      expect(progress.querySelector('.ytz-progress-track:not(circle)')).toBeNull()

      progress.setAttribute('linear', '')

      expect(progress.querySelector('svg')).toBeNull()
      expect(progress.querySelector('.ytz-progress-track')).not.toBeNull()
    })

    test('switching from linear to circular re-renders', () => {
      document.body.innerHTML = '<ytz-progress linear value="50"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.querySelector('svg')).toBeNull()

      progress.removeAttribute('linear')

      expect(progress.querySelector('svg')).not.toBeNull()
    })

    test('updating value updates ARIA and visual', () => {
      document.body.innerHTML = '<ytz-progress value="25"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.getAttribute('aria-valuenow')).toBe('25')

      progress.setAttribute('value', '75')

      expect(progress.getAttribute('aria-valuenow')).toBe('75')
      expect(progress.style.getPropertyValue('--progress-percent')).toBe('75')
    })
  })

  describe('size variants', () => {
    test('sets data-size attribute', () => {
      document.body.innerHTML = '<ytz-progress size="small"></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.getAttribute('data-size')).toBe('small')
    })

    test('defaults to medium size', () => {
      document.body.innerHTML = '<ytz-progress></ytz-progress>'
      const progress = document.querySelector('ytz-progress')

      expect(progress.getAttribute('data-size')).toBe('medium')
    })

    test('accepts small, medium, large', () => {
      for (const size of ['small', 'medium', 'large']) {
        document.body.innerHTML = `<ytz-progress size="${size}"></ytz-progress>`
        const progress = document.querySelector('ytz-progress')

        expect(progress.getAttribute('data-size')).toBe(size)
      }
    })
  })
})
