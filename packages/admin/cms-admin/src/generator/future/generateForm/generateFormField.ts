import { IntrospectionEnumType, IntrospectionInputValue, IntrospectionNamedTypeRef, IntrospectionObjectType, IntrospectionQuery } from "graphql";

import { Prop } from "../generateForm";
import { FormConfig, FormFieldConfig, isFormFieldConfig } from "../generator";
import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { findQueryTypeOrThrow } from "../utils/findQueryType";
import { Imports } from "../utils/generateImportsCode";
import { isFieldOptional, isFieldOptionalInApi } from "../utils/isFieldOptional";
import { findFieldByName, GenerateFieldsReturn } from "./generateFields";

function convertGqlScalarToTypescript(scalarName: string) {
    if (scalarName === "String" || scalarName === "ID") {
        return "string";
    } else if (scalarName === "Boolean") {
        return "boolean";
    } else if (scalarName === "Int" || scalarName === "Float") {
        return "number";
    } else if (scalarName === "DateTime") {
        return "Date";
    } else if (scalarName === "JSONObject") {
        return "unknown";
    } else {
        return "unknown";
    }
}

function getTypeInfo(arg: IntrospectionInputValue | undefined, gqlIntrospection: IntrospectionQuery) {
    if (!arg) return undefined;

    let typeKind = undefined;
    let typeClass = "unknown";
    let required = false;
    let type = arg.type;
    let introspectedType = undefined;

    if (type.kind === "NON_NULL") {
        required = true;
        type = type.ofType;
    }
    if (type.kind === "INPUT_OBJECT") {
        typeClass = type.name;
        typeKind = type.kind;
        introspectedType = gqlIntrospection.__schema.types.find((type) => type.name === typeClass);
    } else if (type.kind === "ENUM") {
        typeClass = type.name;
        typeKind = type.kind;
    } else if (type.kind === "SCALAR") {
        typeClass = type.name;
        typeKind = type.kind;
    } else {
        throw new Error(`Resolving kind ${type.kind} currently not supported.`);
    }
    return {
        required,
        typeKind,
        typeClass,
        introspectedType,
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

    const fieldIsOptionalInApi = isFieldOptionalInApi({ gqlFieldName, gqlIntrospection, gqlType });
    const optionalRender = config.optionalRenderProp && fieldIsOptionalInApi;
    if (config.optionalRenderProp && !fieldIsOptionalInApi) {
        console.warn(
            `Field ${String(
                config.name,
            )}: Required input can not be optionalRender. Try generating a second form without this field to enable providing a value via prop.`,
        );
    }
    const required = !isFieldOptional({ config, gqlFieldName, gqlIntrospection, gqlType });

    //TODO verify introspectionField.type is compatbile with config.type

    const endAdornmentWithLockIconProp = `endAdornment={<InputAdornment position="end"><Lock /></InputAdornment>}`;
    const readOnlyProps = `readOnly disabled`;
    const readOnlyPropsWithLock = `${readOnlyProps} ${endAdornmentWithLockIconProp}`;

    const imports: Imports = [];
    const props: Prop[] = [];

    const initialValuePropConfig = config.initialValueProp
        ? (() => {
              if (introspectionFieldType.kind === "OBJECT" || introspectionFieldType.kind === "ENUM") {
                  imports.push({
                      name: `GQL${introspectionFieldType.name}`,
                      importPath: `@src/graphql.generated`,
                  });
              }
              props.push({
                  optional: true,
                  type:
                      introspectionFieldType.kind === "OBJECT" || introspectionFieldType.kind === "ENUM"
                          ? `GQL${introspectionFieldType.name}`
                          : introspectionFieldType.kind === "SCALAR"
                          ? introspectionFieldType.name
                          : "unknown",
                  name: name,
              });
              return {
                  defaultInitializationCode: `${name}: ${name}`, // TODO consider optionFields field nesting for defaultInitializationCode
                  initializationVarDependency: `${name}`,
              };
          })()
        : undefined;

    const defaultFormValuesConfig: GenerateFieldsReturn["formValuesConfig"][0] = {
        destructFromFormValues: config.virtual ? name : undefined,
        initializationCode: optionalRender
            ? `${name}: show${name[0].toUpperCase() + name.substring(1)} ? data.${dataRootName}.${nameWithPrefix} : undefined`
            : undefined,
        defaultInitializationCode:
            initialValuePropConfig && optionalRender
                ? `${name}: show${name[0].toUpperCase() + name.substring(1)} ? ${name} : undefined`
                : initialValuePropConfig
                ? initialValuePropConfig.defaultInitializationCode
                : undefined,
        initializationVarDependency:
            optionalRender || initialValuePropConfig
                ? [
                      ...(optionalRender ? [`show${name[0].toUpperCase() + name.substring(1)}`] : []),
                      ...(initialValuePropConfig ? [initialValuePropConfig.initializationVarDependency] : []),
                  ].join(",")
                : undefined,
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

        let initializationAssignment = optionalRender
            ? `show${name[0].toUpperCase() + name.substring(1)} ? String(data.${dataRootName}.${nameWithPrefix}) : undefined`
            : `String(data.${dataRootName}.${nameWithPrefix})`;
        if (!required) {
            initializationAssignment = optionalRender
                ? `show${
                      name[0].toUpperCase() + name.substring(1)
                  } && data.${dataRootName}.${nameWithPrefix} ? ${initializationAssignment} : undefined`
                : `data.${dataRootName}.${nameWithPrefix} ? ${initializationAssignment} : undefined`;
        }
        formValuesConfig = [
            {
                ...defaultFormValuesConfig,
                ...{
                    omitFromFragmentType: name,
                    typeCode: `${name}${!required ? `?` : ``}: string;`,
                    initializationCode: `${name}: ${initializationAssignment}`,
                    initializationVarDependency:
                        optionalRender || initialValuePropConfig
                            ? [
                                  ...(optionalRender ? [`show${name[0].toUpperCase() + name.substring(1)}`] : []),
                                  ...(initialValuePropConfig ? [initialValuePropConfig.initializationVarDependency] : []),
                              ].join(",")
                            : undefined,
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
                    defaultInitializationCode:
                        optionalRender && initialValuePropConfig
                            ? `${name}: show${
                                  name[0].toUpperCase() + name.substring(1)
                              } ? ${name} !== undefined : ${name} ? ${name} : false : undefined`
                            : optionalRender
                            ? `${name}: show${name[0].toUpperCase() + name.substring(1)} ? false : undefined`
                            : initialValuePropConfig
                            ? `${name}: ${name} !== undefined ? ${name} : false`
                            : `${name}: false`,
                    initializationVarDependency:
                        optionalRender || initialValuePropConfig
                            ? [
                                  ...(optionalRender ? [`show${name[0].toUpperCase() + name.substring(1)}`] : []),
                                  ...(initialValuePropConfig ? [initialValuePropConfig.initializationVarDependency] : []),
                              ].join(",")
                            : undefined,
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
                    initializationCode: optionalRender
                        ? `${name}: show${
                              name[0].toUpperCase() + name.substring(1)
                          } && data.${dataRootName}.${nameWithPrefix} ? new Date(data.${dataRootName}.${nameWithPrefix}) : undefined`
                        : `${name}: data.${dataRootName}.${nameWithPrefix} ? new Date(data.${dataRootName}.${nameWithPrefix}) : undefined`,
                    initializationVarDependency:
                        optionalRender || initialValuePropConfig
                            ? [
                                  ...(optionalRender ? [`show${name[0].toUpperCase() + name.substring(1)}`] : []),
                                  ...(initialValuePropConfig ? [initialValuePropConfig.initializationVarDependency] : []),
                              ].join(",")
                            : undefined,
                },
            },
        ];
    } else if (config.type == "block") {
        code = `<Field name="${nameWithPrefix}" isEqual={isEqual}>
            {createFinalFormBlock(rootBlocks.${String(config.name)})}
        </Field>`;
        formValueToGqlInputCode = !config.virtual ? `${name}: rootBlocks.${name}.state2Output(formValues.${nameWithPrefix}),` : ``;
        if (initialValuePropConfig && introspectionFieldType.kind === "SCALAR") {
            imports.push({
                name: introspectionFieldType.name,
                importPath: "@src/blocks.generated",
            });
        }
        formValuesConfig = [
            {
                ...defaultFormValuesConfig,
                ...{
                    typeCode: `${name}: BlockState<typeof rootBlocks.${name}>;`,
                    initializationCode: optionalRender
                        ? `${name}: show${
                              name[0].toUpperCase() + name.substring(1)
                          } ? rootBlocks.${name}.input2State(data.${dataRootName}.${nameWithPrefix}) : undefined`
                        : `${name}: rootBlocks.${name}.input2State(data.${dataRootName}.${nameWithPrefix})`,
                    defaultInitializationCode:
                        optionalRender && initialValuePropConfig
                            ? `${name}: show${name[0].toUpperCase() + name.substring(1)} ? ${name} ?? rootBlocks.${name}.defaultValues() : undefined`
                            : optionalRender
                            ? `${name}: show${name[0].toUpperCase() + name.substring(1)} ? rootBlocks.${name}.defaultValues() : undefined`
                            : initialValuePropConfig
                            ? `${name}: ${name} ?? rootBlocks.${name}.defaultValues()`
                            : `${name}: rootBlocks.${name}.defaultValues()`,
                    initializationVarDependency:
                        optionalRender || initialValuePropConfig
                            ? [
                                  ...(optionalRender ? [`show${name[0].toUpperCase() + name.substring(1)}`] : []),
                                  ...(initialValuePropConfig ? [initialValuePropConfig.initializationVarDependency] : []),
                              ].join(",")
                            : undefined,
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

        formFragmentField = `${name} { id ${labelField} }`;

        const filterConfig = config.filter
            ? (() => {
                  const filterField = config.filter.type === "field" ? findFieldByName(config.filter.name, formConfig.fields) : undefined;
                  if (config.filter.type === "field") {
                      if (!filterField) {
                          throw new Error(
                              `Field ${String(config.name)}: No field with name "${
                                  config.filter?.name
                              }" referenced as filterField found in form-config.`,
                          );
                      }
                      if (!isFormFieldConfig(filterField)) {
                          throw new Error(
                              `Field ${String(config.name)}: Field with name "${config.filter?.name}" referenced as filterField is no FormField.`,
                          );
                      }
                  }

                  const gqlName = config.filter.gqlName ?? config.filter.name;

                  // try to find arg used to filter by checking names of root-props and filter-prop-fields
                  let gqlVarType = getTypeInfo(
                      rootQueryType.args.find((arg) => arg.name === gqlName),
                      gqlIntrospection,
                  );
                  let gqlVarName = undefined;
                  let gqlVarAssignment = undefined;
                  const filterVar = filterField
                      ? `values.${filterField.type === "asyncSelect" ? `${String(filterField.name)}?.id` : String(filterField.name)}`
                      : `${config.filter.name}`;
                  let filterVarType = "unknown";

                  if (gqlVarType) {
                      // there is a root-prop with same name, so the dev probably wants to filter with this prop
                      gqlVarName = gqlName;
                      gqlVarAssignment = filterVar;
                      if (gqlVarType.typeKind === "INPUT_OBJECT" || gqlVarType.typeKind === "ENUM") {
                          filterVarType = `GQL${gqlVarType.typeClass}`;
                          imports.push({
                              name: filterVarType,
                              importPath: "@src/graphql.generated",
                          });
                      } else if (gqlVarType.typeKind === "SCALAR") {
                          filterVarType = convertGqlScalarToTypescript(gqlVarType.typeClass);
                      }
                  } else {
                      // no root-prop with same name, check filter-prop-fields
                      gqlVarType = getTypeInfo(
                          rootQueryType.args.find((arg) => arg.name === "filter"),
                          gqlIntrospection,
                      );
                      if (gqlVarType) {
                          gqlVarName = "filter";
                          gqlVarAssignment = `{ ${gqlName}: { equal: ${filterVar} } }`;

                          // get type of field.equal in filter-arg used for filtering
                          if (!gqlVarType.introspectedType || gqlVarType.introspectedType.kind !== "INPUT_OBJECT") {
                              throw new Error(`Field ${String(config.name)}: Type of filter is no object-type.`);
                          }
                          const gqlFilterInputType = getTypeInfo(
                              gqlVarType.introspectedType.inputFields.find((inputField) => inputField.name === gqlName),
                              gqlIntrospection,
                          );
                          if (!gqlFilterInputType?.introspectedType || gqlFilterInputType.introspectedType.kind !== "INPUT_OBJECT") {
                              throw new Error(
                                  `Field ${String(
                                      config.name,
                                  )}: Type of filter.${gqlName} is no object-type, but needs to be e.g. StringFilter-type.`,
                              );
                          }
                          const equalFieldType = getTypeInfo(
                              gqlFilterInputType.introspectedType.inputFields.find((inputField) => inputField.name === "equal"),
                              gqlIntrospection,
                          );
                          if (!equalFieldType) {
                              throw new Error(
                                  `Field ${String(config.name)}: Field filter.${gqlName}.equal does not exist but is required for filtering.`,
                              );
                          }
                          filterVarType = convertGqlScalarToTypescript(equalFieldType.typeClass);
                      } else {
                          throw new Error(
                              `Neither filter-prop nor root-prop with name: ${gqlName} for asyncSelect-query not found. Consider setting filterField.gqlVarName explicitly.`,
                          );
                      }
                  }

                  if (config.filter.type === "prop") {
                      props.push({
                          name: config.filter.name,
                          optional: false,
                          type: filterVarType,
                      });
                  }

                  return {
                      filterField,
                      gqlVarType,
                      gqlVarName,
                      gqlVarAssignment,
                  };
              })()
            : undefined;
        if (filterConfig) {
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
            filterConfig ? `($${filterConfig.gqlVarName}: ${filterConfig.gqlVarType.typeClass}${filterConfig.gqlVarType.required ? `!` : ``})` : ``
        } {
                            ${rootQuery}${filterConfig ? `(${filterConfig.gqlVarName}: $${filterConfig.gqlVarName})` : ``} {
                                nodes {
                                    id
                                    ${labelField}
                                }
                            }
                        }\`${
                            filterConfig
                                ? `, variables: { ${
                                      filterConfig.gqlVarName == filterConfig.gqlVarAssignment
                                          ? filterConfig.gqlVarName
                                          : `${filterConfig.gqlVarName}: ${filterConfig.gqlVarAssignment}`
                                  } }`
                                : ``
                        }
                    });
                    return data.${rootQuery}.nodes;
                }}
                getOptionLabel={(option) => option.${labelField}}
                ${filterConfig && filterConfig.filterField ? `disabled={!values?.${String(filterConfig.filterField.name)}}` : ``}
            />${
                filterConfig && filterConfig.filterField
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

    if (optionalRender) {
        code = `{ show${name[0].toUpperCase() + name.substring(1)} && ${code} }`;
        props.push({ name: `show${name[0].toUpperCase() + name.substring(1)}`, type: `boolean`, optional: true });
    }

    return {
        code,
        props,
        hooksCode,
        formValueToGqlInputCode,
        formFragmentFields: [formFragmentField],
        gqlDocuments,
        imports,
        formValuesConfig,
        finalFormConfig,
    };
}
