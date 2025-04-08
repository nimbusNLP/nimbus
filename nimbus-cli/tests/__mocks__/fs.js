// Mock implementation of the fs module
const fs = jest.createMockFromModule('fs');

// Mock file system state
let mockFiles = {};
let mockDirectories = {};

// Helper to reset the mock file system
function __resetMockFileSystem() {
  mockFiles = {};
  mockDirectories = {};
}

// Helper to set mock files
function __setMockFiles(newMockFiles) {
  mockFiles = { ...newMockFiles };
}

// Helper to set mock directories
function __setMockDirectories(newMockDirectories) {
  mockDirectories = { ...newMockDirectories };
}

// Mock existsSync
function existsSync(path) {
  return mockFiles[path] !== undefined || mockDirectories[path] !== undefined;
}

// Mock readFileSync
function readFileSync(path, options) {
  if (mockFiles[path]) {
    return mockFiles[path];
  }
  throw new Error(`ENOENT: no such file or directory, open '${path}'`);
}

// Mock writeFileSync
function writeFileSync(path, data, options) {
  mockFiles[path] = data;
}

// Mock mkdirSync
function mkdirSync(path, options) {
  mockDirectories[path] = true;
}

// Mock rmSync
function rmSync(path, options) {
  delete mockFiles[path];
  delete mockDirectories[path];
}

// Mock cpSync
function cpSync(source, destination, options) {
  if (mockFiles[source]) {
    mockFiles[destination] = mockFiles[source];
  } else if (mockDirectories[source]) {
    mockDirectories[destination] = true;
  } else {
    throw new Error(`ENOENT: no such file or directory, copy '${source}'`);
  }
}

// Assign mocks to fs
fs.__resetMockFileSystem = __resetMockFileSystem;
fs.__setMockFiles = __setMockFiles;
fs.__setMockDirectories = __setMockDirectories;
fs.existsSync = existsSync;
fs.readFileSync = readFileSync;
fs.writeFileSync = writeFileSync;
fs.mkdirSync = mkdirSync;
fs.rmSync = rmSync;
fs.cpSync = cpSync;

module.exports = fs;
