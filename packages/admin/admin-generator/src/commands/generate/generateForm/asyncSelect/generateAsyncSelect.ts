import { type IntrospectionInputValue, type IntrospectionObjectType, type IntrospectionQuery } from "graphql";

import { type FormConfig, type FormFieldConfig, isFormFieldConfig } from "../../generate-command";
import { findQueryTypeOrThrow } from "../../utils/findQueryType";
import { type Imports } from "../../utils/generateImportsCode";
import { isFieldOptional } from "../../utils/isFieldOptional";
import { buildFormFieldOptions } from "../formField/options";
import { findFieldByName, type GenerateFieldsReturn } from "../generateFields";
import { type Prop } from "../generateForm";

function gqlScalarToTypescriptType(scalarName: string): string {
    if (scalarName === "String" || scalarName === "ID" || scalarName === "DateTime" || scalarName === "LocalDate" || scalarName === "Date") {
        return "string";
    } else if (scalarName === "Boolean") {
        return "boolean";
    } else if (scalarName === "Int" || scalarName === "Float") {
        return "number";
    } else if (scalarName === "JSONObject") {
        return "unknown";
    } else {
        return "unknown";
    }
}

function buildTypeInfo(arg: IntrospectionInputValue, gqlIntrospection: IntrospectionQuery) {
    let typeKind = undefined;
    let typeClass = "unknown";
    let required = false;
    let type = arg.type;
    let inputType = undefined;

    if (type.kind === "NON_NULL") {
        required = true;
        type = type.ofType;
    }
    if (type.kind === "INPUT_OBJECT") {
        typeClass = type.name;
        typeKind = type.kind;
        inputType = gqlIntrospection.__schema.types.find((type) => type.name === typeClass);
    } else if (type.kind === "ENUM") {
        typeClass = type.name;
        typeKind = type.kind;
    } else if (type.kind === "SCALAR") {
        typeClass = type.name;
        typeKind = type.kind;
    } else {
        throw new Error(`getTypeInfo: Resolving kind ${type.kind} currently not supported.`);
    }
    return {
        required,
        typeKind,
        typeClass,
        inputType,
    };
}

/**
 * Helper that returns the introspection object type for a given form field config, supporting the special case for asyncSelectFilter
 */
export function findIntrospectionObjectType({
    config,
    gqlIntrospection,
    gqlType,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormFieldConfig<any>;
    gqlIntrospection: IntrospectionQuery;
    gqlType: string;
}) {
    const name = String(config.name);

    const introspectionObject = gqlIntrospection.__schema.types.find((type) => type.kind === "OBJECT" && type.name === gqlType) as
        | IntrospectionObjectType
        | undefined;
    if (!introspectionObject) throw new Error(`didn't find object ${gqlType} in gql introspection`);

    function findIntrospectionField(introspectionObject: IntrospectionObjectType, name: string) {
        const introspectionField = introspectionObject.fields.find((field) => field.name === name);
        if (!introspectionField) throw new Error(`didn't find field ${name} in gql introspection type ${gqlType}`);
        const introspectionFieldType = introspectionField.type.kind === "NON_NULL" ? introspectionField.type.ofType : introspectionField.type;
        if (introspectionFieldType.kind !== "OBJECT") throw new Error(`asyncSelect only supports OBJECT types`);
        const objectType = gqlIntrospection.__schema.types.find((t) => t.kind === "OBJECT" && t.name === introspectionFieldType.name) as
            | IntrospectionObjectType
            | undefined;
        if (!objectType) throw new Error(`Object type ${introspectionFieldType.name} not found for field ${name}`);
        return objectType;
    }
    if (config.type === "asyncSelectFilter") {
        //for a filter select the field is "virtual", and it's ObjectType is defined by the path in config.queryField
        return config.queryField.split(".").reduce((acc, fieldName) => {
            const ret = findIntrospectionField(acc, fieldName);
            if (!ret) throw new Error(`Field ${fieldName} not found in gql introspection`);
            return ret;
        }, introspectionObject);
    } else {
        //for a standard select we just find the field directly
        return findIntrospectionField(introspectionObject, name);
    }
}

export function generateAsyncSelect({
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
    config: Extract<FormFieldConfig<any>, { type: "asyncSelect" } | { type: "asyncSelectFilter" }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig: FormConfig<any>;
    gqlType: string;
    namePrefix?: string;
}): GenerateFieldsReturn {
    const imports: Imports = [];
    const formProps: Prop[] = [];

    const {
        name,
        fieldLabel,
        startAdornment,
        //endAdornment,
        imports: optionsImports,
    } = buildFormFieldOptions({ config, formConfig, gqlIntrospection, gqlType });
    imports.push(...optionsImports);

    const nameWithPrefix = `${namePrefix ? `${namePrefix}.` : ``}${name}`;

    const required = !isFieldOptional({ config, gqlIntrospection, gqlType });

    const formValueConfig: GenerateFieldsReturn["formValuesConfig"][0] = {
        destructFromFormValues: config.virtual || config.type == "asyncSelectFilter" ? name : undefined,
    };

    let finalFormConfig: GenerateFieldsReturn["finalFormConfig"];
    let code = "";
    let formValueToGqlInputCode = "";

    const objectType = findIntrospectionObjectType({
        config,
        gqlIntrospection,
        gqlType,
    });

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

    let formFragmentFields: string[];
    if (config.type == "asyncSelectFilter") {
        formFragmentFields = [`${config.queryField}.id`, `${config.queryField}.${labelField}`];
    } else {
        formFragmentFields = [`${name}.id`, `${name}.${labelField}`];
    }

    const filterConfig =
        config.type == "asyncSelect" && config.filter
            ? (() => {
                  let filterField: FormFieldConfig<unknown> | undefined;
                  let rootQueryArg = config.filter.rootQueryArg;
                  let filterVar = "";

                  if (config.filter.type === "field") {
                      filterField = findFieldByName(config.filter.formFieldName, formConfig.fields);
                      if (!filterField) {
                          throw new Error(
                              `Field ${String(config.name)}: No field with name "${
                                  config.filter.formFieldName
                              }" referenced as filter.formFieldName found in form-config.`,
                          );
                      }
                      if (!isFormFieldConfig(filterField)) {
                          throw new Error(
                              `Field ${String(config.name)}: Field with name "${config.filter.formFieldName}" referenced as filter.formFieldName is no FormField.`,
                          );
                      }

                      filterVar = `values.${filterField.type === "asyncSelect" || filterField.type === "asyncSelectFilter" ? `${String(filterField.name)}?.id` : String(filterField.name)}`;

                      if (!rootQueryArg) {
                          rootQueryArg = config.filter.formFieldName;
                      }
                  } else if (config.filter.type === "formProp") {
                      filterVar = config.filter.propName;
                      if (!rootQueryArg) {
                          rootQueryArg = config.filter.propName;
                      }
                  } else {
                      throw new Error("unsupported filter type");
                  }

                  // try to find arg used to filter by checking names of root-arg and filter-arg-fields
                  const rootArgForName = rootQueryType.args.find((arg) => arg.name === rootQueryArg);
                  let filterType = rootArgForName ? buildTypeInfo(rootArgForName, gqlIntrospection) : undefined;
                  let filterVarName = undefined;
                  let filterVarValue = undefined;

                  let filterVarType = "unknown";

                  if (filterType) {
                      // there is a query root arg with same name, filter using it
                      filterVarName = rootQueryArg;
                      filterVarValue = filterVar;
                      if (filterType.typeKind === "INPUT_OBJECT" || filterType.typeKind === "ENUM") {
                          filterVarType = `GQL${filterType.typeClass}`;
                          imports.push({
                              name: filterVarType,
                              importPath: "@src/graphql.generated",
                          });
                      } else if (filterType.typeKind === "SCALAR") {
                          filterVarType = gqlScalarToTypescriptType(filterType.typeClass);
                      }
                  } else {
                      // no root-arg with same name, check filter-arg-fields
                      const rootArgFilter = rootQueryType.args.find((arg) => arg.name === "filter");
                      filterType = rootArgFilter ? buildTypeInfo(rootArgFilter, gqlIntrospection) : undefined;
                      if (filterType) {
                          filterVarName = "filter";
                          filterVarValue = `{ ${rootQueryArg}: { equal: ${filterVar} } }`;
                          // get type of field.equal in filter-arg used for filtering
                          if (filterType.inputType?.kind !== "INPUT_OBJECT") {
                              throw new Error(`Field ${String(config.name)}: Type of filter is no object-type.`);
                          }
                          const nestedFilterInput = filterType.inputType.inputFields.find((inputField) => inputField.name === rootQueryArg);
                          if (!nestedFilterInput) {
                              throw new Error(`Field ${String(config.name)}: Field filter.${rootQueryArg} does not exist`);
                          }
                          const gqlFilterInputType = buildTypeInfo(nestedFilterInput, gqlIntrospection);
                          if (!gqlFilterInputType?.inputType || gqlFilterInputType.inputType.kind !== "INPUT_OBJECT") {
                              throw new Error(
                                  `Field ${String(config.name)}: Type of filter.${rootQueryArg} is no object-type, but needs to be e.g. StringFilter-type.`,
                              );
                          }
                          const gqlFilterEqualInputType = gqlFilterInputType.inputType.inputFields.find((inputField) => inputField.name === "equal");
                          if (!gqlFilterEqualInputType) {
                              throw new Error(`Field ${String(config.name)}: Field filter.${rootQueryArg}.equal does not exist`);
                          }
                          const equalFieldType = buildTypeInfo(gqlFilterEqualInputType, gqlIntrospection);
                          if (!equalFieldType) {
                              throw new Error(
                                  `Field ${String(config.name)}: Field filter.${rootQueryArg}.equal does not exist but is required for filtering.`,
                              );
                          }
                          if (equalFieldType.typeKind === "INPUT_OBJECT" || equalFieldType.typeKind === "ENUM") {
                              filterVarType = `GQL${equalFieldType.typeClass}`;
                              imports.push({
                                  name: filterVarType,
                                  importPath: "@src/graphql.generated",
                              });
                          } else if (equalFieldType.typeKind === "SCALAR") {
                              filterVarType = gqlScalarToTypescriptType(equalFieldType.typeClass);
                          }
                      } else {
                          throw new Error(
                              `Neither filter-prop nor root-prop with name: ${rootQueryArg} for asyncSelect-query not found. Consider setting filterField.gqlVarName explicitly.`,
                          );
                      }
                  }
                  if (config.filter.type === "formProp") {
                      formProps.push({
                          name: config.filter.propName,
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

    if (!config.virtual && config.type != "asyncSelectFilter") {
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

    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);

    if (config.type == "asyncSelectFilter") {
        // add (in the gql schema) non existing value for virtual filter field
        formValueConfig.typeCode = `${name}?: { id: string; ${labelField}: string };`;
        formValueConfig.initializationCode = `${name}: data.${instanceGqlType}.${config.queryField}`;
    }

    code = `<AsyncSelectField
                ${required ? "required" : ""}
                variant="horizontal"
                fullWidth
                ${config.readOnly ? "readOnly disabled" : ""}
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
                ${filterConfig?.filterField ? `disabled={!values?.${String(filterConfig.filterField.name)}}` : ``}
            />${
                filterConfig?.filterField
                    ? `<OnChangeField name="${String(filterConfig.filterField.name)}">
                            {(value, previousValue) => {
                                if (value.id !== previousValue.id) {
                                    form.change("${String(config.name)}", undefined);
                                }
                            }}
                        </OnChangeField>`
                    : ``
            }`;

    return {
        code,
        hooksCode: "",
        formValueToGqlInputCode,
        formFragmentFields,
        gqlDocuments: {},
        imports,
        formProps,
        formValuesConfig: [formValueConfig],
        finalFormConfig,
    };
}
