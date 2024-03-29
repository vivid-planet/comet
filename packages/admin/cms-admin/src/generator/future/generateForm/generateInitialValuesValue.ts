import { IntrospectionQuery, IntrospectionTypeRef } from "graphql";
import objectPath from "object-path";

import { FormConfig, FormFieldConfig } from "../generator";
import { RootBlocks } from "../utils/findRootBlocks";

// Retype FormFieldConfig and FormConfig to fix "Type instantiation is excessively deep and possibly infinite."
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormFieldConfig = FormFieldConfig<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormConfig = Omit<FormConfig<any>, "fields"> & { fields: SimpleFormFieldConfig[] };

export function generateInitialValuesValue({
    instanceGqlType,
    fragmentName,
    config,
    rootBlocks,
    gqlIntrospection,
    gqlType,
}: {
    instanceGqlType: string;
    fragmentName: string;
    config: SimpleFormConfig;
    rootBlocks: RootBlocks;
    gqlIntrospection: IntrospectionQuery;
    gqlType: string;
}) {
    // number-fields need to be converted to string to match type
    // block-fields do have some default-config
    // boolean-fields are defaulted to false
    // date-fields need to be converted to Date

    const introspectedType = gqlIntrospection.__schema.types.find((type) => type.name === gqlType);
    if (!introspectedType || introspectedType.kind !== "OBJECT") throw new Error(`kind of ${gqlType} is not object, but should be.`); // this should not happen

    const booleanFields = config.fields.filter((field) => field.type == "boolean");

    const fieldsObject: FieldsObjectType = config.fields.reduce((acc, field) => {
        if (field.type !== "number" && field.type !== "date") return acc;

        objectPath.set(acc, field.name, { fieldConfig: field, isFieldObject: true });
        return acc;
    }, {});

    return `React.useMemo<Partial<FormValues>>(() => {
        const filteredData = data ? filter<GQL${fragmentName}Fragment>(${instanceGqlType}FormFragment, data.${instanceGqlType}) : undefined;
        ${
            booleanFields.length || Object.keys(rootBlocks).length
                ? `if (!filteredData) {
                        return {
                            ${booleanFields.map((field) => `${String(field.name)}: false,`).join("\n")}
                            ${Object.keys(rootBlocks)
                                .map((rootBlockKey) => `${rootBlockKey}: rootBlocks.${rootBlockKey}.defaultValues(),`)
                                .join("\n")}
                        };
                    }`
                : `if (!filteredData) return {};`
        }
        
        return {
            ...filteredData,
            ${generateInitialValuesStringForNestedObject({ path: "filteredData", object: fieldsObject, typeRef: introspectedType, gqlIntrospection })}
            ${Object.keys(rootBlocks)
                .map((rootBlockKey) => `${rootBlockKey}: rootBlocks.${rootBlockKey}.input2State(filteredData.${rootBlockKey}),`)
                .join("\n")}
        };
    }, [data])`;
}

type FieldsObjectType = { [key: string]: FieldsObjectType | { fieldConfig: SimpleFormFieldConfig; isFieldObject: true } };
function generateInitialValuesStringForNestedObject({
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
                    assignment = `String(${path}.${key})`;
                } else if (fieldConfig.type === "date") {
                    assignment = `new Date(${path}.${key})`;
                } else {
                    throw new Error(`Field of type ${fieldConfig.type} currently not supported.`);
                }
            } else {
                assignment = `{
                    ...${path}.${key},
                    ${generateInitialValuesStringForNestedObject({
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
