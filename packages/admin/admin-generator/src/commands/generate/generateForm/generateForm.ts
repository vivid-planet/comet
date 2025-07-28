import { type IntrospectionQuery } from "graphql";

import {
    type FormConfig,
    type FormFieldConfig,
    type GeneratorReturn,
    type GQLDocumentConfigMap,
    isFormFieldConfig,
    isFormLayoutConfig,
} from "../generate-command";
import { convertConfigImport } from "../utils/convertConfigImport";
import { findMutationTypeOrThrow } from "../utils/findMutationType";
import { generateImportsCode, type Imports } from "../utils/generateImportsCode";
import { isGeneratorConfigImport } from "../utils/runtimeTypeGuards";
import { generateFields, type GenerateFieldsReturn } from "./generateFields";
import { getForwardedGqlArgs } from "./getForwardedGqlArgs";

export type Prop = { type: string; optional: boolean; name: string };
function generateFormPropsCode(props: Prop[]): { formPropsTypeCode: string; formPropsParamsCode: string } {
    if (!props.length) return { formPropsTypeCode: "", formPropsParamsCode: "" };

    const uniqueProps = props.reduce<Prop[]>((acc, item) => {
        const propWithSameName = acc.find((prop) => prop.name == item.name);
        if (!propWithSameName) return [item, ...acc];
        if (propWithSameName.type != item.type || propWithSameName.optional != item.optional) {
            // this is currently not supported
            return [item, ...acc];
        }
        return acc;
    }, []);

    return {
        formPropsTypeCode: `interface FormProps {
            ${uniqueProps.map((prop) => `${prop.name}${prop.optional ? `?` : ``}: ${prop.type};`).join("\n")}
        }`,
        formPropsParamsCode: `{${uniqueProps.map((prop) => prop.name).join(", ")}}: FormProps`,
    };
}

export function generateForm(
    {
        exportName,
        baseOutputFilename,
        targetDirectory,
        gqlIntrospection,
    }: { exportName: string; baseOutputFilename: string; targetDirectory: string; gqlIntrospection: IntrospectionQuery },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormConfig<any>,
): GeneratorReturn {
    assertValidConfig(config);

    const gqlType = config.gqlType;
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);
    const formFragmentName = config.fragmentName ?? `${gqlType}Form`;
    const gqlDocuments: GQLDocumentConfigMap = {};

    const imports: Imports = [
        { name: "FormattedMessage", importPath: "react-intl" },
        { name: "useApolloClient", importPath: "@apollo/client" },
        { name: "useQuery", importPath: "@apollo/client" },
        { name: "gql", importPath: "@apollo/client" },
        { name: "AsyncSelectField", importPath: "@comet/admin" },
        { name: "CheckboxField", importPath: "@comet/admin" },
        { name: "Field", importPath: "@comet/admin" },
        { name: "filterByFragment", importPath: "@comet/admin" },
        { name: "FinalForm", importPath: "@comet/admin" },
        { name: "FinalFormInput", importPath: "@comet/admin" },
        { name: "FinalFormRangeInput", importPath: "@comet/admin" },
        { name: "FinalFormSelect", importPath: "@comet/admin" },
        { name: "FinalFormSubmitEvent", importPath: "@comet/admin" },
        { name: "Loading", importPath: "@comet/admin" },
        { name: "NumberField", importPath: "@comet/admin" },
        { name: "RadioGroupField", importPath: "@comet/admin" },
        { name: "TextAreaField", importPath: "@comet/admin" },
        { name: "TextField", importPath: "@comet/admin" },
        { name: "useFormApiRef", importPath: "@comet/admin" },
        { name: "useStackSwitchApi", importPath: "@comet/admin" },
        { name: "ArrowLeft", importPath: "@comet/admin-icons" },
        { name: "Lock", importPath: "@comet/admin-icons" },
        { name: "DateTimeField", importPath: "@comet/admin-date-time" },
        { name: "FinalFormDatePicker", importPath: "@comet/admin-date-time" },
        { name: "BlockState", importPath: "@comet/cms-admin" },
        { name: "createFinalFormBlock", importPath: "@comet/cms-admin" },
        { name: "queryUpdatedAt", importPath: "@comet/cms-admin" },
        { name: "resolveHasSaveConflict", importPath: "@comet/cms-admin" },
        { name: "useFormSaveConflict", importPath: "@comet/cms-admin" },
        { name: "FileUploadField", importPath: "@comet/cms-admin" },
        { name: "IconButton", importPath: "@mui/material" },
        { name: "MenuItem", importPath: "@mui/material" },
        { name: "InputAdornment", importPath: "@mui/material" },
        { name: "FormApi", importPath: "final-form" },
        { name: "useMemo", importPath: "react" },
    ];
    const props: Prop[] = [];

    const mode = config.mode ?? "all";
    const editMode = mode === "edit" || mode == "all";
    const addMode = mode === "add" || mode == "all";

    const createMutationType = addMode && findMutationTypeOrThrow(config.createMutation ?? `create${gqlType}`, gqlIntrospection);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formFields = config.fields.reduce<FormFieldConfig<any>[]>((acc, field) => {
        if (isFormLayoutConfig(field)) {
            // using forEach instead of acc.push(...field.fields.filter(isFormFieldConfig)) because typescript can't handle mixed typing
            field.fields.forEach((nestedFieldConfig) => {
                if (isFormFieldConfig(nestedFieldConfig)) {
                    acc.push(nestedFieldConfig);
                }
            });
        } else if (isFormFieldConfig(field)) {
            acc.push(field);
        }
        return acc;
    }, []);

    const gqlArgs: ReturnType<typeof getForwardedGqlArgs>["gqlArgs"] = [];
    if (createMutationType) {
        const {
            imports: forwardedGqlArgsImports,
            props: forwardedGqlArgsProps,
            gqlArgs: forwardedGqlArgs,
        } = getForwardedGqlArgs({
            fields: formFields,
            gqlOperation: createMutationType,
            gqlIntrospection,
        });
        imports.push(...forwardedGqlArgsImports);
        props.push(...forwardedGqlArgsProps);
        gqlArgs.push(...forwardedGqlArgs);
    }

    if (editMode) {
        if (mode === "all") {
            props.push({ name: "id", optional: true, type: "string" });
        } else if (mode === "edit") {
            props.push({ name: "id", optional: false, type: "string" });
        }
    }

    const rootBlockFields = formFields
        .filter((field) => field.type == "block")
        .map((field) => {
            // map is for ts to infer block type correctly
            if (field.type !== "block") throw new Error("Field is not a block field");
            return field;
        });
    rootBlockFields.forEach((field) => {
        if (isGeneratorConfigImport(field.block)) {
            imports.push(convertConfigImport(field.block));
        }
    });

    const readOnlyFields = formFields.filter((field) => field.readOnly);
    const fileFields = formFields.filter((field) => field.type == "fileUpload");

    if (fileFields.length > 0) {
        imports.push({ name: "GQLFinalFormFileUploadFragment", importPath: "@comet/cms-admin" });
    }

    // Unnecessary field.type == "fileUpload" check to make TypeScript happy
    const downloadableFileFields = fileFields.filter((field) => field.type == "fileUpload" && field.download);

    if (fileFields.length > 0) {
        imports.push({ name: "GQLFinalFormFileUploadDownloadableFragment", importPath: "@comet/cms-admin" });
    }

    let hooksCode = "";
    let formValueToGqlInputCode = "";
    const formFragmentFields: string[] = [];
    const formValuesConfig: GenerateFieldsReturn["formValuesConfig"] = [];
    const { code: fieldsCode, ...generatedFields } = generateFields({
        gqlIntrospection,
        baseOutputFilename,
        fields: config.fields,
        formFragmentName,
        formConfig: config,
        gqlType: config.gqlType,
    });
    for (const name in generatedFields.gqlDocuments) {
        gqlDocuments[name] = {
            document: generatedFields.gqlDocuments[name].document,
            export: true,
        };
    }
    imports.push(...generatedFields.imports);
    props.push(...generatedFields.props);
    hooksCode += generatedFields.hooksCode;
    formValueToGqlInputCode += generatedFields.formValueToGqlInputCode;
    formFragmentFields.push(...generatedFields.formFragmentFields);
    formValuesConfig.push(...generatedFields.formValuesConfig);

    const { formPropsTypeCode, formPropsParamsCode } = generateFormPropsCode(props);

    gqlDocuments[`${instanceGqlType}FormFragment`] = {
        document: `
        fragment ${formFragmentName} on ${gqlType} {
            ${formFragmentFields.join("\n")}
        }
        ${fileFields.length > 0 && fileFields.length !== downloadableFileFields.length ? "${finalFormFileUploadFragment}" : ""}
        ${downloadableFileFields.length > 0 ? "${finalFormFileUploadDownloadableFragment}" : ""}
    `,
        export: editMode,
    };

    if (editMode) {
        gqlDocuments[`${instanceGqlType}Query`] = {
            document: `
            query ${gqlType}($id: ID!) {
                ${instanceGqlType}(id: $id) {
                    id
                    updatedAt
                    ...${formFragmentName}
                }
            }
            \${${`${instanceGqlType}FormFragment`}}
        `,
            export: true,
        };
    }

    if (addMode && createMutationType) {
        gqlDocuments[`create${gqlType}Mutation`] = {
            document: `
            mutation Create${gqlType}(${
                gqlArgs.filter((gqlArg) => !gqlArg.isInputArgSubfield).length
                    ? `${gqlArgs
                          .filter((gqlArg) => !gqlArg.isInputArgSubfield)
                          .map((gqlArg) => {
                              return `$${gqlArg.name}: ${gqlArg.type}!`;
                          })
                          .join(", ")}, `
                    : ``
            }$input: ${gqlType}Input!) {
                ${createMutationType.name}(${
                    gqlArgs.filter((gqlArg) => !gqlArg.isInputArgSubfield).length
                        ? `${gqlArgs
                              .filter((gqlArg) => !gqlArg.isInputArgSubfield)
                              .map((gqlArg) => {
                                  return `${gqlArg.name}: $${gqlArg.name}`;
                              })
                              .join(", ")}, `
                        : ``
                }input: $input) {
                    id
                    updatedAt
                    ...${formFragmentName}
                }
            }
            \${${`${instanceGqlType}FormFragment`}}
        `,
            export: true,
        };
    }

    if (editMode) {
        gqlDocuments[`update${gqlType}Mutation`] = {
            document: `
            mutation Update${gqlType}($id: ID!, $input: ${gqlType}UpdateInput!) {
                update${gqlType}(id: $id, input: $input) {
                    id
                    updatedAt
                    ...${formFragmentName}
                }
            }
            \${${`${instanceGqlType}FormFragment`}}
        `,
            export: true,
        };
    }

    for (const name in gqlDocuments) {
        const gqlDocument = gqlDocuments[name];
        imports.push({
            name: name,
            importPath: `./${baseOutputFilename}.gql`,
        });
        const match = gqlDocument.document.match(/^\s*(query|mutation|fragment)\s+(\w+)/);
        if (!match) throw new Error(`Could not find query or mutation name in ${gqlDocument}`);
        const type = match[1];
        const documentName = match[2];
        imports.push({
            name: `GQL${documentName}${type[0].toUpperCase() + type.substring(1)}`,
            importPath: `./${baseOutputFilename}.gql.generated`,
        });
        if (type !== "fragment") {
            imports.push({
                name: `GQL${documentName}${type[0].toUpperCase() + type.substring(1)}Variables`,
                importPath: `./${baseOutputFilename}.gql.generated`,
            });
        }
    }

    const finalFormSubscription = Object.keys(generatedFields.finalFormConfig?.subscription ?? {});
    const finalFormRenderProps = Object.keys(generatedFields.finalFormConfig?.renderProps ?? {});

    let filterByFragmentType = `GQL${formFragmentName}Fragment`;
    let customFilterByFragment = "";

    if (fileFields.length > 0) {
        const keysToOverride = fileFields.map((field) => field.name);

        customFilterByFragment = `type ${formFragmentName}Fragment = Omit<${filterByFragmentType}, ${keysToOverride
            .map((key) => `"${String(key)}"`)
            .join(" | ")}> & {
            ${fileFields
                .map((field) => {
                    if (field.type !== "fileUpload") {
                        throw new Error("Field is not a file upload field");
                    }

                    if (
                        ("multiple" in field && field.multiple) ||
                        ("maxFiles" in field && typeof field.maxFiles === "number" && field.maxFiles > 1)
                    ) {
                        return `${String(field.name)}: ${
                            field.download ? "GQLFinalFormFileUploadDownloadableFragment" : "GQLFinalFormFileUploadFragment"
                        }[];`;
                    }
                    return `${String(field.name)}: ${
                        field.download ? "GQLFinalFormFileUploadDownloadableFragment" : "GQLFinalFormFileUploadFragment"
                    } | null;`;
                })
                .join("\n")}
        }`;

        filterByFragmentType = `${formFragmentName}Fragment`;
    }

    const code = `
    ${generateImportsCode(imports)}
    import isEqual from "lodash.isequal";

    ${
        rootBlockFields.length > 0
            ? `const rootBlocks = {
                ${rootBlockFields.map((field) => `${String(field.name)}: ${field.block.name}`)}
                };`
            : ""
    }

    ${customFilterByFragment}

    type FormValues = ${
        formValuesConfig.filter((config) => !!config.omitFromFragmentType).length > 0 || rootBlockFields.length > 0
            ? `Omit<${filterByFragmentType}, ${[
                  ...(rootBlockFields.length > 0 ? ["keyof typeof rootBlocks"] : []),
                  ...formValuesConfig.filter((config) => !!config.omitFromFragmentType).map((config) => `"${config.omitFromFragmentType}"`),
              ].join(" | ")}>`
            : `${filterByFragmentType}`
    } ${
        formValuesConfig.filter((config) => !!config.typeCode).length > 0
            ? `& {
                ${formValuesConfig
                    .filter((config) => !!config.typeCode)
                    .map((config) => config.typeCode)
                    .join("\n")}
            }`
            : ""
    };

    ${formPropsTypeCode}

    export function ${exportName}(${formPropsParamsCode}) {
        const client = useApolloClient();
        ${mode == "all" ? `const mode = id ? "edit" : "add";` : ""}
        const formApiRef = useFormApiRef<FormValues>();
        ${addMode ? `const stackSwitchApi = useStackSwitchApi();` : ""}

        ${
            editMode
                ? `
        const { data, error, loading, refetch } = useQuery<GQL${gqlType}Query, GQL${gqlType}QueryVariables>(
            ${instanceGqlType}Query,
            ${mode == "edit" ? `{ variables: { id } }` : `id ? { variables: { id } } : { skip: true }`},
        );
        `
                : ""
        }

        ${
            editMode
                ? `const initialValues = useMemo<Partial<FormValues>>(() => data?.${instanceGqlType}
        ? {
            ...filterByFragment<${filterByFragmentType}>(${instanceGqlType}FormFragment, data.${instanceGqlType}),
            ${formValuesConfig
                .filter((config) => !!config.initializationCode)
                .map((config) => config.initializationCode)
                .join(",\n")}
        }
        : {
            ${formValuesConfig
                .filter((config) => !!config.defaultInitializationCode)
                .map((config) => config.defaultInitializationCode)
                .join(",\n")}
        }
    , [data]);`
                : `const initialValues = {
                ${formValuesConfig
                    .filter((config) => !!config.defaultInitializationCode)
                    .map((config) => config.defaultInitializationCode)
                    .join(",\n")}
            };`
        }

        ${
            editMode
                ? `
        const saveConflict = useFormSaveConflict({
            checkConflict: async () => {
                const updatedAt = await queryUpdatedAt(client, "${instanceGqlType}", id);
                return resolveHasSaveConflict(data?.${instanceGqlType}.updatedAt, updatedAt);
            },
            formApiRef,
            loadLatestVersion: async () => {
                await refetch();
            },
        });
        `
                : ""
        }

        const handleSubmit = async (${
            formValuesConfig.filter((config) => !!config.destructFromFormValues).length
                ? `{ ${formValuesConfig
                      .filter((config) => !!config.destructFromFormValues)
                      .map((config) => config.destructFromFormValues)
                      .join(", ")}, ...formValues }`
                : `formValues`
        }: FormValues, form: FormApi<FormValues>${addMode ? `, event: FinalFormSubmitEvent` : ""}) => {
            ${editMode ? `if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");` : ""}
            const output = {
                ...formValues,
                ${formValueToGqlInputCode}
            };
            ${mode == "all" ? `if (mode === "edit") {` : ""}
                ${
                    editMode
                        ? `
                ${readOnlyFields.some((field) => field.name === "id") ? "" : "if (!id) throw new Error();"}
                const { ${readOnlyFields.map((field) => `${String(field.name)},`).join("")} ...updateInput } = output;
                await client.mutate<GQLUpdate${gqlType}Mutation, GQLUpdate${gqlType}MutationVariables>({
                    mutation: update${gqlType}Mutation,
                    variables: { id, input: updateInput },
                });
                `
                        : ""
                }
            ${mode == "all" ? `} else {` : ""}
                ${
                    addMode && createMutationType
                        ? `
                const { data: mutationResponse } = await client.mutate<GQLCreate${gqlType}Mutation, GQLCreate${gqlType}MutationVariables>({
                    mutation: create${gqlType}Mutation,
                    variables: { input: ${
                        gqlArgs.filter((prop) => prop.isInputArgSubfield).length
                            ? `{ ...output, ${gqlArgs
                                  .filter((prop) => prop.isInputArgSubfield)
                                  .map((prop) => prop.name)
                                  .join(",")} }`
                            : "output"
                    }${
                        gqlArgs.filter((prop) => !prop.isInputArgSubfield).length
                            ? `, ${gqlArgs
                                  .filter((prop) => !prop.isInputArgSubfield)
                                  .map((arg) => arg.name)
                                  .join(",")}`
                            : ""
                    } },
                });
                if (!event.navigatingBack) {
                    const id = mutationResponse?.${createMutationType.name}.id;
                    if (id) {
                        setTimeout(() => {
                            stackSwitchApi.activatePage(\`edit\`, id);
                        });
                    }
                }
                `
                        : ""
                }
            ${mode == "all" ? `}` : ""}
        };

        ${hooksCode}

        ${
            editMode
                ? ` if (error) throw error;

                    if (loading) {
                        return <Loading behavior="fillPageHeight" />;
                    }`
                : ``
        }

        return (
            <FinalForm<FormValues>
                apiRef={formApiRef}
                onSubmit={handleSubmit}
                mode=${mode == "all" ? `{mode}` : editMode ? `"edit"` : `"add"`}
                initialValues={initialValues}
                initialValuesEqual={isEqual} //required to compare block data correctly
                subscription={{ ${finalFormSubscription.length ? finalFormSubscription.map((field) => `${field}: true`).join(", ") : ``} }}
            >
                {(${finalFormRenderProps.length ? `{${finalFormRenderProps.join(", ")}}` : ``}) => (
                    ${editMode ? `<>` : ``}
                        ${editMode ? `{saveConflict.dialogs}` : ``}
                        <>
                            ${fieldsCode}
                        </>
                    ${editMode ? `</>` : ``}
                )}
            </FinalForm>
        );
    }

    `;

    return {
        code,
        gqlDocuments,
    };
}

/**
 * Checks if the provided form config is valid.
 *
 * Examples of invalid configs:
 * - The "id" field is not read-only
 *
 * @param config The form config to check.
 * @throws Will throw an error if the provided config is invalid.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertValidConfig(config: FormConfig<any>) {
    function validateFields(fields: typeof config.fields) {
        for (const field of fields) {
            if (isFormFieldConfig(field)) {
                if (field.name === "id" && !field.readOnly) {
                    throw new Error(`Invalid form config: the "id" field must be read-only`);
                }
            } else if (isFormLayoutConfig(field)) {
                validateFields(field.fields);
            }
        }
    }

    validateFields(config.fields);
}
