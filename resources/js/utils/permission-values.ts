export function permissionIds(value: unknown, nameMap: Record<string, string>): string[] {
    const values = Array.isArray(value) ? value : value && typeof value === 'object' && 'permissions' in value && Array.isArray(value.permissions) ? value.permissions : [];
    return values.flatMap((permission: unknown) => {
        if (typeof permission === 'string' || typeof permission === 'number') return [nameMap[String(permission)] || String(permission)];
        if (permission && typeof permission === 'object') {
            if ('id' in permission && (typeof permission.id === 'number' || typeof permission.id === 'string')) return [String(permission.id)];
            if ('name' in permission && typeof permission.name === 'string') return [nameMap[permission.name] || permission.name];
        }
        return [];
    });
}
