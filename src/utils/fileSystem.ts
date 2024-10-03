import { v4 as uuidv4 } from 'uuid';

interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileSystemNode[];
}

class FileSystem {
  private root: FileSystemNode;

  constructor() {
    this.root = {
      id: uuidv4(),
      name: 'root',
      type: 'directory',
      children: [],
    };
    this.initializeFileSystem();
  }

  private initializeFileSystem() {
    this.mkdir('/home');
    this.mkdir('/home/project');
    this.mkdir('/tmp');
    this.writeFile('/home/project/example.txt', 'This is an example file.');
  }

  private findNode(path: string): FileSystemNode | null {
    const parts = path.split('/').filter(Boolean);
    let current = this.root;

    for (const part of parts) {
      if (current.type !== 'directory' || !current.children) {
        return null;
      }
      const found = current.children.find(child => child.name === part);
      if (!found) {
        return null;
      }
      current = found;
    }

    return current;
  }

  mkdir(path: string): boolean {
    const parts = path.split('/').filter(Boolean);
    let current = this.root;

    for (const part of parts) {
      if (current.type !== 'directory') {
        return false;
      }
      let child = current.children?.find(c => c.name === part);
      if (!child) {
        child = {
          id: uuidv4(),
          name: part,
          type: 'directory',
          children: [],
        };
        current.children?.push(child);
      }
      current = child;
    }

    return true;
  }

  writeFile(path: string, content: string): boolean {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop();
    const dirPath = '/' + parts.join('/');
    const dir = this.findNode(dirPath);

    if (!dir || dir.type !== 'directory') {
      return false;
    }

    const existingFile = dir.children?.find(child => child.name === fileName);
    if (existingFile) {
      existingFile.content = content;
    } else {
      dir.children?.push({
        id: uuidv4(),
        name: fileName!,
        type: 'file',
        content,
      });
    }

    return true;
  }

  readFile(path: string): string | null {
    const node = this.findNode(path);
    if (node && node.type === 'file') {
      return node.content || null;
    }
    return null;
  }

  listFiles(path: string): string[] | null {
    const node = this.findNode(path);
    if (node && node.type === 'directory') {
      return node.children?.map(child => child.name) || [];
    }
    return null;
  }

  deleteFile(path: string): boolean {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop();
    const dirPath = '/' + parts.join('/');
    const dir = this.findNode(dirPath);

    if (!dir || dir.type !== 'directory') {
      return false;
    }

    const fileIndex = dir.children?.findIndex(child => child.name === fileName);
    if (fileIndex !== undefined && fileIndex !== -1) {
      dir.children?.splice(fileIndex, 1);
      return true;
    }

    return false;
  }

  moveFile(sourcePath: string, destinationPath: string): boolean {
    const content = this.readFile(sourcePath);
    if (content === null) {
      return false;
    }

    if (this.writeFile(destinationPath, content)) {
      return this.deleteFile(sourcePath);
    }

    return false;
  }

  searchInFile(path: string, searchTerm: string): string[] | null {
    const content = this.readFile(path);
    if (content === null) {
      return null;
    }

    const lines = content.split('\n');
    return lines.filter(line => line.includes(searchTerm));
  }
}

export const fileSystem = new FileSystem();