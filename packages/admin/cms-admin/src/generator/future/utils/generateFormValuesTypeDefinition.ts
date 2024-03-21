import { IntrospectionQuery } from "graphql";
import objectPath from "object-path";

import { FormConfig, FormFieldConfig } from "../generator";
import { convertObjectToStructuredString, FieldsObjectType } from "./convertObjectToStructuredString";
import { RootBlocks } from "./findRootBlocks";
import { getRootProps } from "./generateFieldList";
import { isFieldOptional } from "./isFieldOptional";

export function generateFormValuesTypeDefinition({
    config,
    rootBlocks,
    fragmentName,
    gqlIntrospection,
    gqlType,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormConfig<any>;
    rootBlocks: RootBlocks;
    fragmentName: string;
    gqlIntrospection: IntrospectionQuery;
    gqlType: string;
}) {
    const numberFields = config.fields.filter((field) => field.type == "number");
    const rootPropsContainingNumberField = getRootProps(numberFields.map((field) => field.name));
    return `${
        rootPropsContainingNumberField.length > 0
            ? `Omit<GQL${fragmentName}Fragment, ${rootPropsContainingNumberField.map((rootProp) => `"${String(rootProp)}"`).join(" | ")}>`
            : `GQL${fragmentName}Fragment`
    } ${
        rootPropsContainingNumberField.length > 0 || Object.keys(rootBlocks).length > 0
            ? `& {
        ${rootPropsContainingNumberField
            .map((rootProp) => generateFieldTypesStructureForRootProp(rootProp, config.fields, gqlIntrospection, gqlType))
            .join("\n")}
        ${Object.keys(rootBlocks)
            .map((rootBlockKey) => `${rootBlockKey}: BlockState<typeof rootBlocks.${rootBlockKey}>;`)
            .join("\n")}
    }`
            : ""
    }`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateFieldTypesStructureForRootProp(
    rootProp: string,
    fields: FormFieldConfig<any>[],
    gqlIntrospection: IntrospectionQuery,
    gqlType: string,
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isOptional = (fieldConfig: FormFieldConfig<any>) => {
        return isFieldOptional({ config: fieldConfig, gqlIntrospection: gqlIntrospection, gqlType: gqlType });
    };
    const fieldsObject: FieldsObjectType = fields.reduce((acc, field) => {
        if (field.name.includes(rootProp)) {
            if (field.type === "number") {
                objectPath.set(acc, field.name, `${isOptional(field) ? `?` : ``}: string;`);
            } else if (field.type === "text" || field.type === "asyncSelect" || field.type === "staticSelect") {
                objectPath.set(acc, field.name, `${isOptional(field) ? `?` : ``}: string;`);
            } else if (field.type === "date") {
                objectPath.set(acc, field.name, `${isOptional(field) ? `?` : ``}: Date;`);
            } else if (field.type === "boolean") {
                objectPath.set(acc, field.name, `${isOptional(field) ? `?` : ``}: boolean;`);
            } else if (field.type === "block") {
                // TODO how does this type look like? Is this correct?
                objectPath.set(acc, field.name, `${isOptional(field) ? `?` : ``}: BlockState<typeof rootBlocks.${field.name}>`);
            }
        }
        return acc;
    }, {});
    return convertObjectToStructuredString(fieldsObject);
}
