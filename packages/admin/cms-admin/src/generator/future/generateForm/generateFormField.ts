import {
    IntrospectionEnumType,
    IntrospectionField,
    IntrospectionInputValue,
    IntrospectionNamedTypeRef,
    IntrospectionObjectType,
    IntrospectionQuery,
} from "graphql";

import { GqlArg, Prop } from "../generateForm";
import { Adornment, FormConfig, FormFieldConfig, isFormFieldConfig } from "../generator";
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
        if ("import" in adornmentData.icon) {
            adornmentString = `<${adornmentData.icon.name} />`;
            adornmentImport = {
                name: `${adornmentData.icon.name}`,
                importPath: `${adornmentData.icon.import}`,
            };
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

function getTypeInfo(arg: IntrospectionInputValue | undefined, gqlIntrospection: IntrospectionQuery) {
    if (!arg) {
        return undefined;
    }

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
    createMutationType,
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
    createMutationType?: IntrospectionField;
    namePrefix?: string;
}): GenerateFieldsReturn {
    const imports: Imports = [];
    const props: Prop[] = [];
    const gqlArgs: GqlArg[] = [];

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
    const gqlArgConfig =
        !config.readOnly && createMutationType
            ? (() => {
                  // TODO auslagern in extra funktion, das ist zu viel für getInputArgField
                  const inputArg = createMutationType.args.find((arg) => arg.name === "input");
                  if (!inputArg) throw new Error(`Field ${nameWithPrefix}: No input arg found`);
                  let inputArgTypeRef = inputArg.type;
                  if (inputArgTypeRef.kind === "NON_NULL") inputArgTypeRef = inputArgTypeRef.ofType;
                  if (inputArgTypeRef.kind !== "INPUT_OBJECT") throw new Error(`Field ${nameWithPrefix}: input-arg is usually input-object.`);
                  const inputArgTypeName = inputArgTypeRef.name;
                  let inputArgType = gqlIntrospection.__schema.types.find((type) => type.name === inputArgTypeName);
                  if (!inputArgType) throw new Error(`Field ${nameWithPrefix}: Input-Type ${inputArgTypeName} not found.`);
                  if (inputArgType.kind !== "INPUT_OBJECT") {
                      throw new Error(`Field ${nameWithPrefix}: Input-Type ${inputArgTypeName} is no input-object.`);
                  }
                  if (namePrefix) {
                      const inputArgPrefixField = inputArgType.inputFields.find((field) => field.name === namePrefix);
                      if (!inputArgPrefixField) throw new Error(`Field ${nameWithPrefix}: No input field for ${namePrefix} found.`);
                      const inputArgPrefixFieldTypeRef = inputArgPrefixField.type;
                      if (inputArgPrefixFieldTypeRef.kind !== "INPUT_OBJECT") {
                          throw new Error(`Field ${nameWithPrefix}: Field ${namePrefix} in Input-Type ${inputArgTypeName} is no input-object.`);
                      }
                      const inputArgPrefixFieldTypeName = inputArgPrefixFieldTypeRef.name;
                      inputArgType = gqlIntrospection.__schema.types.find((type) => type.name === inputArgPrefixFieldTypeName);
                      if (!inputArgType) {
                          throw new Error(`Field ${nameWithPrefix}: Type ${inputArgPrefixFieldTypeName} of Field ${namePrefix} not found.`);
                      }
                      if (inputArgType.kind !== "INPUT_OBJECT") {
                          throw new Error(`Field ${nameWithPrefix}: Type ${inputArgPrefixFieldTypeName} of Field ${namePrefix} is no input-object.`);
                      }
                  }

                  const inputArgField = inputArgType.inputFields.find((field) => field.name === gqlFieldName);

                  let gqlArgField = inputArgField;
                  let isInputArgSubfield = true;
                  if (!gqlArgField) {
                      // no input-arg-field found, probably root-arg
                      const rootArg = createMutationType.args.find((arg) => arg.name === name);
                      if (!rootArg) {
                          throw new Error(
                              `Field ${String(config.name)}: No matching input-arg field (${inputArgTypeRef.name}) nor root-arg (${
                                  createMutationType.name
                              }) found.`,
                          );
                      }
                      gqlArgField = rootArg;
                      isInputArgSubfield = false;
                  }

                  const gqlArgType = gqlArgField.type.kind === "NON_NULL" ? gqlArgField.type.ofType : gqlArgField.type;
                  if (gqlArgType.kind === "SCALAR" || gqlArgType.kind === "ENUM" || gqlArgType.kind === "INPUT_OBJECT") {
                      gqlArgs.push({ name, type: gqlArgType.name, isInputArgSubfield, isInOutputVar: isInputArgSubfield });
                  }

                  return {
                      isFieldForRootProp: !isInputArgSubfield,
                      isReadOnlyOnEdit: !isInputArgSubfield, // we assume root-args are not changeable, alternatively check update-mutation
                  };
              })()
            : undefined;

    type RenderProp = { name: string; value?: string };
    const endAdornmentWithLockIconProp: RenderProp = { name: "endAdornment", value: `<InputAdornment position="end"><Lock /></InputAdornment>` };
    const readOnlyProps: RenderProp[] = [{ name: "readOnly" }, { name: "disabled" }];
    const readOnlyPropsWithLock: RenderProp[] = [...readOnlyProps, endAdornmentWithLockIconProp];

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
        destructFromFormValues: config.virtual || gqlArgConfig?.isFieldForRootProp ? name : undefined,
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

    let startAdornment: AdornmentData = { adornmentString: "" };
    let endAdornment: AdornmentData = { adornmentString: "" };

    if (config.startAdornment) {
        startAdornment = getAdornmentData({
            adornmentData: config.startAdornment,
        });
        if (startAdornment.adornmentImport) {
            imports.push(startAdornment.adornmentImport);
        }
    }

    if (config.endAdornment) {
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
            ${
                config.readOnly
                    ? readOnlyPropsWithLock.map((prop) => (prop.value ? `${prop.name}={${prop.value}}` : prop.name)).join(" ")
                    : gqlArgConfig?.isReadOnlyOnEdit
                    ? readOnlyPropsWithLock
                          .map((prop) =>
                              prop.value ? `${prop.name}={mode === "edit" ? ${prop.value} : undefined}` : `${prop.name}={mode === "edit"}`,
                          )
                          .join(" ")
                    : ""
            }
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
    } else if (config.type == "number") {
        code = `
            <Field
                ${required ? "required" : ""}
                ${
                    config.readOnly
                        ? readOnlyPropsWithLock.map((prop) => (prop.value ? `${prop.name}={${prop.value}}` : prop.name)).join(" ")
                        : gqlArgConfig?.isReadOnlyOnEdit
                        ? readOnlyPropsWithLock
                              .map((prop) =>
                                  prop.value ? `${prop.name}={mode === "edit" ? ${prop.value} : undefined}` : `${prop.name}={mode === "edit"}`,
                              )
                              .join(" ")
                        : ""
                }
                variant="horizontal"
                fullWidth
                name="${nameWithPrefix}"
                component={FinalFormInput}
                type="number"
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
        code = `<Field name="${nameWithPrefix}" label="" type="checkbox" variant="horizontal" fullWidth ${validateCode}>
            {(props) => (
                <FormControlLabel
                    label={${fieldLabel}}
                    control={<FinalFormCheckbox ${
                        config.readOnly
                            ? readOnlyProps.map((prop) => (prop.value ? `${prop.name}={${prop.value}}` : prop.name)).join(" ")
                            : gqlArgConfig?.isReadOnlyOnEdit
                            ? readOnlyProps
                                  .map((prop) =>
                                      prop.value ? `${prop.name}={mode === "edit" ? ${prop.value} : undefined}` : `${prop.name}={mode === "edit"}`,
                                  )
                                  .join(" ")
                            : ""
                    } {...props} />}
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
                ${
                    config.readOnly
                        ? readOnlyPropsWithLock.map((prop) => (prop.value ? `${prop.name}={${prop.value}}` : prop.name)).join(" ")
                        : gqlArgConfig?.isReadOnlyOnEdit
                        ? readOnlyPropsWithLock
                              .map((prop) =>
                                  prop.value ? `${prop.name}={mode === "edit" ? ${prop.value} : undefined}` : `${prop.name}={mode === "edit"}`,
                              )
                              .join(" ")
                        : ""
                }
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
            ${`` /* TODO wenn root-prop muss es bei edit auf readonly gesetzt werden, hier fehlt auch readonly?? */}
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
            ]}/>`;
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
                <FinalFormSelect ${
                    config.readOnly
                        ? readOnlyPropsWithLock.map((prop) => (prop.value ? `${prop.name}={${prop.value}}` : prop.name)).join(" ")
                        : gqlArgConfig?.isReadOnlyOnEdit
                        ? readOnlyPropsWithLock
                              .map((prop) =>
                                  prop.value ? `${prop.name}={mode === "edit" ? ${prop.value} : undefined}` : `${prop.name}={mode === "edit"}`,
                              )
                              .join(" ")
                        : ""
                } {...props}>
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
                        initializationCode: `${name}: data.${dataRootName}.${nameWithPrefix} ? {
                                id: data.${dataRootName}.${nameWithPrefix}?.id${
                            initQueryIdPath.split(".").length > 1 ? initQueryIdPath.substring(initQueryIdPath.indexOf(".")) : ``
                        },
                                ${labelField}: data.${dataRootName}.${nameWithPrefix}?.${labelField}${
                            initQueryLabelPath.split(".").length > 1 ? initQueryLabelPath.substring(initQueryLabelPath.indexOf(".")) : ``
                        }
                            } : undefined`,
                    },
                },
            ];
        }

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
                  const rootArgForName = rootQueryType.args.find((arg) => arg.name === gqlName);
                  let filterType = rootArgForName ? getTypeInfo(rootArgForName, gqlIntrospection) : undefined;
                  let filterVarName = undefined;
                  let filterVarValue = undefined;

                  const filterVar = filterField
                      ? `values.${filterField.type === "asyncSelect" ? `${String(filterField.name)}?.id` : String(filterField.name)}`
                      : `${config.filter.name}`;
                  let filterVarType = "unknown";

                  if (filterType) {
                      // there is a root-prop with same name, so the dev probably wants to filter with this prop
                      filterVarName = gqlName;
                      filterVarValue = filterVar;
                      if (filterType.typeKind === "INPUT_OBJECT" || filterType.typeKind === "ENUM") {
                          filterVarType = `GQL${filterType.typeClass}`;
                          imports.push({
                              name: filterVarType,
                              importPath: "@src/graphql.generated",
                          });
                      } else if (filterType.typeKind === "SCALAR") {
                          filterVarType = convertGqlScalarToTypescript(filterType.typeClass);
                      }
                  } else {
                      // no root-prop with same name, check filter-prop-fields
                      filterType = getTypeInfo(
                          rootQueryType.args.find((arg) => arg.name === "filter"),
                          gqlIntrospection,
                      );
                      if (filterType) {
                          filterVarName = "filter";
                          filterVarValue = `{ ${gqlName}: { equal: ${filterVar} } }`;

                          // get type of field.equal in filter-arg used for filtering
                          if (!filterType.introspectedType || filterType.introspectedType.kind !== "INPUT_OBJECT") {
                              throw new Error(`Field ${String(config.name)}: Type of filter is no object-type.`);
                          }
                          const gqlFilterInputType = getTypeInfo(
                              filterType.introspectedType.inputFields.find((inputField) => inputField.name === gqlName),
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

        formValueToGqlInputCode = !config.virtual ? `${name}: formValues.${name}?.id,` : ``;

        imports.push({
            name: `GQL${queryName}Query`,
            importPath: `./${baseOutputFilename}.generated`,
        });
        imports.push({
            name: `GQL${queryName}QueryVariables`,
            importPath: `./${baseOutputFilename}.generated`,
        });

        // handle asyncSelect submitted via gql-root-prop
        if (defaultFormValuesConfig.destructFromFormValues && gqlArgConfig?.isFieldForRootProp) {
            defaultFormValuesConfig.destructFromFormValues = `${name}: { id: ${name}}`;
        }

        code = `<AsyncSelectField
                ${required ? "required" : ""}
                variant="horizontal"
                fullWidth
                ${
                    config.readOnly
                        ? readOnlyProps.map((prop) => (prop.value ? `${prop.name}={${prop.value}}` : prop.name)).join(" ")
                        : gqlArgConfig?.isReadOnlyOnEdit
                        ? readOnlyProps
                              .map((prop) =>
                                  prop.value ? `${prop.name}={mode === "edit" ? ${prop.value} : undefined}` : `${prop.name}={mode === "edit"}`,
                              )
                              .join(" ")
                        : ""
                }
                name="${nameWithPrefix}"
                label={${fieldLabel}}
                loadOptions={async () => {
                    const { data } = await client.query<GQL${queryName}Query, GQL${queryName}QueryVariables>({
                        query: gql\`query ${queryName}${
            filterConfig ? `($${filterConfig.filterVarName}: ${filterConfig.filterType.typeClass}${filterConfig.filterType.required ? `!` : ``})` : ``
        } {
                            ${rootQuery}${filterConfig ? `(${filterConfig.filterVarName}: $${filterConfig.filterVarName})` : ``} {
                                nodes {
                                    id
                                    ${labelField}
                                }
                            }
                        }\`${
                            filterConfig
                                ? `, variables: { ${
                                      filterConfig.filterVarName == filterConfig.filterVarValue
                                          ? filterConfig.filterVarName
                                          : `${filterConfig.filterVarName}: ${filterConfig.filterVarValue}`
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
        gqlArgs,
        hooksCode,
        formValueToGqlInputCode: gqlArgConfig && gqlArgConfig.isFieldForRootProp ? `` : formValueToGqlInputCode,
        formFragmentFields: [formFragmentField],
        gqlDocuments,
        imports,
        formValuesConfig,
        finalFormConfig,
    };
}
