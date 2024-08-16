import objectPath from "object-path";

import { GridColumnConfig } from "../generator";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateGqlFieldList({ columns }: { columns: GridColumnConfig<any>[] }) {
    const fieldsObject: FieldsObjectType = columns.reduce<FieldsObjectType>((acc, field) => {
        objectPath.set(acc, field.name, true);
        return acc;
    }, {});
    return recursiveStringify(fieldsObject);
}
