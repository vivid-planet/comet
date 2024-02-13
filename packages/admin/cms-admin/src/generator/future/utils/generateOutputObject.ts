import objectPath from "object-path";

import { FormConfigInternal } from "../generator";
import { convertObjectToStructuredString, FieldsObjectType } from "./convertObjectToStructuredString";
import { RootBlocks } from "./findRootBlocks";
import { getRootProps } from "./generateFieldList";

export function generateOutputObject({ config, rootBlocks }: { config: FormConfigInternal; rootBlocks: RootBlocks }) {
    const numberFields = config.fields.filter((field) => field.type == "number" && !field.name.includes("."));
    const nestedNumberFields = config.fields.filter((field) => field.type === "number" && field.name.includes("."));
    const rootPropsContainingNumberField = getRootProps(nestedNumberFields.map((field) => field.name));
    return `{
        ...formValues,
        ${rootPropsContainingNumberField
            .map((rootProp) => {
                const fieldsObject: FieldsObjectType = config.fields.reduce((acc, field) => {
                    if (field.name.includes(rootProp)) {
                        const nameWithoutPrefix = field.name.substring(rootProp.length + 1);
                        if (field.type === "number") {
                            objectPath.set(acc, nameWithoutPrefix, `: parseFloat(formValues.${field.name}),`);
                        } else {
                            objectPath.set(acc, nameWithoutPrefix, `: formValues.${field.name},`);
                        }
                    }
                    return acc;
                }, {});
                return `${rootProp}: { ${convertObjectToStructuredString(fieldsObject)} },`;
            })
            .join("\n")}
        ${numberFields.map((field) => `${String(field.name)}: parseFloat(formValues.${String(field.name)}),`).join("\n")}
        ${Object.keys(rootBlocks)
            .map((rootBlockKey) => `${rootBlockKey}: rootBlocks.${rootBlockKey}.state2Output(formValues.${rootBlockKey}),`)
            .join("\n")}
    }`;
}
