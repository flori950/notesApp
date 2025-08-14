import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn().mockReturnValue({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Array(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Array(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  }),
})

Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  value: vi.fn().mockReturnValue('data:image/png;base64,test-canvas-data'),
})

// Mock IntersectionObserver
const globalThis = global as unknown as {
  IntersectionObserver: typeof IntersectionObserver
}
globalThis.IntersectionObserver = class MockIntersectionObserver {
  root = null
  rootMargin = ''
  thresholds: number[] = []
  
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
} as typeof IntersectionObserver

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Setup sessionStorage mock with proper cleanup
const mockSessionStorage = (() => {
  const store = new Map()
  
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => store.set(key, value)),
    removeItem: vi.fn((key: string) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
    get length() { return store.size },
    key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null)
  }
})()

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true
})

// Clear sessionStorage before each test
beforeEach(() => {
  mockSessionStorage.clear()
})

// Suppress console warnings during tests to reduce noise
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

beforeEach(() => {
  // Mock console methods to reduce test output noise
  console.warn = vi.fn()
  console.error = vi.fn()
})

// Restore console methods after tests
afterEach(() => {
  console.warn = originalConsoleWarn
  console.error = originalConsoleError
})

// Mock jsPDF - Required for PDF export functionality
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    setFontSize: vi.fn(),
    text: vi.fn(),
    save: vi.fn(),
    getTextWidth: vi.fn().mockReturnValue(100),
    splitTextToSize: vi.fn().mockImplementation((text: string) => [text]),
    internal: {
      pageSize: {
        getWidth: () => 200,
        getHeight: () => 300
      }
    }
  }))
}));

// Mock SecurityManager - Required for input sanitization and rate limiting
vi.mock('../utils/security', () => ({
  securityManager: {
    sanitizeInput: vi.fn((input: string) => input),
    validateInput: vi.fn(() => true),
    checkRateLimit: vi.fn(() => true),
    getClientId: vi.fn(() => 'test-client-id'),
    init: vi.fn()
  }
}));
