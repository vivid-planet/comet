import objectPath from "object-path";

import { type ActionsGridColumnConfig, type GridColumnConfig, type VirtualGridColumnConfig } from "../generate-command";

type FieldsObjectType = { [key: string]: FieldsObjectType | boolean | string };
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

export function generateGqlFieldList({
    columns,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: Array<GridColumnConfig<any> | ActionsGridColumnConfig | VirtualGridColumnConfig<any>>;
}) {
    const fieldsObject: FieldsObjectType = columns.reduce<FieldsObjectType>((acc, field) => {
        if (field.type !== "actions") {
            let hasCustomFields = false;

            if ("titleField" in field && field.titleField) {
                objectPath.set(acc, `${field.name}.${field.titleField}`, true);
                hasCustomFields = true;
            }

            if ("queryFields" in field) {
                field.queryFields?.forEach((queryField) => {
                    objectPath.set(acc, queryField, true);
                });
                hasCustomFields = true;
            }

            if (!hasCustomFields) {
                objectPath.set(acc, field.name, true);
            }
        }
        return acc;
    }, {});
    return recursiveStringify(fieldsObject);
}
