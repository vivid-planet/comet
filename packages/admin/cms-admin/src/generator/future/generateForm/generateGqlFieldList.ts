import { IntrospectionObjectType, IntrospectionQuery } from "graphql";
import objectPath from "object-path";

import { generateFieldListFromIntrospection } from "../generateFormField/generateFieldList";
import { FormFieldConfig } from "../generator";

type FieldsObjectType = { [key: string]: FieldsObjectType | boolean | string };
export function generateGqlFieldList({
    fields,
    gqlType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: FormFieldConfig<any>[];
    gqlType: string;
    gqlIntrospection: IntrospectionQuery;
}) {
    const fieldsObject: FieldsObjectType = fields.reduce<FieldsObjectType>((acc, field) => {
        if (field.type === "asyncSelect") {
            const name = String(field.name);
            const introspectedFields = generateFieldListFromIntrospection(gqlIntrospection, gqlType);
            const introspectionFieldWithPath = introspectedFields.find((field) => field.path === name);
            if (!introspectionFieldWithPath) throw new Error(`didn't find field ${name} in gql introspection type ${gqlType}`);
            const introspectionField = introspectionFieldWithPath.field;
            const introspectionFieldType = introspectionField.type.kind === "NON_NULL" ? introspectionField.type.ofType : introspectionField.type;

            if (introspectionFieldType.kind !== "OBJECT") throw new Error(`asyncSelect only supports OBJECT types`);
            const objectType = gqlIntrospection.__schema.types.find((t) => t.kind === "OBJECT" && t.name === introspectionFieldType.name) as
                | IntrospectionObjectType
                | undefined;
            if (!objectType) throw new Error(`Object type ${introspectionFieldType.name} not found for field ${name}`);

            //find labelField: 1. as configured
            let labelField = field.labelField;

            //find labelField: 2. common names (name or title)
            if (!labelField) {
                labelField = objectType.fields.find((field) => {
                    let type = field.type;
                    if (type.kind == "NON_NULL") type = type.ofType;
                    if ((field.name == "name" || field.name == "title") && type.kind == "SCALAR" && type.name == "String") {
                        return true;
                    }
                })?.name;
            }

            //find labelField: 3. first string field
            if (!labelField) {
                labelField = objectType.fields.find((field) => {
                    let type = field.type;
                    if (type.kind == "NON_NULL") type = type.ofType;
                    if (field.type.kind == "SCALAR" && field.type.name == "String") {
                        return true;
                    }
                })?.name;
            }
            objectPath.set(acc, field.name, ` { id ${labelField} }`);
        } else {
            objectPath.set(acc, field.name, true);
        }
        return acc;
    }, {});
    return recursiveStringify(fieldsObject);
}

const recursiveStringify = (obj: FieldsObjectType): string => {
    let ret = "";
    let prefixField = "";
    for (const key in obj) {
        const valueForKey = obj[key];
        if (typeof valueForKey === "boolean") {
            ret += `${prefixField}${key}`;
        } else if (typeof valueForKey === "string") {
            ret += `${prefixField}${key}${valueForKey}`;
        } else {
            ret += `${prefixField}${key} { ${recursiveStringify(valueForKey)} }`;
        }
        prefixField = " ";
    }
    return ret;
};
