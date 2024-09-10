import { IntrospectionEnumType, IntrospectionField, IntrospectionNamedTypeRef, IntrospectionObjectType, IntrospectionQuery } from "graphql";

import { GqlArg } from "../generateForm";
import { FormConfig, FormFieldConfig } from "../generator";
import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { Imports } from "../utils/generateImportsCode";
import { isFieldOptional } from "../utils/isFieldOptional";
import { GenerateFieldsReturn } from "./generateFields";

export function generateFormField({
    gqlIntrospection,
    baseOutputFilename,
    config,
    formConfig,
    createMutationType,
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
    createMutationType?: IntrospectionField;
    gqlType: string;
    namePrefix?: string;
}): GenerateFieldsReturn {
    const rootGqlType = formConfig.gqlType;
    const formattedMessageRootId = rootGqlType[0].toLowerCase() + rootGqlType.substring(1);
    const dataRootName = rootGqlType[0].toLowerCase() + rootGqlType.substring(1); // TODO should probably be deteced via query

    const gqlArgs: GqlArg[] = [];

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

    const gqlArgConfig = createMutationType
        ? (() => {
              const inputArg = createMutationType.args.find((arg) => arg.name === "input");
              if (!inputArg) throw new Error(`Field ${String(config.name)}: No input arg found`);
              let inputArgTypeRef = inputArg.type;
              if (inputArgTypeRef.kind === "NON_NULL") inputArgTypeRef = inputArgTypeRef.ofType;
              if (inputArgTypeRef.kind !== "INPUT_OBJECT") throw new Error(`Field ${String(config.name)}: input-arg is usually input-object.`);
              const inputArgTypeName = inputArgTypeRef.name;
              const inputArgType = gqlIntrospection.__schema.types.find((type) => type.name === inputArgTypeName);
              if (!inputArgType) throw new Error(`Field ${String(config.name)}: Input-Type ${inputArgTypeName} not found.`);
              if (inputArgType.kind !== "INPUT_OBJECT") {
                  throw new Error(`Field ${String(config.name)}: Input-Type ${inputArgTypeName} is no input-object.`);
              }
              const inputArgField = inputArgType.inputFields.find((field) => field.name === name);

              let gqlArgField = inputArgField;
              let isInputArgSubfield = true;
              if (!gqlArgField) {
                  // no input-arg-field found, probably root-arg
                  const rootArg = createMutationType.args.find((arg) => arg.name === name);
                  if (!rootArg) throw new Error(`Field ${String(config.name)}: No matching input-arg field nor root-arg found.`);
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

    const imports: Imports = [];
    const defaultFormValuesConfig: GenerateFieldsReturn["formValuesConfig"][0] = {
        destructFromFormValues: config.virtual || gqlArgConfig?.isFieldForRootProp ? name : undefined,
    };
    let formValuesConfig: GenerateFieldsReturn["formValuesConfig"] = [defaultFormValuesConfig]; // FormFields should only contain one entry

    const gqlDocuments: Record<string, string> = {};
    const hooksCode = "";

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
                    defaultInitializationCode: `${name}: false`,
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

        formFragmentField = `${name} { id ${labelField} }`;
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
                        query: gql\`query ${queryName} {
                            ${rootQuery} {
                                nodes {
                                    id
                                    ${labelField}
                                }
                            }
                        }\`
                    });
                    return data.${rootQuery}.nodes;
                }}
                getOptionLabel={(option) => option.${labelField}}
            />`;
    } else {
        throw new Error(`Unsupported type`);
    }
    return {
        code,
        gqlArgs,
        hooksCode,
        formValueToGqlInputCode: gqlArgConfig && gqlArgConfig.isFieldForRootProp ? `` : formValueToGqlInputCode,
        formFragmentFields: [formFragmentField],
        gqlDocuments,
        imports,
        formValuesConfig,
    };
}
