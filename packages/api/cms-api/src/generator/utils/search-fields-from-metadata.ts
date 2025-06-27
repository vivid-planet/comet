import { EntityMetadata } from "@mikro-orm/core";

import { hasFieldFeature } from "../crud-generator.decorator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCrudSearchFieldsFromMetadata(metadata: EntityMetadata<any>) {
    return metadata.props
        .filter((prop) => prop.name != "status")
        .filter((prop) => hasFieldFeature(metadata.class, prop.name, "search") && !prop.name.startsWith("scope_"))
        .reduce((acc, prop) => {
            if ((prop.type === "string" || prop.type === "text") && !prop.columnTypes.includes("uuid")) {
                acc.push(prop.name);
            } else if (prop.reference == "m:1") {
                if (!prop.targetMeta) {
                    throw new Error(`reference ${prop.name} has no targetMeta`);
                }
                prop.targetMeta.props
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    .filter((innerProp) => hasFieldFeature(prop.targetMeta!.class, innerProp.name, "search") && !innerProp.name.startsWith("scope_"))
                    .forEach((innerProp) => {
                        if ((innerProp.type === "string" || innerProp.type === "text") && !innerProp.columnTypes.includes("uuid")) {
                            acc.push(`${prop.name}.${innerProp.name}`);
                        }
                    });
            }
            return acc;
        }, [] as string[]);
}
