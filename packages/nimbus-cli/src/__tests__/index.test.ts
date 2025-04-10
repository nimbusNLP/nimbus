describe('Basic Tests', () => {
  test('true should be true', () => {
    expect(true).toBe(true);
  });

  test('addition works correctly', () => {
    expect(1 + 1).toBe(2);
  });

  test('string concatenation works', () => {
    expect('hello ' + 'world').toBe('hello world');
  });
});