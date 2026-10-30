type PermissionValue = string | boolean | undefined;

export function canUseAction(permissions: readonly string[], entityPermission: PermissionValue, actionPermission?: string): boolean {
    if (entityPermission === false) return false;
    if (typeof entityPermission === 'string' && entityPermission && !permissions.includes(entityPermission)) return false;
    return !actionPermission || permissions.includes(actionPermission);
}
