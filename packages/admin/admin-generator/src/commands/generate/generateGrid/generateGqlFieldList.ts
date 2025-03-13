import objectPath from "object-path";

import { type ActionsGridColumnConfig, type GridColumnConfig } from "../generate-command";
import { getAllColumnFieldNames, type GridCombinationColumnConfig } from "./combinationColumn";

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
    columns: Array<GridColumnConfig<any> | GridCombinationColumnConfig<string> | ActionsGridColumnConfig>;
}) {
    const fieldsObject: FieldsObjectType = columns.reduce<FieldsObjectType>((acc, field) => {
        if (field.type !== "actions") {
            if (field.type === "combination") {
                getAllColumnFieldNames(field).map((fieldName) => {
                    objectPath.set(acc, fieldName, true);
                });
            } else {
                objectPath.set(acc, field.name, true);
            }
        }
        return acc;
    }, {});
    return recursiveStringify(fieldsObject);
}
