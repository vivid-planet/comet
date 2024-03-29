import { IntrospectionQuery, IntrospectionTypeRef } from "graphql";
import objectPath from "object-path";

import { FormConfig, FormFieldConfig } from "../generator";
import { RootBlocks } from "./findRootBlocks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormFieldConfig = FormFieldConfig<any> & { name: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormConfig = Omit<FormConfig<any>, "fields"> & { fields: SimpleFormFieldConfig[] };

export function generateOutputObject({
    config,
    rootBlocks,
    gqlIntrospection,
    gqlType,
}: {
    config: SimpleFormConfig;
    rootBlocks: RootBlocks;
    gqlIntrospection: IntrospectionQuery;
    gqlType: string;
}) {
    // number-fields need to be converted into number again
    // asyncSelect-fields need to use field.id
    // block-fields need to be converted from state2Output

    const introspectedType = gqlIntrospection.__schema.types.find((type) => type.name === gqlType);
    if (!introspectedType || introspectedType.kind !== "OBJECT") throw new Error(`kind of ${gqlType} is not object, but should be.`); // this should not happen

    const fieldsObject: FieldsObjectType = config.fields.reduce((acc, field) => {
        if (field.type !== "number" && field.type !== "asyncSelect") return acc;

        objectPath.set(acc, field.name, { fieldConfig: field, isFieldObject: true });
        return acc;
    }, {});

    return `{
        ...formValues,
        ${generateOutputObjectStringForNestedObject({ path: "formValues", object: fieldsObject, typeRef: introspectedType, gqlIntrospection })}
        ${Object.keys(rootBlocks)
            .map((rootBlockKey) => `${rootBlockKey}: rootBlocks.${rootBlockKey}.state2Output(formValues.${rootBlockKey}),`)
            .join("\n")}
    }`;
}

type FieldsObjectType = { [key: string]: FieldsObjectType | { fieldConfig: SimpleFormFieldConfig; isFieldObject: true } };
function generateOutputObjectStringForNestedObject({
    path,
    object,
    typeRef,
    gqlIntrospection,
}: {
    path: string;
    object: FieldsObjectType;
    typeRef: IntrospectionTypeRef;
    gqlIntrospection: IntrospectionQuery;
}): string {
    if (typeRef.kind === "NON_NULL") typeRef = typeRef.ofType;
    if (typeRef.kind !== "OBJECT") throw new Error(`Type must not be other than OBJECT but is ${typeRef.kind}.`);

    const typeName = typeRef.name;
    const introspectionType = gqlIntrospection.__schema.types.find((type) => type.name === typeName);
    if (!introspectionType || introspectionType.kind !== "OBJECT") throw new Error(`No type found for ${typeName}.`);

    return `${Object.entries(object)
        .map(([key, value]) => {
            const introspectionField = introspectionType.fields.find((field) => field.name === key);
            if (!introspectionField) throw new Error(`IntrospectionField for ${key} not found.`);

            const isNullable = introspectionField.type.kind !== "NON_NULL";

            let assignment;
            if (value.isFieldObject) {
                const fieldConfig = value.fieldConfig as SimpleFormFieldConfig;
                if (fieldConfig.type === "number") {
                    assignment = `parseInt(${path}.${key})`;
                } else if (fieldConfig.type === "asyncSelect") {
                    assignment = `${path}.${key}?.id`;
                } else {
                    throw new Error(`Field of type ${fieldConfig.type} currently not supported.`);
                }
            } else {
                assignment = `{
                    ...${path}.${key},
                    ${generateOutputObjectStringForNestedObject({
                        path: `${path}.${key}`,
                        object: value as FieldsObjectType,
                        typeRef: introspectionField.type,
                        gqlIntrospection,
                    })}
                }`;
            }
            if (isNullable) {
                assignment = `${path}.${key} ? ${assignment} : null`;
            }
            return `${key}: ${assignment}`;
        })
        .join(",\n")},`;
}
