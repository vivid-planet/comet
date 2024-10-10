import { IntrospectionQuery } from "graphql";

import { FormFieldConfig } from "../generator";

export const isFieldOptional = ({
    config,
    gqlFieldName,
    gqlIntrospection,
    gqlType,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormFieldConfig<any>;
    gqlFieldName: string;
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
    const fieldDef = schemaEntity.fields.find((field) => field.name === gqlFieldName);
    if (!fieldDef) throw new Error(`didn't find field ${gqlFieldName} of ${gqlType} in introspected gql-schema.`);
    return fieldDef.type.kind !== "NON_NULL";
};
