import objectPath from "object-path";

import { FormConfig, FormFieldConfig } from "../generator";
import { convertObjectToStructuredString, FieldsObjectType } from "./convertObjectToStructuredString";
import { RootBlocks } from "./findRootBlocks";
import { getRootProps } from "./generateFieldList";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormFieldConfig = FormFieldConfig<any> & { name: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormConfig = Omit<FormConfig<any>, "fields"> & { fields: SimpleFormFieldConfig[] };

export function generateOutputObject({ config, rootBlocks }: { config: SimpleFormConfig; rootBlocks: RootBlocks }) {
    const numberFields = config.fields.filter((field) => field.type == "number" && !field.name.includes("."));
    const asyncSelectFields = config.fields.filter((field) => field.type === "asyncSelect");
    const nestedNumberFields = config.fields.filter((field) => field.type === "number" && field.name.includes("."));
    const rootPropsContainingNumberField = getRootProps(nestedNumberFields.map((field) => field.name));
    return `{
        ...formValues,
        ${asyncSelectFields
            .map((field) => {
                return `${field.name}: formValues.${field.name}?.id,`;
            })
            .join("\n")}
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
        ${numberFields
            .map((field) => `${String(field.name)}: formValues.${String(field.name)} ? parseFloat(formValues.${String(field.name)}) : null,`)
            .join("\n")}
        ${Object.keys(rootBlocks)
            .map((rootBlockKey) => `${rootBlockKey}: rootBlocks.${rootBlockKey}.state2Output(formValues.${rootBlockKey}),`)
            .join("\n")}
    }`;
}
