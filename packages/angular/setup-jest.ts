import 'jest-preset-angular/setup-jest'

// Mock @grimoire-intel/yetzirah to avoid loading the actual web components
jest.mock('@grimoire-intel/yetzirah', () => ({}))

// Mock customElements API
Object.defineProperty(window, 'customElements', {
  value: {
    define: jest.fn(),
    get: jest.fn(),
    whenDefined: jest.fn().mockResolvedValue(undefined)
  },
  writable: true
})
