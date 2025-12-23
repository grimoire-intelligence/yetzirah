// Vitest setup file for Vue component tests

// Mock customElements API to prevent errors when web components try to register
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'customElements', {
    value: {
      define: () => {},
      get: () => undefined,
      whenDefined: () => Promise.resolve()
    },
    writable: true
  })
}
