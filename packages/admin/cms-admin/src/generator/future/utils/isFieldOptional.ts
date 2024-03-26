import { IntrospectionQuery } from "graphql";

import { FormFieldConfig } from "../generator";

export const isFieldOptional = ({
    config,
    gqlIntrospection,
    gqlType,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormFieldConfig<any>;
    gqlIntrospection: IntrospectionQuery;
    gqlType: string;
}): boolean => {
    if (config.required !== undefined) {
        return !config.required;
    }

    if (config.readOnly) {
        return true;
    }

    const schemaEntity = gqlIntrospection.__schema.types.find((type) => type.kind === "OBJECT" && type.name === gqlType);
    if (!schemaEntity) throw new Error(`didn't find entity ${gqlType} in schema types`);
    if (schemaEntity.kind !== "OBJECT") throw new Error(`kind of ${gqlType} is not object, but should be.`); // this should not happen

    let isOptional = true;
    let currentObjectType = schemaEntity;
    for (const pathPart of String(config.name).split(".")) {
        const fieldDef = currentObjectType.fields.find((field) => {
            return field.name === pathPart;
        });
        if (!fieldDef) throw new Error(`didn't find field ${String(config.name)} of ${gqlType} in introspected gql-schema.`);
        const fieldType = fieldDef.type;

        // nested types are either OBJECT or NON_NULL->OBJECT
        if (fieldType.kind === "OBJECT") {
            // object is optional, check deeper if further parts are required
            const objectType = gqlIntrospection.__schema.types.find((type) => type.kind === "OBJECT" && type.name === fieldType.name);
            if (!objectType || objectType.kind !== "OBJECT") {
                throw new Error(`didn't find type ${fieldDef.name} of ${String(config.name)} in introspected gql-schema.`);
            }

            currentObjectType = objectType;
        } else if (fieldType.kind === "NON_NULL") {
            isOptional = false;
            break;
        }
    }

    return isOptional;
};
