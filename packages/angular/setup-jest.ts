import 'jest-preset-angular/setup-jest'

// Mock @yetzirah/core to avoid loading the actual web components
jest.mock('@yetzirah/core', () => ({}))

// Mock customElements API
Object.defineProperty(window, 'customElements', {
  value: {
    define: jest.fn(),
    get: jest.fn(),
    whenDefined: jest.fn().mockResolvedValue(undefined)
  },
  writable: true
})
