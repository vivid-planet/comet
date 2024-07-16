export function createRequiredPermissionDecorator(
    requiredPermissions: string | string[] | undefined,
    subPermission: string,
    skipScopeCheck: boolean,
): string {
    if (!requiredPermissions) return "";
    let permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    if (subPermission) {
        permissions = permissions.map((permission) => `${permission}.${subPermission}`);
    }
    return `@RequiredPermission(${JSON.stringify(permissions)}${skipScopeCheck ? `, { skipScopeCheck: true }` : ""})`;
}
