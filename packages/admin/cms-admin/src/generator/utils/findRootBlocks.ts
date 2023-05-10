import { existsSync } from "fs";
import { IntrospectionObjectType, IntrospectionQuery } from "graphql";

import { CrudGeneratorConfig } from "../types";

const fallbackLibraryBlocks: { [key: string]: string } = {
    DamImageBlock: "@comet/cms-admin",
};

export function findRootBlocks({ entityName, ...generatorOptions }: CrudGeneratorConfig, schema: IntrospectionQuery) {
    const ret = generatorOptions.rootBlocks || {};

    const schemaEntity = schema.__schema.types.find((type) => type.kind === "OBJECT" && type.name === entityName) as
        | IntrospectionObjectType
        | undefined;
    if (!schemaEntity) throw new Error("didn't find entity in schema types");
    schemaEntity.fields.forEach((field) => {
        if (ret[field.name]) return; // already defined
        let type = field.type;
        if (type.kind == "NON_NULL") type = type.ofType;
        if (type.kind == "SCALAR" && type.name.endsWith("BlockData")) {
            let match = false;
            const blockName = `${type.name.replace(/BlockData$/, "")}Block`;
            const checkNames = [
                {
                    folderName: `${generatorOptions.target.replace(/\/generated$/, "")}/blocks`,
                    import: `../blocks/${blockName}`,
                },
                {
                    folderName: `src/common/blocks`,
                    import: `@src/common/blocks/${blockName}`,
                },
            ];
            for (const checkName of checkNames) {
                if (existsSync(`${checkName.folderName}/${blockName}.tsx`)) {
                    match = true;
                    ret[field.name] = {
                        import: checkName.import,
                        name: blockName,
                    };
                    break;
                }
            }
            if (!match) {
                const fallback = fallbackLibraryBlocks[blockName];
                if (fallback) {
                    ret[field.name] = {
                        import: fallback,
                        name: blockName,
                    };
                    match = true;
                }
            }
            if (!match) {
                throw new Error(`Didn't find admin block for ${blockName} in ${checkNames.map((c) => c.folderName).join(" or ")}`);
            }
        }
    });

    return ret;
}
