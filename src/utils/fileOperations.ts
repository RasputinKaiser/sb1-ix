// This is a mock implementation for browser environment
// In a real Node.js environment, you would use the 'fs' module

const ALLOWED_DIRECTORIES = ['/home/project', '/tmp'];

export function isAllowedPath(path: string): boolean {
  return ALLOWED_DIRECTORIES.some(dir => path.startsWith(dir));
}

export function listFiles(directoryPath: string): string[] | null {
  if (!isAllowedPath(directoryPath)) {
    console.error(`Access denied to directory: ${directoryPath}`);
    return null;
  }

  // Mock implementation
  return [
    'file1.txt',
    'file2.js',
    'file3.json',
  ];
}

export function writeFile(filePath: string, content: string): boolean {
  if (!isAllowedPath(filePath)) {
    console.error(`Access denied to file: ${filePath}`);
    return false;
  }

  // Mock implementation
  console.log(`Writing to file: ${filePath}`);
  console.log(`Content: ${content}`);
  return true;
}