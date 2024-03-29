import { IntrospectionQuery, IntrospectionTypeRef } from "graphql";
import objectPath from "object-path";

import { FormConfig, FormFieldConfig } from "../generator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormFieldConfig = FormFieldConfig<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormConfig = Omit<FormConfig<any>, "fields"> & { fields: SimpleFormFieldConfig[] };

export function generateFormValuesTypeDefinition({
    config,
    fragmentName,
    gqlIntrospection,
    gqlType,
}: {
    config: SimpleFormConfig;
    fragmentName: string;
    gqlIntrospection: IntrospectionQuery;
    gqlType: string;
}) {
    // number need to be types as string to support final-form-number-field features
    // block are special because they need to be converted between input and output.

    const introspectedType = gqlIntrospection.__schema.types.find((type) => type.name === gqlType);
    if (!introspectedType || introspectedType.kind !== "OBJECT") throw new Error(`kind of ${gqlType} is not object, but should be.`); // this should not happen

    const fieldsObject: FieldsObjectType = config.fields.reduce((acc, field) => {
        if (field.type !== "number" && field.type !== "block") return acc;

        objectPath.set(acc, field.name, { fieldConfig: field, isFieldObject: true });
        return acc;
    }, {});

    return Object.keys(fieldsObject).length
        ? generateFormValueStringForNestedObject({
              typeToReplaceFields: `GQL${fragmentName}Fragment`,
              object: fieldsObject,
              typeRef: introspectedType,
              gqlIntrospection,
          })
        : `GQL${fragmentName}Fragment`;
}

type FieldsObjectType = { [key: string]: FieldsObjectType | { fieldConfig: SimpleFormFieldConfig; isFieldObject: true } };
function generateFormValueStringForNestedObject({
    typeToReplaceFields,
    object,
    typeRef,
    gqlIntrospection,
}: {
    typeToReplaceFields: string;
    object: FieldsObjectType;
    typeRef: IntrospectionTypeRef;
    gqlIntrospection: IntrospectionQuery;
}): string {
    if (typeRef.kind === "NON_NULL") typeRef = typeRef.ofType;
    if (typeRef.kind !== "OBJECT") throw new Error(`Type must not be other than OBJECT but is ${typeRef.kind}.`);

    const typeName = typeRef.name;
    const introspectionType = gqlIntrospection.__schema.types.find((type) => type.name === typeName);
    if (!introspectionType || introspectionType.kind !== "OBJECT") throw new Error(`No type found for ${typeName}.`);

    const omitValues = Object.keys(object)
        .map((key) => `"${key}"`)
        .join(" | ");
    return `Omit<${typeToReplaceFields}, ${omitValues}> & {
        ${Object.entries(object)
            .map(([key, value]) => {
                const introspectionField = introspectionType.fields.find((field) => field.name === key);
                if (!introspectionField) throw new Error(`IntrospectionField for ${key} not found.`);

                const isNullable = introspectionField.type.kind !== "NON_NULL";

                let type;
                if (value.isFieldObject) {
                    const fieldConfig = value.fieldConfig as SimpleFormFieldConfig;
                    if (fieldConfig.type === "number") {
                        type = `string`;
                    } else if (fieldConfig.type === "block") {
                        type = `BlockState<typeof rootBlocks.${key}>`;
                    } else {
                        throw new Error(`Field of type ${fieldConfig.type} currently not supported.`);
                    }
                } else {
                    let typeToReplaceFieldsForKey = `${typeToReplaceFields}["${key}"]`;
                    if (isNullable) {
                        typeToReplaceFieldsForKey = `NonNullable<${typeToReplaceFieldsForKey}>`;
                    }
                    type = generateFormValueStringForNestedObject({
                        typeToReplaceFields: typeToReplaceFieldsForKey,
                        object: value as FieldsObjectType,
                        typeRef: introspectionField.type,
                        gqlIntrospection,
                    });
                }
                return `${key}: ${type}${isNullable ? ` | null` : ``}`;
            })
            .join(";\n")};
        }`;
}
