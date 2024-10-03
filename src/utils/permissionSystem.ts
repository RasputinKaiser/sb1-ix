type Permission = 'read' | 'write' | 'execute';

interface PermissionRule {
  path: string;
  permissions: Permission[];
}

class PermissionSystem {
  private rules: PermissionRule[] = [
    { path: '/home/project', permissions: ['read', 'write'] },
    { path: '/tmp', permissions: ['read', 'write'] },
  ];

  checkPermission(path: string, permission: Permission): boolean {
    for (const rule of this.rules) {
      if (path.startsWith(rule.path) && rule.permissions.includes(permission)) {
        return true;
      }
    }
    return false;
  }

  addRule(path: string, permissions: Permission[]): void {
    this.rules.push({ path, permissions });
  }

  removeRule(path: string): void {
    this.rules = this.rules.filter(rule => rule.path !== path);
  }
}

export const permissionSystem = new PermissionSystem();