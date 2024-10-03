import { safeExec } from '../utils/safeExecution';
import { fileSystem } from '../utils/fileSystem';
import { permissionSystem } from '../utils/permissionSystem';

describe('AI Generated Code Tests', () => {
  const mockFileSystem = {
    listFiles: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    deleteFile: jest.fn(),
    mkdir: jest.fn(),
  };

  const mockPermissionSystem = {
    checkPermission: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('List files in directory', async () => {
    const code = `
      if (permissionSystem.checkPermission('/home/project', 'read')) {
        return fileSystem.listFiles('/home/project');
      } else {
        throw new Error('Permission denied');
      }
    `;

    mockPermissionSystem.checkPermission.mockReturnValue(true);
    mockFileSystem.listFiles.mockReturnValue(['file1.txt', 'file2.js']);

    const result = await safeExec(code, { fileSystem: mockFileSystem, permissionSystem: mockPermissionSystem });
    expect(result).toEqual(['file1.txt', 'file2.js']);
    expect(mockPermissionSystem.checkPermission).toHaveBeenCalledWith('/home/project', 'read');
    expect(mockFileSystem.listFiles).toHaveBeenCalledWith('/home/project');
  });

  test('Write file with permission check', async () => {
    const code = `
      if (permissionSystem.checkPermission('/home/project/newfile.txt', 'write')) {
        return fileSystem.writeFile('/home/project/newfile.txt', 'Hello, World!');
      } else {
        throw new Error('Permission denied');
      }
    `;

    mockPermissionSystem.checkPermission.mockReturnValue(true);
    mockFileSystem.writeFile.mockReturnValue(true);

    const result = await safeExec(code, { fileSystem: mockFileSystem, permissionSystem: mockPermissionSystem });
    expect(result).toBe(true);
    expect(mockPermissionSystem.checkPermission).toHaveBeenCalledWith('/home/project/newfile.txt', 'write');
    expect(mockFileSystem.writeFile).toHaveBeenCalledWith('/home/project/newfile.txt', 'Hello, World!');
  });

  test('Attempt to access forbidden directory', async () => {
    const code = `
      if (permissionSystem.checkPermission('/root', 'read')) {
        return fileSystem.listFiles('/root');
      } else {
        throw new Error('Permission denied');
      }
    `;

    mockPermissionSystem.checkPermission.mockReturnValue(false);

    await expect(safeExec(code, { fileSystem: mockFileSystem, permissionSystem: mockPermissionSystem }))
      .rejects.toThrow('Permission denied');
    expect(mockPermissionSystem.checkPermission).toHaveBeenCalledWith('/root', 'read');
    expect(mockFileSystem.listFiles).not.toHaveBeenCalled();
  });
});