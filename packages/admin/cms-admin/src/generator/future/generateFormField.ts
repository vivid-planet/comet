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
): GeneratorReturn & { imports: Imports; hooksCode: string; formFragmentField: string; formValueToGqlInputCode: string } {
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
    const gqlDocuments: Record<string, string> = {};
    let hooksCode = "";

    let code = "";
    let formValueToGqlInputCode = "";
    let formFragmentField = name;
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
        formValueToGqlInputCode = `${name}: parseFloat(formValues.${name}),`;
    } else if (config.type == "boolean") {
        code = `<Field name="${name}" label="" type="checkbox" fullWidth>
            {(props) => (
                <FormControlLabel
                    label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}
                    control={<FinalFormCheckbox {...props} />}
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
            />`;
    } else if (config.type == "block") {
        imports.push({
            name: config.block.name,
            importPath: config.block.import,
        });
        code = `<Field name="${name}" isEqual={isEqual}>
            {createFinalFormBlock(${config.block.name})}
        </Field>`;
        formValueToGqlInputCode = `${name}: rootBlocks.${name}.state2Output(formValues.${name}),`;
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
    } else if (config.type == "asyncSelect") {
        if (introspectionFieldType.kind !== "OBJECT") throw new Error(`asyncSelect only supports OBJECT types`);
        const objectType = gqlIntrospection.__schema.types.find((t) => t.kind === "OBJECT" && t.name === introspectionFieldType.name) as
            | IntrospectionObjectType
            | undefined;
        if (!objectType) throw new Error(`Object type ${introspectionFieldType.name} not found for field ${name}`);

        //find labelField: 1. as configured
        let labelField = config.labelField;

        //find labelField: 2. common names (name or title)
        if (!labelField) {
            labelField = objectType.fields.find((field) => {
                let type = field.type;
                if (type.kind == "NON_NULL") type = type.ofType;
                if ((field.name == "name" || field.name == "title") && type.kind == "SCALAR" && type.name == "String") {
                    return true;
                }
            })?.name;
        }

        //find labelField: 3. first string field
        if (!labelField) {
            labelField = objectType.fields.find((field) => {
                let type = field.type;
                if (type.kind == "NON_NULL") type = type.ofType;
                if (field.type.kind == "SCALAR" && field.type.name == "String") {
                    return true;
                }
            })?.name;
        }

        const rootQuery = config.rootQuery; //TODO we should infer a default value from the gql schema
        const queryType = objectType.name;
        const queryVariableName = `${rootQuery}Query`;
        const queryName = rootQuery[0].toUpperCase() + rootQuery.substring(1);
        const fragmentVariableName = `${rootQuery}SelectFragment`;
        const fragmentName = `${objectType.name}Select`;

        formFragmentField = `${name} { id ${labelField} }`;

        gqlDocuments[fragmentVariableName] = `
            fragment ${fragmentName} on ${queryType} {
                id
                ${labelField}
            }
        `;
        gqlDocuments[queryVariableName] = `query ${queryName} {
            ${rootQuery} {
                nodes {
                    ...${fragmentName}
                }
            }
        }
        \${${fragmentVariableName}}
        `;

        imports.push({
            name: "useAsyncOptionsProps",
            importPath: "@comet/admin",
        });
        hooksCode += `const ${name}SelectAsyncProps = useAsyncOptionsProps(async () => {
            const result = await client.query<GQL${queryName}Query, GQL${queryName}QueryVariables>({ query: ${queryVariableName} });
            return result.data.${rootQuery}.nodes;
        });`;

        formValueToGqlInputCode = `${name}: formValues.${name}?.id,`;

        code = `<Field
                fullWidth
                name="${name}"
                label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}
                component={FinalFormSelect}
                {...${name}SelectAsyncProps}
                getOptionLabel={(option: GQL${fragmentName}Fragment) => option.${labelField}}
            />`;
    } else {
        throw new Error(`Unsupported type`);
    }
    return {
        code,
        hooksCode,
        formValueToGqlInputCode,
        formFragmentField,
        gqlDocuments,
        imports,
    };
}
