// Vitest setup file
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock the Wails API
window.go = {
  main: {
    App: {
      GetEnvelopes: vi.fn(),
      CreateEnvelope: vi.fn(),
      UpdateEnvelope: vi.fn(),
      DeleteEnvelope: vi.fn(),
      GetBudgetPeriods: vi.fn(),
      GetBudgetAllocationsByBudgetPeriodID: vi.fn(),
      GetCategories: vi.fn(),
      DeleteBudgetAllocation: vi.fn(),
    },
  },
};

// Mock window.matchMedia which is not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
