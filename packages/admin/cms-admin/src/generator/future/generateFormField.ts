import { IntrospectionEnumType, IntrospectionNamedTypeRef, IntrospectionQuery } from "graphql";

import { FormConfigInternal, FormFieldConfigInternal, GeneratorReturn } from "./generator";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { generateFieldListFromIntrospection } from "./utils/generateFieldList";
import { Imports } from "./utils/generateImportsCode";

export function generateFormField(
    { gqlIntrospection }: { gqlIntrospection: IntrospectionQuery },
    config: FormFieldConfigInternal,
    formConfig: FormConfigInternal,
): GeneratorReturn & { imports: Imports } {
    const gqlType = formConfig.gqlType;
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);

    const name = String(config.name);
    const label = config.label ?? camelCaseToHumanReadable(name);

    const introspectedTypes = gqlIntrospection.__schema.types;
    const introspectionObject = introspectedTypes.find((type) => type.kind === "OBJECT" && type.name === gqlType);
    if (!introspectionObject || introspectionObject.kind !== "OBJECT") throw new Error(`didn't find object ${gqlType} in gql introspection`);

    const introspectedFields = generateFieldListFromIntrospection(gqlIntrospection, gqlType);

    const introspectionFieldWithPath = introspectedFields.find((field) => field.path === name);
    if (!introspectionFieldWithPath) throw new Error(`didn't find field ${name} in gql introspection type ${gqlType}`);
    const introspectionField = introspectionFieldWithPath.field;
    const introspectionFieldType = introspectionField.type.kind === "NON_NULL" ? introspectionField.type.ofType : introspectionField.type;

    const requiredByIntrospection = introspectionField.type.kind == "NON_NULL";

    const required = config.required ?? requiredByIntrospection; //if undefined default to requiredByIntrospection

    //TODO verify introspectionField.type is compatbile with config.type

    const imports: Imports = [];
    let code = "";
    if (config.type == "text") {
        code = `
        <Field
            ${required ? "required" : ""}
            ${config.multiline ? "multiline" : ""}
            fullWidth
            name="${name}"
            component={FinalFormInput}
            label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}
        />`;
    } else if (config.type == "number") {
        code = `
            <Field
                ${required ? "required" : ""}
                fullWidth
                name="${name}"
                component={FinalFormInput}
                type="number"
                label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}
            />`;
        //TODO MUI suggest not using type=number https://mui.com/material-ui/react-text-field/#type-quot-number-quot
    } else if (config.type == "boolean") {
        code = `<Field name="${name}" label="" type="checkbox" fullWidth>
            {(props) => (
                <FormControlLabel
                    label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}
                    control={<FinalFormCheckbox {...props} />}
                />
            )}
        </Field>`;
    } else if (config.type == "block") {
        imports.push({
            name: config.block.name,
            importPath: config.block.import,
        });
        code = `<Field name="${name}" isEqual={isEqual}>
            {createFinalFormBlock(${config.block.name})}
        </Field>`;
    } else if (config.type == "staticSelect") {
        const enumType = gqlIntrospection.__schema.types.find(
            (t) => t.kind === "ENUM" && t.name === (introspectionFieldType as IntrospectionNamedTypeRef).name,
        ) as IntrospectionEnumType | undefined;
        if (!enumType) throw new Error(`Enum type ${(introspectionFieldType as IntrospectionNamedTypeRef).name} not found for field ${name}`);
        const values = enumType.enumValues.map((i) => i.name);
        // TODO use values from config.values if present
        code = `<Field
            fullWidth
            name="${name}"
            label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}>
            {(props) => 
                <FinalFormSelect {...props}>
                ${values
                    .map((value) => {
                        const id = `${instanceGqlType}.${name}.${value.charAt(0).toLowerCase() + value.slice(1)}`;
                        const label = `<FormattedMessage id="${id}" defaultMessage="${camelCaseToHumanReadable(value)}" />`;
                        return `<MenuItem value="${value}">${label}</MenuItem>`;
                    })
                    .join("\n")}
                </FinalFormSelect>
            }
        </Field>`;
    } else {
        throw new Error(`Unsupported type: ${config.type}`);
    }
    return {
        code,
        gqlQueries: {},
        imports,
    };
}
