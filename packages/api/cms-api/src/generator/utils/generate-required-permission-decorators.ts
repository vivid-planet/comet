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
        readDecorator?: string;
        createDecorator?: string;
        updateDecorator?: string;
        deleteDecorator?: string;
    } = {};
    if (generatorOptions.requiredPermission) {
        const requiredPermission = generatorOptions.requiredPermission;
        if (Array.isArray(requiredPermission) || typeof requiredPermission === "string") {
            ret.resolverDecorator = `@RequiredPermission(${JSON.stringify(requiredPermission)}${!hasScopeProp ? `, { skipScopeCheck: true }` : ""})`;
        } else {
            ret.readDecorator = `@RequiredPermission(${JSON.stringify(requiredPermission.read)}${!hasScopeProp ? `, { skipScopeCheck: true }` : ""})`;
            ret.createDecorator = `@RequiredPermission(${JSON.stringify(requiredPermission.create)}${
                !hasScopeProp ? `, { skipScopeCheck: true }` : ""
            })`;
            ret.updateDecorator = `@RequiredPermission(${JSON.stringify(requiredPermission.update)}${
                !hasScopeProp ? `, { skipScopeCheck: true }` : ""
            })`;
            ret.deleteDecorator = `@RequiredPermission(${JSON.stringify(requiredPermission.delete)}${
                !hasScopeProp ? `, { skipScopeCheck: true }` : ""
            })`;
        }
    }
    return ret;
}
