import { vi } from 'vitest';

// Mock implementation of securityManager for tests
export const securityManager = {
  sanitizeInput: vi.fn((input: string) => input),
  validateInput: vi.fn(() => true),
  rateLimit: vi.fn(() => true)
};
