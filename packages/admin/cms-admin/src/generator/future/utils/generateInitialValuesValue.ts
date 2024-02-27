import objectPath from "object-path";

import { FormConfig } from "../generator";
import { convertObjectToStructuredString, FieldsObjectType } from "./convertObjectToStructuredString";
import { RootBlocks } from "./findRootBlocks";
import { getRootProps } from "./generateFieldList";

export function generateInitialValuesValue({
    instanceGqlType,
    fragmentName,
    config,
    rootBlocks,
}: {
    instanceGqlType: string;
    fragmentName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormConfig<any>;
    rootBlocks: RootBlocks;
}) {
    const booleanFields = config.fields.filter((field) => field.type == "boolean");
    const numberFields = config.fields.filter((field) => field.type == "number" && !field.name.includes("."));
    const nestedNumberFields = config.fields.filter((field) => field.type === "number" && field.name.includes("."));
    const rootPropsContainingNumberField = getRootProps(nestedNumberFields.map((field) => field.name));
    return `React.useMemo<Partial<FormValues>>(() => data?.${instanceGqlType}
        ? {
            ...filter<GQL${fragmentName}Fragment>(${instanceGqlType}FormFragment, data.${instanceGqlType}),
            ${rootPropsContainingNumberField
                .map((rootProp) => {
                    const fieldsObject: FieldsObjectType = config.fields.reduce((acc, field) => {
                        if (field.name.includes(rootProp)) {
                            const nameWithoutPrefix = field.name.substring(rootProp.length + 1);
                            if (field.type === "number") {
                                objectPath.set(acc, nameWithoutPrefix, `: String(data.${instanceGqlType}.${field.name}),`);
                            } else {
                                objectPath.set(acc, nameWithoutPrefix, `: data.${instanceGqlType}.${field.name},`);
                            }
                        }
                        return acc;
                    }, {});
                    return `${rootProp}: data.${instanceGqlType}.${rootProp} ? { ${convertObjectToStructuredString(fieldsObject)} } : undefined,`;
                })
                .join("\n")}
            ${numberFields.map((field) => `${String(field.name)}: String(data.${instanceGqlType}.${String(field.name)}),`).join("\n")}
            ${Object.keys(rootBlocks)
                .map((rootBlockKey) => `${rootBlockKey}: rootBlocks.${rootBlockKey}.input2State(data.${instanceGqlType}.${rootBlockKey}),`)
                .join("\n")}
        }
        : {
            ${booleanFields.map((field) => `${String(field.name)}: false,`).join("\n")}
            ${Object.keys(rootBlocks)
                .map((rootBlockKey) => `${rootBlockKey}: rootBlocks.${rootBlockKey}.defaultValues(),`)
                .join("\n")}
        }
    , [data])`;
}
