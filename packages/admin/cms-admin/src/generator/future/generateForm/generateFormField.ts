import { IntrospectionEnumType, IntrospectionInputValue, IntrospectionNamedTypeRef, IntrospectionObjectType, IntrospectionQuery } from "graphql";

import { FormConfig, FormFieldConfig, isFormFieldConfig } from "../generator";
import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { findQueryTypeOrThrow } from "../utils/findQueryType";
import { Imports } from "../utils/generateImportsCode";
import { isFieldOptional } from "../utils/isFieldOptional";
import { findFieldByName, GenerateFieldsReturn } from "./generateFields";

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
}: {
    gqlIntrospection: IntrospectionQuery;
    baseOutputFilename: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormFieldConfig<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig: FormConfig<any>;
}): GenerateFieldsReturn {
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

    const required = !isFieldOptional({ config, gqlIntrospection, gqlType });

    //TODO verify introspectionField.type is compatbile with config.type

    const endAdornmentWithLockIconProp = `endAdornment={<InputAdornment position="end"><Lock /></InputAdornment>}`;
    const readOnlyProps = `readOnly disabled`;
    const readOnlyPropsWithLock = `${readOnlyProps} ${endAdornmentWithLockIconProp}`;

    const imports: Imports = [];
    const defaultFormValuesConfig: GenerateFieldsReturn["formValuesConfig"][0] = {
        destructFromFormValues: config.virtual ? name : undefined,
    };
    let formValuesConfig: GenerateFieldsReturn["formValuesConfig"] = [defaultFormValuesConfig];

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
            name="${name}"
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
                ${config.readOnly ? readOnlyPropsWithLock : ""}
                variant="horizontal"
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
        let assignment = `parseFloat(formValues.${String(name)})`;
        if (isFieldOptional({ config, gqlIntrospection: gqlIntrospection, gqlType: gqlType })) {
            assignment = `formValues.${name} ? ${assignment} : null`;
        }
        formValueToGqlInputCode = !config.virtual ? `${name}: ${assignment},` : ``;

        let initializationAssignment = `String(data.${instanceGqlType}.${name})`;
        if (!required) {
            initializationAssignment = `data.${instanceGqlType}.${name} ? ${initializationAssignment} : undefined`;
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
        code = `<Field name="${name}" label="" type="checkbox" variant="horizontal" fullWidth ${validateCode}>
            {(props) => (
                <FormControlLabel
                    label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}
                    control={<FinalFormCheckbox ${config.readOnly ? readOnlyProps : ""} {...props} />}
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
        formValuesConfig = [
            {
                ...defaultFormValuesConfig,
                ...{
                    initializationCode: `${name}: data.${instanceGqlType}.${name} ? new Date(data.${instanceGqlType}.${name}) : undefined`,
                },
            },
        ];
    } else if (config.type == "block") {
        code = `<Field name="${name}" isEqual={isEqual}>
            {createFinalFormBlock(rootBlocks.${String(config.name)})}
        </Field>`;
        formValueToGqlInputCode = !config.virtual ? `${name}: rootBlocks.${name}.state2Output(formValues.${name}),` : ``;
        formValuesConfig = [
            {
                ...defaultFormValuesConfig,
                ...{
                    typeCode: `${name}: BlockState<typeof rootBlocks.${name}>;`,
                    initializationCode: `${name}: rootBlocks.${name}.input2State(data.${instanceGqlType}.${name})`,
                    defaultInitializationCode: `${name}: rootBlocks.${name}.defaultValues()`,
                },
            },
        ];
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
            name="${name}"
            label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}>
            ${
                config.helperText
                    ? `helperText={<FormattedMessage id=` + `"${instanceGqlType}.${name}.helperText" ` + `defaultMessage="${config.helperText}" />}`
                    : ""
            }
            ${validateCode}
            {(props) =>
                <FinalFormSelect ${config.readOnly ? readOnlyPropsWithLock : ""} {...props}>
                ${values
                    .map((value) => {
                        const id = `${instanceGqlType}.${name}.${value.value.charAt(0).toLowerCase() + value.value.slice(1)}`;
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
                name="${name}"
                label={<FormattedMessage id="${instanceGqlType}.${name}" defaultMessage="${label}" />}
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
