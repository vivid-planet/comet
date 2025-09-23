import { type IntrospectionEnumType, type IntrospectionNamedTypeRef, type IntrospectionQuery } from "graphql";

import { type FormConfig, type FormFieldConfig, type GQLDocumentConfigMap } from "../generate-command";
import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { convertConfigImport } from "../utils/convertConfigImport";
import { type Imports } from "../utils/generateImportsCode";
import { isFieldOptional } from "../utils/isFieldOptional";
import { isGeneratorConfigCode, isGeneratorConfigImport } from "../utils/runtimeTypeGuards";
import { generateAsyncSelect } from "./asyncSelect/generateAsyncSelect";
import { buildFormFieldOptions } from "./formField/options";
import { type GenerateFieldsReturn } from "./generateFields";
import { type Prop } from "./generateForm";

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
    if (config.type == "asyncSelect" || config.type == "asyncSelectFilter") {
        return generateAsyncSelect({ gqlIntrospection, baseOutputFilename, config, formConfig, gqlType, namePrefix });
    }
    const imports: Imports = [];
    const formProps: Prop[] = [];

    const {
        name,
        formattedMessageRootId,
        fieldLabel,
        startAdornment,
        endAdornment,
        imports: optionsImports,
    } = buildFormFieldOptions({ config, formConfig, gqlType, gqlIntrospection });
    imports.push(...optionsImports);

    let { introspectionFieldType } = buildFormFieldOptions({ config, formConfig, gqlType, gqlIntrospection });

    const nameWithPrefix = `${namePrefix ? `${namePrefix}.` : ``}${name}`;

    const rootGqlType = formConfig.gqlType;

    const dataRootName = rootGqlType[0].toLowerCase() + rootGqlType.substring(1); // TODO should probably be deteced via query

    const required = !isFieldOptional({ config, gqlIntrospection, gqlType });

    //TODO verify introspectionField.type is compatbile with config.type

    const endAdornmentWithLockIconProp = `endAdornment={<InputAdornment position="end"><Lock /></InputAdornment>}`;
    const readOnlyProps = `readOnly disabled`;
    const readOnlyPropsWithLock = `${readOnlyProps} ${endAdornmentWithLockIconProp}`;

    let formValuesConfig: GenerateFieldsReturn["formValuesConfig"] = [{}]; // FormFields should only contain one entry

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

    let code = "";
    let formValueToGqlInputCode = "";
    let formFragmentFields = [name];
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
        if (!required && !config.readOnly) {
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
        formValueToGqlInputCode = `${name}: ${assignment},`;

        let initializationAssignment = `String(data.${dataRootName}.${nameWithPrefix})`;
        if (!required) {
            initializationAssignment = `data.${dataRootName}.${nameWithPrefix} ? ${initializationAssignment} : undefined`;
        }
        formValuesConfig = [
            {
                omitFromFragmentType: name,
                typeCode: `${name}${!required ? `?` : ``}: string;`,
                initializationCode: `${name}: ${initializationAssignment}`,
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

        formFragmentFields = [`${name}.min`, `${name}.max`];
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
                defaultInitializationCode: `${name}: false`,
            },
        ];
    } else if (config.type == "date") {
        imports.push({
            name: "Future_DatePickerField",
            importPath: "@comet/admin",
        });
        code = `
            <Future_DatePickerField
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
        if (!required && !config.readOnly) {
            formValueToGqlInputCode = `${name}: formValues.${name} ?? null,`;
        }
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
                initializationCode: `${name}: data.${dataRootName}.${nameWithPrefix} ? new Date(data.${dataRootName}.${nameWithPrefix}) : undefined`,
                omitFromFragmentType: name,
                typeCode: `${name}${!required ? "?" : ""}: Date${!required ? " | null" : ""};`,
            },
        ];
        if (!config.readOnly) {
            formValueToGqlInputCode = required
                ? `${name}: formValues.${name}.toISOString(),`
                : `${name}: formValues.${name} ? formValues.${name}.toISOString() : null,`;
        }
    } else if (config.type == "block") {
        code = `<Field name="${nameWithPrefix}" isEqual={isEqual} label={${fieldLabel}} variant="horizontal" fullWidth>
            {createFinalFormBlock(rootBlocks.${String(config.name)})}
        </Field>`;
        formValueToGqlInputCode = `${name}: rootBlocks.${name}.state2Output(formValues.${nameWithPrefix}),`;
        formValuesConfig = [
            {
                typeCode: `${name}: BlockState<typeof rootBlocks.${name}>;`,
                initializationCode: `${name}: rootBlocks.${name}.input2State(data.${dataRootName}.${nameWithPrefix})`,
                defaultInitializationCode: `${name}: rootBlocks.${name}.defaultValues()`,
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
        formFragmentFields = [`${name} { ...${config.download ? "FinalFormFileUploadDownloadable" : "FinalFormFileUpload"} }`];
    } else if (config.type == "staticSelect") {
        const multiple = introspectionFieldType?.kind === "LIST";
        if (introspectionFieldType?.kind === "LIST") {
            introspectionFieldType =
                introspectionFieldType.ofType.kind === "NON_NULL" ? introspectionFieldType.ofType.ofType : introspectionFieldType.ofType;
        }

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

        let inputType = config.inputType;
        if (!inputType) {
            if (!required || multiple) {
                // radio is not clearable, render always as select if not required
                // radio doesn't support multiple
                inputType = "select";
            } else {
                // auto select/radio based on number of values
                if (values.length <= 5) {
                    inputType = "radio";
                } else {
                    inputType = "select";
                }
            }
        }
        if (inputType === "radio" && multiple) {
            throw new Error(`${name}: inputType=radio doesn't support multiple`);
        }
        if (inputType === "radio" && !required) {
            throw new Error(`${name}: inputType=radio must be required as it doesn't support clearable`);
        }

        const renderAsRadio = inputType === "radio";
        if (renderAsRadio) {
            code = `<RadioGroupField
             ${required ? "required" : ""}
              variant="horizontal"
             fullWidth
             name="${nameWithPrefix}"
             label={${fieldLabel}}
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
            imports.push({
                name: "SelectField",
                importPath: "@comet/admin",
            });
            code = `<SelectField
                            ${required ? "required" : ""}
                             fullWidth
                                variant={"horizontal"}
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
                                ${validateCode}
                                ${config.readOnly ? readOnlyPropsWithLock : ""}
                                ${multiple ? "multiple" : ""}
                                options={[${values.map((value) => {
                                    const id = `${formattedMessageRootId}.${name}.${value.value.charAt(0).toLowerCase() + value.value.slice(1)}`;

                                    return `{
                                        value: "${value.value}",
                                        label: <FormattedMessage id="${id}" defaultMessage="${value.label}" />
                                    }`;
                                })}]}
                            />`;
        }
    } else {
        throw new Error(`Unsupported type`);
    }
    return {
        code,
        hooksCode,
        formValueToGqlInputCode,
        formFragmentFields,
        gqlDocuments,
        imports,
        formProps,
        formValuesConfig,
        finalFormConfig,
    };
}
