import { IntrospectionQuery } from "graphql";
import objectPath from "object-path";

import { FormConfig, FormFieldConfig } from "../generator";
import { convertObjectToStructuredString, FieldsObjectType } from "./convertObjectToStructuredString";
import { RootBlocks } from "./findRootBlocks";
import { getRootProps } from "./generateFieldList";
import { isFieldOptional } from "./isFieldOptional";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormFieldConfig = FormFieldConfig<any> & { name: string };
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
    const booleanFields = config.fields.filter((field) => field.type == "boolean");
    const numberFields = config.fields.filter((field) => field.type == "number" && !field.name.includes("."));
    const nestedNumberFields = config.fields.filter((field) => field.type === "number" && field.name.includes("."));
    const rootPropsContainingNumberField = getRootProps(nestedNumberFields.map((field) => field.name));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isOptional = (fieldConfig: FormFieldConfig<any>) => {
        return isFieldOptional({ config: fieldConfig, gqlIntrospection: gqlIntrospection, gqlType: gqlType });
    };
    return `React.useMemo<Partial<FormValues>>(() => data?.${instanceGqlType}
        ? {
            ...filter<GQL${fragmentName}Fragment>(${instanceGqlType}FormFragment, data.${instanceGqlType}),
            ${rootPropsContainingNumberField
                .map((rootProp) => {
                    const fieldsObject: FieldsObjectType = config.fields.reduce((acc, field) => {
                        if (field.name.includes(rootProp)) {
                            const nameWithoutPrefix = field.name.substring(rootProp.length + 1);
                            let assignment =
                                field.type === "number" ? `String(data.${instanceGqlType}.${field.name})` : `data.${instanceGqlType}.${field.name}`;
                            if (isOptional(field)) {
                                assignment = `data.${instanceGqlType}.${String(field.name)} ? ${assignment} : undefined`;
                            }
                            objectPath.set(acc, nameWithoutPrefix, `: ${assignment},`);
                        }
                        return acc;
                    }, {});
                    return `${rootProp}: data.${instanceGqlType}.${rootProp} ? { ${convertObjectToStructuredString(fieldsObject)} } : undefined,`;
                })
                .join("\n")}
            ${numberFields
                .map((field) => {
                    let assignment = `String(data.${instanceGqlType}.${String(field.name)})`;
                    if (isOptional(field)) {
                        assignment = `data.${instanceGqlType}.${String(field.name)} ? ${assignment} : undefined`;
                    }
                    return `${String(field.name)}: ${assignment},`;
                })
                .join("\n")}
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
