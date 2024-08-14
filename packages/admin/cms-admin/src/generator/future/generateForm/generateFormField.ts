import { IntrospectionEnumType, IntrospectionNamedTypeRef, IntrospectionObjectType, IntrospectionQuery } from "graphql";

import { FormConfig, FormFieldConfig } from "../generator";
import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { findQueryTypeOrThrow } from "../utils/findQueryType";
import { Imports } from "../utils/generateImportsCode";
import { isFieldOptional } from "../utils/isFieldOptional";
import { findFieldByName, GenerateFieldsReturn } from "./generateFields";

export function generateFormField({
    gqlIntrospection,
    baseOutputFilename,
    config,
    formConfig,
    gqlType,
    namePrefix,
}: {
    gqlIntrospection: IntrospectionQuery;
    baseOutputFilename: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormFieldConfig<any>;
    formFragmentName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig: FormConfig<any>;
    gqlType: string;
    namePrefix?: string;
}): GenerateFieldsReturn {
    const rootGqlType = formConfig.gqlType;
    const formattedMessageRootId = rootGqlType[0].toLowerCase() + rootGqlType.substring(1);
    const dataRootName = rootGqlType[0].toLowerCase() + rootGqlType.substring(1); // TODO should probably be deteced via query

    const name = String(config.name);
    const nameWithPrefix = `${namePrefix ? `${namePrefix}.` : ``}${name}`;

    let gqlFieldName = name;
    if (config.type === "asyncSelect" && config.gqlFieldName) {
        gqlFieldName = String(config.gqlFieldName);
    }

    const label = config.label ?? camelCaseToHumanReadable(name);

    const introspectionObject = gqlIntrospection.__schema.types.find((type) => type.kind === "OBJECT" && type.name === gqlType) as
        | IntrospectionObjectType
        | undefined;
    if (!introspectionObject) throw new Error(`didn't find object ${gqlType} in gql introspection`);

    const introspectionField = introspectionObject.fields.find((field) => field.name === gqlFieldName);
    if (!introspectionField) throw new Error(`didn't find field ${gqlFieldName} in gql introspection type ${gqlType}`);
    const introspectionFieldType = introspectionField.type.kind === "NON_NULL" ? introspectionField.type.ofType : introspectionField.type;

    const required = !isFieldOptional({ config, gqlFieldName, gqlIntrospection, gqlType });

    //TODO verify introspectionField.type is compatbile with config.type

    const endAdornmentWithLockIconProp = `endAdornment={<InputAdornment position="end"><Lock /></InputAdornment>}`;
    const readOnlyProps = `readOnly disabled`;
    const readOnlyPropsWithLock = `${readOnlyProps} ${endAdornmentWithLockIconProp}`;

    const imports: Imports = [];
    const defaultFormValuesConfig: GenerateFieldsReturn["formValuesConfig"][0] = {
        destructFromFormValues: config.virtual ? name : undefined,
    };
    let formValuesConfig: GenerateFieldsReturn["formValuesConfig"] = [defaultFormValuesConfig]; // FormFields should only contain one entry

    const gqlDocuments: Record<string, string> = {};
    const hooksCode = "";
    let finalFormConfig: GenerateFieldsReturn["finalFormConfig"];

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

    const fieldLabel = `<FormattedMessage id="${formattedMessageRootId}.${name}" defaultMessage="${label}" />`;

    let code = "";
    let formValueToGqlInputCode = "";
    let formFragmentField = name;
    if (config.type == "text") {
        const TextInputComponent = config.multiline ? "TextAreaField" : "TextField";
        code = `
        <${TextInputComponent}
            ${required ? "required" : ""}
            ${config.readOnly ? readOnlyPropsWithLock : ""}
            variant="horizontal"
            fullWidth
            name="${nameWithPrefix}"
            label={${fieldLabel}}
            ${
                config.helperText
                    ? `helperText={<FormattedMessage id=` +
                      `"${formattedMessageRootId}.${name}.helperText" ` +
                      `defaultMessage="${config.helperText}" />}`
                    : ""
            }
            ${validateCode}
        />`;
    } else if (config.type == "number") {
        code = `
            <Field
                ${required ? "required" : ""}
                ${config.readOnly ? readOnlyPropsWithLock : ""}
                variant="horizontal"
                fullWidth
                name="${nameWithPrefix}"
                component={FinalFormInput}
                type="number"
                label={${fieldLabel}}
                ${
                    config.helperText
                        ? `helperText={<FormattedMessage id=` +
                          `"${formattedMessageRootId}.${name}.helperText" ` +
                          `defaultMessage="${config.helperText}" />}`
                        : ""
                }
                ${validateCode}
            />`;
        //TODO MUI suggest not using type=number https://mui.com/material-ui/react-text-field/#type-quot-number-quot
        let assignment = `parseFloat(formValues.${nameWithPrefix})`;
        if (isFieldOptional({ config, gqlFieldName, gqlIntrospection: gqlIntrospection, gqlType: gqlType })) {
            assignment = `formValues.${nameWithPrefix} ? ${assignment} : null`;
        }
        formValueToGqlInputCode = !config.virtual ? `${name}: ${assignment},` : ``;

        let initializationAssignment = `String(data.${dataRootName}.${nameWithPrefix})`;
        if (!required) {
            initializationAssignment = `data.${dataRootName}.${nameWithPrefix} ? ${initializationAssignment} : undefined`;
        }
        formValuesConfig = [
            {
                ...defaultFormValuesConfig,
                ...{
                    omitFromFragmentType: name,
                    typeCode: `${name}${!required ? `?` : ``}: string;`,
                    initializationCode: `${name}: ${initializationAssignment}`,
                },
            },
        ];
    } else if (config.type == "boolean") {
        code = `<Field name="${nameWithPrefix}" label="" type="checkbox" variant="horizontal" fullWidth ${validateCode}>
            {(props) => (
                <FormControlLabel
                    label={${fieldLabel}}
                    control={<FinalFormCheckbox ${config.readOnly ? readOnlyProps : ""} {...props} />}
                    ${
                        config.helperText
                            ? `helperText={<FormattedMessage id=` +
                              `"${formattedMessageRootId}.${name}.helperText" ` +
                              `defaultMessage="${config.helperText}" />}`
                            : ""
                    }
                />
            )}
        </Field>`;
        formValuesConfig = [
            {
                ...defaultFormValuesConfig,
                ...{
                    defaultInitializationCode: `${name}: false`,
                },
            },
        ];
    } else if (config.type == "date") {
        code = `
            <Field
                ${required ? "required" : ""}
                ${config.readOnly ? readOnlyPropsWithLock : ""}
                variant="horizontal"
                fullWidth
                name="${nameWithPrefix}"
                component={FinalFormDatePicker}
                label={${fieldLabel}}
                ${
                    config.helperText
                        ? `helperText={<FormattedMessage id=` +
                          `"${formattedMessageRootId}.${name}.helperText" ` +
                          `defaultMessage="${config.helperText}" />}`
                        : ""
                }
                ${validateCode}
            />`;
        formValuesConfig = [
            {
                ...defaultFormValuesConfig,
                ...{
                    initializationCode: `${name}: data.${dataRootName}.${nameWithPrefix} ? new Date(data.${dataRootName}.${nameWithPrefix}) : undefined`,
                },
            },
        ];
    } else if (config.type == "block") {
        code = `<Field name="${nameWithPrefix}" isEqual={isEqual}>
            {createFinalFormBlock(rootBlocks.${String(config.name)})}
        </Field>`;
        formValueToGqlInputCode = !config.virtual ? `${name}: rootBlocks.${name}.state2Output(formValues.${nameWithPrefix}),` : ``;
        formValuesConfig = [
            {
                ...defaultFormValuesConfig,
                ...{
                    typeCode: `${name}: BlockState<typeof rootBlocks.${name}>;`,
                    initializationCode: `${name}: rootBlocks.${name}.input2State(data.${dataRootName}.${nameWithPrefix})`,
                    defaultInitializationCode: `${name}: rootBlocks.${name}.defaultValues()`,
                },
            },
        ];
    } else if (config.type === "fileUpload") {
        const multiple = config.multiple || (typeof config.maxFiles === "number" && config.maxFiles > 1);
        code = `<FileUploadField name="${name}" label={${fieldLabel}}
            ${config.multiple ? "multiple" : ""}
            ${config.maxFiles ? `maxFiles={${config.maxFiles}}` : ""}
            ${config.maxFileSize ? `maxFileSize={${config.maxFileSize}}` : ""}
            ${config.readOnly ? `readOnly` : ""}
            ${config.layout ? `layout="${config.layout}"` : ""}
            ${config.accept ? `accept="${config.accept}"` : ""}
        />`;
        if (multiple) {
            formValueToGqlInputCode = `${name}: formValues.${name}?.map(({ id }) => id),`;
        } else {
            formValueToGqlInputCode = `${name}: formValues.${name} ? formValues.${name}.id : null,`;
        }
        formFragmentField = `${name} { ...FinalFormFileUpload }`;
    } else if (config.type == "staticSelect") {
        const enumType = gqlIntrospection.__schema.types.find(
            (t) => t.kind === "ENUM" && t.name === (introspectionFieldType as IntrospectionNamedTypeRef).name,
        ) as IntrospectionEnumType | undefined;
        if (!enumType) throw new Error(`Enum type ${(introspectionFieldType as IntrospectionNamedTypeRef).name} not found for field ${name}`);

        const values = (config.values ? config.values : enumType.enumValues.map((i) => i.name)).map((value) => {
            if (typeof value === "string") {
                return {
                    value,
                    label: camelCaseToHumanReadable(value),
                };
            } else {
                return value;
            }
        });

        if (config.inputType === "radio") {
            code = `
            <RadioGroupField
             ${required ? "required" : ""}
              variant="horizontal"
             fullWidth
             name="${name}"
             label={<FormattedMessage id="${formattedMessageRootId}.${name}" defaultMessage="${label}" />}
             options={[
                  ${values
                      .map((value) => {
                          return `{
                                label: <FormattedMessage id="${formattedMessageRootId}.${name}.${
                              value.value.charAt(0).toLowerCase() + value.value.slice(1)
                          }" defaultMessage="${value.label}" />,
                                value: "${value.value}",
                            }`;
                      })
                      .join(",")}
            ]}/>
            `;
        } else {
            code = `<Field
            ${required ? "required" : ""}
            variant="horizontal"
            fullWidth
            name="${nameWithPrefix}"
            label={${fieldLabel}}>
            ${
                config.helperText
                    ? `helperText={<FormattedMessage id=` +
                      `"${formattedMessageRootId}.${name}.helperText" ` +
                      `defaultMessage="${config.helperText}" />}`
                    : ""
            }
            ${validateCode}
            {(props) =>
                <FinalFormSelect ${config.readOnly ? readOnlyPropsWithLock : ""} {...props}>
                ${values
                    .map((value) => {
                        const id = `${formattedMessageRootId}.${name}.${value.value.charAt(0).toLowerCase() + value.value.slice(1)}`;
                        const label = `<FormattedMessage id="${id}" defaultMessage="${value.label}" />`;
                        return `<MenuItem value="${value.value}">${label}</MenuItem>`;
                    })
                    .join("\n")}
                </FinalFormSelect>
            }
        </Field>`;
        }
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
        const queryName = `${rootQuery[0].toUpperCase() + rootQuery.substring(1)}Select`;
        const rootQueryType = findQueryTypeOrThrow(rootQuery, gqlIntrospection);
        const rootQueryFilterType = rootQueryType.args.find((arg) => arg.name === "filter");

        const filterField = config.filterField?.name ? findFieldByName(config.filterField.name, formConfig.fields) : undefined;
        if (filterField) {
            imports.push({ name: "OnChangeField", importPath: "@comet/admin" });
            finalFormConfig = { subscription: { values: true }, renderProps: { values: true, form: true } };
        }

        const initQueryIdPath = config.initQueryIdPath ?? `id`;
        const initQueryIdSelection = config.initQueryIdPath
            ? `id: ${config.initQueryIdPath
                  .split(".")
                  .reverse()
                  .reduce((acc, part) => `${part}${acc ? ` { ${acc} }` : ``}`, ``)}`
            : `id`;
        const initQueryLabelPath = config.initQueryLabelPath ?? labelField ?? ``;
        const initQueryLabelSelection = config.initQueryLabelPath
            ? `${labelField}: ${config.initQueryLabelPath
                  .split(".")
                  .reverse()
                  .reduce((acc, part) => `${part}${acc ? ` { ${acc} }` : ``}`, ``)}`
            : labelField;

        formFragmentField = `${name}${
            config.gqlFieldName ? `: ${String(config.gqlFieldName)}` : ``
        } { ${initQueryIdSelection} ${initQueryLabelSelection} }`;

        if (initQueryIdPath.indexOf(".") !== -1 || initQueryLabelPath.indexOf(".") !== -1) {
            // fetched nested values for id or label, formValues needs to be adjusted for asyncSelect to work
            formValuesConfig = [
                {
                    ...defaultFormValuesConfig,
                    ...{
                        omitFromFragmentType: name,
                        typeCode: `${name}?: { id: string, ${labelField}: string };`,
                        initializationCode: `${name}: data.${dataRootName}.${String(config.name)} ? {
                                id: data.${dataRootName}.${String(config.name)}?.id${
                            initQueryIdPath.split(".").length > 1 ? initQueryIdPath.substring(initQueryIdPath.indexOf(".")) : ``
                        },
                                ${labelField}: data.${dataRootName}.${String(config.name)}?.${labelField}${
                            initQueryLabelPath.split(".").length > 1 ? initQueryLabelPath.substring(initQueryLabelPath.indexOf(".")) : ``
                        }
                            } : undefined`,
                    },
                },
            ];
        }

        formValueToGqlInputCode = !config.virtual ? `${name}: formValues.${name}?.id,` : ``;
        imports.push({
            name: `GQL${queryName}Query`,
            importPath: `./${baseOutputFilename}.generated`,
        });
        imports.push({
            name: `GQL${queryName}QueryVariables`,
            importPath: `./${baseOutputFilename}.generated`,
        });

        code = `<AsyncSelectField
                ${required ? "required" : ""}
                variant="horizontal"
                fullWidth
                name="${nameWithPrefix}"
                label={${fieldLabel}}
                loadOptions={async () => {
                    const { data } = await client.query<GQL${queryName}Query, GQL${queryName}QueryVariables>({
                        query: gql\`query ${queryName}${
            filterField && rootQueryFilterType && rootQueryFilterType.type.kind === "INPUT_OBJECT"
                ? `($filter: ${rootQueryFilterType.type.name})`
                : ``
        } {
                            ${rootQuery}${filterField && rootQueryFilterType ? `(filter: $filter)` : ``} {
                                nodes {
                                    id
                                    ${labelField}
                                }
                            }
                        }\`${
                            filterField && rootQueryFilterType && config.filterField
                                ? `, variables: { ${(config.filterField?.gqlVarType === "filter"
                                      ? `filter: { gqlVarName: { equal: valuesVar } }`
                                      : `gqlVarName: valuesVar`
                                  )
                                      .replace(`gqlVarName`, config.filterField.gqlVarName)
                                      .replace(
                                          `valuesVar`,
                                          `values.${
                                              filterField.type === "asyncSelect" ? `${String(filterField.name)}?.id` : String(filterField.name)
                                          }`,
                                      )} }`
                                : ``
                        }
                    });
                    return data.${rootQuery}.nodes;
                }}
                getOptionLabel={(option) => option.${labelField}}
                ${filterField ? `disabled={!values?.${String(filterField.name)}}` : ``}
            />${
                filterField
                    ? `<OnChangeField name="${String(filterField.name)}">
                            {(value, previousValue) => {
                                if (value.id !== previousValue.id) {
                                    form.change("${String(config.name)}", undefined);
                                }
                            }}
                        </OnChangeField>`
                    : ``
            }`;
    } else {
        throw new Error(`Unsupported type`);
    }
    return {
        code,
        hooksCode,
        formValueToGqlInputCode,
        formFragmentFields: [formFragmentField],
        gqlDocuments,
        imports,
        formValuesConfig,
        finalFormConfig,
    };
}
