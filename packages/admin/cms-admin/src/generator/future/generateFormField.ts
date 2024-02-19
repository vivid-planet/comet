import { IntrospectionEnumType, IntrospectionNamedTypeRef, IntrospectionObjectType, IntrospectionQuery } from "graphql";

import { FormConfig, FormFieldConfig, GeneratorReturn } from "./generator";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { Imports } from "./utils/generateImportsCode";

export function generateFormField(
    { gqlIntrospection }: { gqlIntrospection: IntrospectionQuery },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormFieldConfig<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig: FormConfig<any>,
): GeneratorReturn & { imports: Imports } {
    const gqlType = formConfig.gqlType;
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);

    const name = String(config.name);
    const label = config.label ?? camelCaseToHumanReadable(name);

    const introspectionObject = gqlIntrospection.__schema.types.find((type) => type.kind === "OBJECT" && type.name === gqlType) as
        | IntrospectionObjectType
        | undefined;
    if (!introspectionObject) throw new Error(`didn't find object ${gqlType} in gql introspection`);

    const introspectionField = introspectionObject.fields.find((field) => field.name === name);
    if (!introspectionField) throw new Error(`didn't find field ${name} in gql introspection type ${gqlType}`);
    const introspectionFieldType = introspectionField.type.kind === "NON_NULL" ? introspectionField.type.ofType : introspectionField.type;

    const requiredByIntrospection = introspectionField.type.kind == "NON_NULL";

    const required = config.required ?? requiredByIntrospection; //if undefined default to requiredByIntrospection

    //TODO verify introspectionField.type is compatbile with config.type

    const imports: Imports = [];

    let validateCode = "";
    if (config.validate) {
        let importPath = config.validate.import;
        if (importPath.startsWith("./")) {
            //go one level up as generated files are in generated subfolder
            importPath = `.${importPath}`;
        }
        imports.push({
            name: config.validate.name,
            importPath,
        });
        validateCode = `validate={${config.validate.name}}`;
    }

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
            ${
                config.helperText
                    ? `helperText={<FormattedMessage id=` + `"${instanceGqlType}.${name}.helperText" ` + `defaultMessage="${config.helperText}" />}`
                    : ""
            }
            ${validateCode}
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
                ${
                    config.helperText
                        ? `helperText={<FormattedMessage id=` +
                          `"${instanceGqlType}.${name}.helperText" ` +
                          `defaultMessage="${config.helperText}" />}`
                        : ""
                }
                ${validateCode}
            />`;
        //TODO MUI suggest not using type=number https://mui.com/material-ui/react-text-field/#type-quot-number-quot
    } else if (config.type == "boolean") {
        code = `<Field name="${name}" label="" type="checkbox" fullWidth ${validateCode}>
            {(props) => (
                <FormControlLabel
                    label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}
                    control={<FinalFormCheckbox {...props} />}
                    ${
                        config.helperText
                            ? `helperText={<FormattedMessage id=` +
                              `"${instanceGqlType}.${name}.helperText" ` +
                              `defaultMessage="${config.helperText}" />}`
                            : ""
                    }
                />
            )}
        </Field>`;
    } else if (config.type == "date") {
        code = `
            <Field
                ${required ? "required" : ""}
                fullWidth
                name="${name}"
                component={FinalFormDatePicker}
                label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}
                ${
                    config.helperText
                        ? `helperText={<FormattedMessage id=` +
                          `"${instanceGqlType}.${name}.helperText" ` +
                          `defaultMessage="${config.helperText}" />}`
                        : ""
                }
                ${validateCode}
            />`;
    } else if (config.type == "block") {
        imports.push({
            name: config.block.name,
            importPath: config.block.import,
        });
        code = `<Field name="${name}" isEqual={isEqual}>
            {createFinalFormBlock(${config.block.name})}
        </Field>`;
    } else if (config.type == "staticSelect") {
        if (config.values) {
            throw new Error("custom values for staticSelect is not yet supported"); // TODO add support
        }
        const enumType = gqlIntrospection.__schema.types.find(
            (t) => t.kind === "ENUM" && t.name === (introspectionFieldType as IntrospectionNamedTypeRef).name,
        ) as IntrospectionEnumType | undefined;
        if (!enumType) throw new Error(`Enum type ${(introspectionFieldType as IntrospectionNamedTypeRef).name} not found for field ${name}`);
        const values = enumType.enumValues.map((i) => i.name);
        code = `<Field
            fullWidth
            name="${name}"
            label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}>
            ${
                config.helperText
                    ? `helperText={<FormattedMessage id=` + `"${instanceGqlType}.${name}.helperText" ` + `defaultMessage="${config.helperText}" />}`
                    : ""
            }
            ${validateCode}
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
        gqlDocuments: {},
        imports,
    };
}
