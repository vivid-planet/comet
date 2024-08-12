import { IntrospectionQuery } from "graphql";

import { generateFields, GenerateFieldsReturn } from "./generateForm/generateFields";
import { getForwardedGqlArgs } from "./generateForm/getForwardedGqlArgs";
import { FormConfig, FormFieldConfig, GeneratorReturn, isFormFieldConfig, isFormLayoutConfig } from "./generator";
import { findMutationTypeOrThrow } from "./utils/findMutationType";
import { generateImportsCode, Imports } from "./utils/generateImportsCode";

export type Prop = { type: string; optional: boolean; name: string };
function generateFormPropsCode(props: Prop[]): { formPropsTypeCode: string; formPropsParamsCode: string } {
    if (!props.length) return { formPropsTypeCode: "", formPropsParamsCode: "" };
    return {
        formPropsTypeCode: `interface FormProps {
            ${props.map((prop) => `${prop.name}${prop.optional ? `?` : ``}: ${prop.type};`).join("\n")}
        }`,
        formPropsParamsCode: `{${props.map((prop) => prop.name).join(", ")}}: FormProps`,
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
    const gqlType = config.gqlType;
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);
    const gqlDocuments: Record<string, string> = {};
    const imports: Imports = [];
    const props: Prop[] = [];

    const mode = config.mode ?? "all";
    const editMode = mode === "edit" || mode == "all";
    const addMode = mode === "add" || mode == "all";

    const createMutationType = addMode && findMutationTypeOrThrow(config.createMutation ?? `create${gqlType}`, gqlIntrospection);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formFields = config.fields.reduce<FormFieldConfig<any>[]>((acc, field) => {
        if (isFormLayoutConfig(field)) {
            acc.push(...field.fields);
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

    const { formPropsTypeCode, formPropsParamsCode } = generateFormPropsCode(props);

    const rootBlockFields = formFields
        .filter((field) => field.type == "block")
        .map((field) => {
            // map is for ts to infer block type correctly
            if (field.type !== "block") throw new Error("Field is not a block field");
            return field;
        });
    rootBlockFields.forEach((field) => {
        imports.push({
            name: field.block.name,
            importPath: field.block.import,
        });
    });

    const readOnlyFields = formFields.filter((field) => field.readOnly);

    let hooksCode = "";
    let formValueToGqlInputCode = "";
    const formFragmentFields: string[] = [];
    const formValuesConfig: GenerateFieldsReturn["formValuesConfig"] = [];
    const { code: fieldsCode, ...generatedFields } = generateFields({
        gqlIntrospection,
        baseOutputFilename,
        fields: config.fields,
        formConfig: config,
    });
    for (const name in generatedFields.gqlDocuments) {
        gqlDocuments[name] = generatedFields.gqlDocuments[name];
    }
    imports.push(...generatedFields.imports);
    hooksCode += generatedFields.hooksCode;
    formValueToGqlInputCode += generatedFields.formValueToGqlInputCode;
    formFragmentFields.push(...generatedFields.formFragmentFields);
    formValuesConfig.push(...generatedFields.formValuesConfig);

    const fragmentName = config.fragmentName ?? `${gqlType}Form`;
    gqlDocuments[`${instanceGqlType}FormFragment`] = `
        fragment ${fragmentName} on ${gqlType} {
            ${formFragmentFields.join("\n")}
        }
    `;

    if (editMode) {
        gqlDocuments[`${instanceGqlType}Query`] = `
            query ${gqlType}($id: ID!) {
                ${instanceGqlType}(id: $id) {
                    id
                    updatedAt
                    ...${fragmentName}
                }
            }
            \${${`${instanceGqlType}FormFragment`}}
        `;
    }

    if (addMode && createMutationType) {
        gqlDocuments[`create${gqlType}Mutation`] = `
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
                    ...${fragmentName}
                }
            }
            \${${`${instanceGqlType}FormFragment`}}
        `;
    }

    if (editMode) {
        gqlDocuments[`update${gqlType}Mutation`] = `
            mutation Update${gqlType}($id: ID!, $input: ${gqlType}UpdateInput!) {
                update${gqlType}(id: $id, input: $input) {
                    id
                    updatedAt
                    ...${fragmentName}
                }
            }
            \${${`${instanceGqlType}FormFragment`}}
        `;
    }

    for (const name in gqlDocuments) {
        const gqlDocument = gqlDocuments[name];
        imports.push({
            name: name,
            importPath: `./${baseOutputFilename}.gql`,
        });
        const match = gqlDocument.match(/^\s*(query|mutation|fragment)\s+(\w+)/);
        if (!match) throw new Error(`Could not find query or mutation name in ${gqlDocument}`);
        const type = match[1];
        const documentName = match[2];
        imports.push({
            name: `GQL${documentName}${type[0].toUpperCase() + type.substring(1)}`,
            importPath: `./${baseOutputFilename}.gql.generated`,
        });
        imports.push({
            name: `GQL${documentName}${type[0].toUpperCase() + type.substring(1)}Variables`,
            importPath: `./${baseOutputFilename}.gql.generated`,
        });
    }

    const code = `import { useApolloClient, useQuery, gql } from "@apollo/client";
    import {
        AsyncSelectField,
        Field,
        filterByFragment,
        FieldContainer,
        FinalForm,
        FinalFormCheckbox,
        FinalFormInput,
        FinalFormRadio,
        FinalFormSelect,
        FinalFormSubmitEvent,
        Loading,
        MainContent,
        RadioGroupField,
        TextAreaField,
        TextField,
        useFormApiRef,
        useStackSwitchApi,
    } from "@comet/admin";
    import { ArrowLeft, Lock } from "@comet/admin-icons";
    import { FinalFormDatePicker } from "@comet/admin-date-time";
    import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
    import { queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
    import { FormControlLabel, IconButton, MenuItem, InputAdornment } from "@mui/material";
    import { FormApi } from "final-form";
    import isEqual from "lodash.isequal";
    import React from "react";
    import { FormattedMessage } from "react-intl";
    ${generateImportsCode(imports)}
    ${
        rootBlockFields.length > 0
            ? `const rootBlocks = {
                ${rootBlockFields.map((field) => `${String(field.name)}: ${field.block.name}`)}
                };`
            : ""
    }

    type FormValues = ${
        formValuesConfig.filter((config) => !!config.omitFromFragmentType).length > 0
            ? `Omit<GQL${fragmentName}Fragment, ${formValuesConfig
                  .filter((config) => !!config.omitFromFragmentType)
                  .map((config) => `"${config.omitFromFragmentType}"`)
                  .join(" | ")}>`
            : `GQL${fragmentName}Fragment`
    } ${
        formValuesConfig.length > 0
            ? `& {
                ${formValuesConfig
                    .filter((config) => !!config.typeCode)
                    .map((config) => config.typeCode)
                    .join("\n")}
            }`
            : ""
    };

    ${formPropsTypeCode}

    export function ${exportName}(${formPropsParamsCode}): React.ReactElement {
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
                ? `const initialValues = React.useMemo<Partial<FormValues>>(() => data?.${instanceGqlType}
        ? {
            ...filterByFragment<GQL${fragmentName}Fragment>(${instanceGqlType}FormFragment, data.${instanceGqlType}),
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

        const handleSubmit = async (formValues: FormValues, form: FormApi<FormValues>${addMode ? `, event: FinalFormSubmitEvent` : ""}) => {
            ${editMode ? `if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");` : ""}
            const output = {
                ...formValues,
                ${formValueToGqlInputCode}
            };
            ${mode == "all" ? `if (mode === "edit") {` : ""}
                ${
                    editMode
                        ? `
                if (!id) throw new Error();
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
                subscription={{}}
            >
                {() => (
                    ${editMode ? `<>` : ``}
                        ${editMode ? `{saveConflict.dialogs}` : ``}
                        <MainContent>
                            ${fieldsCode}
                        </MainContent>
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
