import { CrudGeneratorOptions } from "../crud-generator.decorator";

export function generateRequiredPermissionDecorators({
    generatorOptions,
    hasScopeProp,
}: {
    generatorOptions: CrudGeneratorOptions;
    hasScopeProp: boolean;
}) {
    const ret: {
        resolverDecorator?: string;
        listDecorator?: string;
        singleDecorator?: string;
        createDecorator?: string;
        updateDecorator?: string;
        deleteDecorator?: string;
    } = {};
    if (generatorOptions.requiredPermission) {
        const requiredPermission = generatorOptions.requiredPermission;
        if (typeof requiredPermission === "string" || Array.isArray(requiredPermission)) {
            ret.resolverDecorator = `@RequiredPermission(${JSON.stringify(
                Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission],
            )}${!hasScopeProp ? `, { skipScopeCheck: true }` : ""})`;
        } else {
            ret.listDecorator = `@RequiredPermission(${JSON.stringify(
                Array.isArray(requiredPermission.list) ? requiredPermission.list : [requiredPermission.list],
            )}${!hasScopeProp ? `, { skipScopeCheck: true }` : ""})`;
            ret.singleDecorator = `@RequiredPermission(${JSON.stringify([
                ...(Array.isArray(requiredPermission.list) ? requiredPermission.list : [requiredPermission.list]),
                ...(Array.isArray(requiredPermission.create) ? requiredPermission.create : [requiredPermission.create]),
                ...(Array.isArray(requiredPermission.update) ? requiredPermission.update : [requiredPermission.update]),
                ...(Array.isArray(requiredPermission.delete) ? requiredPermission.delete : [requiredPermission.delete]),
            ])}${!hasScopeProp ? `, { skipScopeCheck: true }` : ""})`;
            ret.createDecorator = `@RequiredPermission(${JSON.stringify(
                Array.isArray(requiredPermission.create) ? requiredPermission.create : [requiredPermission.create],
            )}${!hasScopeProp ? `, { skipScopeCheck: true }` : ""})`;
            ret.updateDecorator = `@RequiredPermission(${JSON.stringify(
                Array.isArray(requiredPermission.update) ? requiredPermission.update : [requiredPermission.update],
            )}${!hasScopeProp ? `, { skipScopeCheck: true }` : ""})`;
            ret.deleteDecorator = `@RequiredPermission(${JSON.stringify(
                Array.isArray(requiredPermission.delete) ? requiredPermission.delete : [requiredPermission.delete],
            )}${!hasScopeProp ? `, { skipScopeCheck: true }` : ""})`;
        }
    }
    return ret;
}
