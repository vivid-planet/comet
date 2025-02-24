import { type EntityMetadata } from "@mikro-orm/postgresql";

import { type CrudFieldOptions } from "../decorators/crud-generator.decorator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasCrudFieldFeature(metadataClass: any, propName: string, option: keyof CrudFieldOptions): boolean {
    const crudField = (Reflect.getMetadata(`data:crudField`, metadataClass, propName) ?? {}) as CrudFieldOptions;
    const defaultValue = option == "dedicatedResolverArg" ? false : true;
    return crudField[option] ?? defaultValue;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCrudSearchFieldsFromMetadata(metadata: EntityMetadata<any>) {
    return metadata.props
        .filter((prop) => prop.name != "status")
        .filter((prop) => hasCrudFieldFeature(metadata.class, prop.name, "search") && !prop.name.startsWith("scope_"))
        .reduce((acc, prop) => {
            if (prop.type === "string" || prop.type === "text") {
                acc.push(prop.name);
            } else if (prop.kind == "m:1") {
                if (!prop.targetMeta) {
                    throw new Error(`reference ${prop.name} has no targetMeta`);
                }
                prop.targetMeta.props
                    .filter(
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        (innerProp) => hasCrudFieldFeature(prop.targetMeta!.class, innerProp.name, "search") && !innerProp.name.startsWith("scope_"),
                    )
                    .forEach((innerProp) => {
                        if (innerProp.type === "string" || innerProp.type === "text") {
                            acc.push(`${prop.name}.${innerProp.name}`);
                        }
                    });
            }
            return acc;
        }, [] as string[]);
}
