export type FieldsObjectType = { [key: string]: FieldsObjectType | string };
export function convertObjectToStructuredString(obj: FieldsObjectType) {
    let ret = "";
    let prefixField = "";
    for (const key in obj) {
        const valueForKey = obj[key];
        if (typeof valueForKey === "string") {
            ret += `${prefixField}${key}${valueForKey}`;
        } else {
            ret += `${prefixField}${key}: { ${convertObjectToStructuredString(valueForKey)} }`;
        }
        prefixField = " ";
    }
    return ret;
}
