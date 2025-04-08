// Mock implementation of the path module
const path = jest.createMockFromModule('path');

// Implement join function
path.join = function(...paths) {
  return paths.join('/');
};

module.exports = path;
