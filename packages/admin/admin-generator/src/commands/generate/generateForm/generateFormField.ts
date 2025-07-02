import {
    type IntrospectionEnumType,
    type IntrospectionInputValue,
    type IntrospectionNamedTypeRef,
    type IntrospectionObjectType,
    type IntrospectionQuery,
} from "graphql";

import { type Adornment, type FormConfig, type FormFieldConfig, type GQLDocumentConfigMap, isFormFieldConfig } from "../generate-command";
import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { convertConfigImport } from "../utils/convertConfigImport";
import { findQueryTypeOrThrow } from "../utils/findQueryType";
import { type Imports } from "../utils/generateImportsCode";
import { isFieldOptional } from "../utils/isFieldOptional";
import { isGeneratorConfigCode, isGeneratorConfigImport } from "../utils/runtimeTypeGuards";
import { findFieldByName, type GenerateFieldsReturn } from "./generateFields";

type AdornmentData = {
    adornmentString: string;
    adornmentImport?: { name: string; importPath: string };
};

const getAdornmentData = ({ adornmentData }: { adornmentData: Adornment }): AdornmentData => {
    let adornmentString = "";
    let adornmentImport = { name: "", importPath: "" };

    if (typeof adornmentData === "string") {
        return { adornmentString: adornmentData };
    }

    if (typeof adornmentData.icon === "string") {
        adornmentString = `<${adornmentData.icon}Icon />`;
        adornmentImport = {
            name: `${adornmentData.icon} as ${adornmentData.icon}Icon`,
            importPath: "@comet/admin-icons",
        };
    } else if (typeof adornmentData.icon === "object") {
        if (isGeneratorConfigImport(adornmentData.icon)) {
            adornmentString = `<${adornmentData.icon.name} />`;
            adornmentImport = convertConfigImport(adornmentData.icon);
        } else {
            const { name, ...iconProps } = adornmentData.icon;
            adornmentString = `<${name}Icon
                ${Object.entries(iconProps)
                    .map(([key, value]) => `${key}="${value}"`)
                    .join("\n")}
            />`;
            adornmentImport = {
                name: `${adornmentData.icon.name} as ${adornmentData.icon.name}Icon`,
                importPath: "@comet/admin-icons",
            };
        }
    }

    return { adornmentString, adornmentImport };
};

function getTypeInfo(arg: IntrospectionInputValue, gqlIntrospection: IntrospectionQuery) {
    let typeKind = undefined;
    let typeClass = "unknown";
    let required = false;
    let type = arg.type;

    if (type.kind === "NON_NULL") {
        required = true;
        type = type.ofType;
    }
    if (type.kind === "INPUT_OBJECT") {
        typeClass = type.name;
        typeKind = type.kind;
    } else if (type.kind === "ENUM") {
        typeClass = type.name;
        typeKind = type.kind;
    } else {
        throw new Error(`Resolving kind ${type.kind} currently not supported.`);
    }
    return {
        required,
        typeKind,
        typeClass,
    };
}

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
    const label = config.label ?? camelCaseToHumanReadable(name);

    const introspectionObject = gqlIntrospection.__schema.types.find((type) => type.kind === "OBJECT" && type.name === gqlType) as
        | IntrospectionObjectType
        | undefined;
    if (!introspectionObject) throw new Error(`didn't find object ${gqlType} in gql introspection`);

    const introspectionField = introspectionObject.fields.find((field) => field.name === name);
    if (!introspectionField) throw new Error(`didn't find field ${name} in gql introspection type ${gqlType}`);
    const introspectionFieldType = introspectionField.type.kind === "NON_NULL" ? introspectionField.type.ofType : introspectionField.type;

    const required = !isFieldOptional({ config, gqlIntrospection, gqlType });

    //TODO verify introspectionField.type is compatbile with config.type

    const endAdornmentWithLockIconProp = `endAdornment={<InputAdornment position="end"><Lock /></InputAdornment>}`;
    const readOnlyProps = `readOnly disabled`;
    const readOnlyPropsWithLock = `${readOnlyProps} ${endAdornmentWithLockIconProp}`;

    const imports: Imports = [];
    const defaultFormValuesConfig: GenerateFieldsReturn["formValuesConfig"][0] = {
        destructFromFormValues: config.virtual ? name : undefined,
    };
    let formValuesConfig: GenerateFieldsReturn["formValuesConfig"] = [defaultFormValuesConfig]; // FormFields should only contain one entry

    const gqlDocuments: GQLDocumentConfigMap = {};
    const hooksCode = "";
    let finalFormConfig: GenerateFieldsReturn["finalFormConfig"];

    let validateCode = "";
    if (config.validate) {
        if (isGeneratorConfigImport(config.validate)) {
            imports.push(convertConfigImport(config.validate));
            validateCode = `validate={${config.validate.name}}`;
        } else if (isGeneratorConfigCode(config.validate)) {
            validateCode = `validate={${config.validate.code}}`;
            imports.push(...config.validate.imports.map((imprt) => convertConfigImport(imprt)));
        }
    }

    const fieldLabel = `<FormattedMessage id="${formattedMessageRootId}.${name}" defaultMessage="${label}" />`;

    let startAdornment: AdornmentData = { adornmentString: "" };
    let endAdornment: AdornmentData = { adornmentString: "" };

    if ("startAdornment" in config && config.startAdornment) {
        startAdornment = getAdornmentData({
            adornmentData: config.startAdornment,
        });
        if (startAdornment.adornmentImport) {
            imports.push(startAdornment.adornmentImport);
        }
    }

    if ("endAdornment" in config && config.endAdornment) {
        endAdornment = getAdornmentData({
            adornmentData: config.endAdornment,
        });
        if (endAdornment.adornmentImport) {
            imports.push(endAdornment.adornmentImport);
        }
    }

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
            ${config.startAdornment ? `startAdornment={<InputAdornment position="start">${startAdornment.adornmentString}</InputAdornment>}` : ""}
            ${config.endAdornment ? `endAdornment={<InputAdornment position="end">${endAdornment.adornmentString}</InputAdornment>}` : ""}
            ${
                config.helperText
                    ? `helperText={<FormattedMessage id=` +
                      `"${formattedMessageRootId}.${name}.helperText" ` +
                      `defaultMessage="${config.helperText}" />}`
                    : ""
            }
            ${validateCode}
        />`;
        if (!config.virtual && !required && !config.readOnly) {
            formValueToGqlInputCode = `${name}: formValues.${name} ?? null,`;
        }
    } else if (config.type == "number") {
        code = `
            <NumberField
                ${required ? "required" : ""}
                ${config.readOnly ? readOnlyPropsWithLock : ""}
                variant="horizontal"
                fullWidth
                name="${nameWithPrefix}"
                label={${fieldLabel}}
                ${config.decimals ? `decimals={${config.decimals}}` : ""}
                ${config.startAdornment ? `startAdornment={<InputAdornment position="start">${startAdornment.adornmentString}</InputAdornment>}` : ""}
                ${config.endAdornment ? `endAdornment={<InputAdornment position="end">${endAdornment.adornmentString}</InputAdornment>}` : ""}
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
        if (isFieldOptional({ config, gqlIntrospection: gqlIntrospection, gqlType: gqlType })) {
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
    } else if (config.type === "numberRange") {
        code = `
            <Field
                ${required ? "required" : ""}
                ${config.readOnly ? readOnlyPropsWithLock : ""}
                variant="horizontal"
                fullWidth
                name="${nameWithPrefix}"
                component={FinalFormRangeInput}
                label={${fieldLabel}}
                min={${config.minValue}}
                max={${config.maxValue}}
                ${config.disableSlider ? "disableSlider" : ""}
                ${config.startAdornment ? `startAdornment={<InputAdornment position="start">${startAdornment.adornmentString}</InputAdornment>}` : ""}
                ${config.endAdornment ? `endAdornment={<InputAdornment position="end">${endAdornment.adornmentString}</InputAdornment>}` : ""}
                ${
                    config.helperText
                        ? `helperText={<FormattedMessage id=` +
                          `"${formattedMessageRootId}.${name}.helperText" ` +
                          `defaultMessage="${config.helperText}" />}`
                        : ""
                }
                ${validateCode}
            />`;

        formFragmentField = `${name} { min max }`;
    } else if (config.type == "boolean") {
        code = `<CheckboxField
                        label={${fieldLabel}}
                        name="${nameWithPrefix}"
                        fullWidth
                        variant="horizontal"
                        ${config.readOnly ? readOnlyProps : ""}
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
                ${config.startAdornment ? `startAdornment={<InputAdornment position="start">${startAdornment.adornmentString}</InputAdornment>}` : ""}
                ${config.endAdornment ? `endAdornment={<InputAdornment position="end">${endAdornment.adornmentString}</InputAdornment>}` : ""}
                ${
                    config.helperText
                        ? `helperText={<FormattedMessage id=` +
                          `"${formattedMessageRootId}.${name}.helperText" ` +
                          `defaultMessage="${config.helperText}" />}`
                        : ""
                }
                ${validateCode}
            />`;
    } else if (config.type == "dateTime") {
        code = `<DateTimeField
                ${required ? "required" : ""}
                ${config.readOnly ? readOnlyPropsWithLock : ""}
                variant="horizontal"
                fullWidth
                name="${nameWithPrefix}"
                label={${fieldLabel}}
                ${config.startAdornment ? `startAdornment={<InputAdornment position="start">${startAdornment.adornmentString}</InputAdornment>}` : ""}
                ${config.endAdornment ? `endAdornment={<InputAdornment position="end">${endAdornment.adornmentString}</InputAdornment>}` : ""}
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
        code = `<Field name="${nameWithPrefix}" isEqual={isEqual} label={${fieldLabel}} variant="horizontal" fullWidth>
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
            variant="horizontal"
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
        formFragmentField = `${name} { ...${config.download ? "FinalFormFileUploadDownloadable" : "FinalFormFileUpload"} }`;
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

        const renderAsRadio = config.inputType === "radio" || (required && values.length <= 5 && config.inputType !== "select");
        if (renderAsRadio) {
            code = `<RadioGroupField
             ${required ? "required" : ""}
              variant="horizontal"
             fullWidth
             name="${nameWithPrefix}"
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
            ]}/>`;
        } else {
            code = `<Field
            ${required ? "required" : ""}
            variant="horizontal"
            fullWidth
            name="${nameWithPrefix}"
            label={${fieldLabel}}
            ${config.startAdornment ? `startAdornment={<InputAdornment position="start">${startAdornment.adornmentString}</InputAdornment>}` : ""}
            ${
                config.helperText
                    ? `helperText={<FormattedMessage id=` +
                      `"${formattedMessageRootId}.${name}.helperText" ` +
                      `defaultMessage="${config.helperText}" />}`
                    : ""
            }
            ${validateCode}>
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

        formFragmentField = `${name} { id ${labelField} }`;

        const filterConfig = config.filterField
            ? (() => {
                  const filterField = findFieldByName(config.filterField.name, formConfig.fields);
                  if (!filterField) {
                      throw new Error(
                          `Field ${String(config.name)}: No field with name "${
                              config.filterField?.name
                          }" referenced as filterField found in form-config.`,
                      );
                  }
                  if (!isFormFieldConfig(filterField)) {
                      throw new Error(
                          `Field ${String(config.name)}: Field with name "${config.filterField?.name}" referenced as filterField is no FormField.`,
                      );
                  }

                  const gqlName = config.filterField.gqlName ?? config.filterField.name;

                  // try to find arg used to filter by checking names of root-props and filter-prop-fields
                  const rootArgForName = rootQueryType.args.find((arg) => arg.name === gqlName);
                  let filterType = rootArgForName ? getTypeInfo(rootArgForName, gqlIntrospection) : undefined;
                  let filterVarName = undefined;
                  let filterVarValue = undefined;

                  if (filterType) {
                      // there is a root-prop with same name, so the dev probably wants to filter with this prop
                      filterVarName = gqlName;
                      filterVarValue = `values.${filterField.type === "asyncSelect" ? `${String(filterField.name)}?.id` : String(filterField.name)}`;
                  } else {
                      // no root-prop with same name, check filter-prop-fields
                      const rootArgFilter = rootQueryType.args.find((arg) => arg.name === "filter");
                      filterType = rootArgFilter ? getTypeInfo(rootArgFilter, gqlIntrospection) : undefined;
                      if (filterType) {
                          filterVarName = "filter";
                          filterVarValue = `{ ${gqlName}: { equal: values.${
                              filterField.type === "asyncSelect" ? `${String(filterField.name)}?.id` : String(filterField.name)
                          } } }`;
                      } else {
                          throw new Error(
                              `Neither filter-prop nor root-prop with name: ${gqlName} for asyncSelect-query not found. Consider setting filterField.gqlVarName explicitly.`,
                          );
                      }
                  }

                  return {
                      filterField,
                      filterType,
                      filterVarName,
                      filterVarValue,
                  };
              })()
            : undefined;
        if (filterConfig) {
            imports.push({ name: "OnChangeField", importPath: "@comet/admin" });
            finalFormConfig = { subscription: { values: true }, renderProps: { values: true, form: true } };
        }

        if (!config.virtual) {
            if (!required) {
                formValueToGqlInputCode = `${name}: formValues.${name} ? formValues.${name}.id : null,`;
            } else {
                formValueToGqlInputCode = `${name}: formValues.${name}?.id,`;
            }
        }

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
                ${config.startAdornment ? `startAdornment={<InputAdornment position="start">${startAdornment.adornmentString}</InputAdornment>}` : ""}
                loadOptions={async () => {
                    const { data } = await client.query<GQL${queryName}Query, GQL${queryName}QueryVariables>({
                        query: gql\`query ${queryName}${
                            filterConfig
                                ? `($${filterConfig.filterVarName}: ${filterConfig.filterType.typeClass}${filterConfig.filterType.required ? `!` : ``})`
                                : ``
                        } {
                            ${rootQuery}${filterConfig ? `(${filterConfig.filterVarName}: $${filterConfig.filterVarName})` : ``} {
                                nodes {
                                    id
                                    ${labelField}
                                }
                            }
                        }\`${filterConfig ? `, variables: { ${filterConfig.filterVarName}: ${filterConfig.filterVarValue} }` : ``}
                    });
                    return data.${rootQuery}.nodes;
                }}
                getOptionLabel={(option) => option.${labelField}}
                ${filterConfig ? `disabled={!values?.${String(filterConfig.filterField.name)}}` : ``}
            />${
                filterConfig
                    ? `<OnChangeField name="${String(filterConfig.filterField.name)}">
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
