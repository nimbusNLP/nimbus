// Mock implementation of @clack/prompts
export const select = jest.fn();
export const note = jest.fn();
export const isCancel = jest.fn();
export const cancel = jest.fn();
export const spinner = jest.fn(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  message: jest.fn()
}));
export const intro = jest.fn();
export const text = jest.fn();
export const outro = jest.fn();

// Add any other functions from @clack/prompts that you need to mock
