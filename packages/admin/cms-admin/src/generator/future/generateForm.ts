import { IntrospectionQuery } from "graphql";

import { generateFormField } from "./generateFormField";
import { FormConfig, FormFieldConfig, GeneratorReturn } from "./generator";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { findRootBlocks } from "./utils/findRootBlocks";
import { generateFieldListGqlString } from "./utils/generateFieldList";
import { generateFormValuesTypeDefinition } from "./utils/generateFormValuesTypeDefinition";
import { generateGqlParamDefinition } from "./utils/generateGqlParamDefinition";
import { generateImportsCode, Imports } from "./utils/generateImportsCode";
import { generateInitialValuesValue } from "./utils/generateInitialValuesValue";
import { generateOutputObject } from "./utils/generateOutputObject";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormFieldConfig = FormFieldConfig<any> & { name: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleFormConfig = Omit<FormConfig<any>, "fields"> & { fields: SimpleFormFieldConfig[] };

export function generateForm(
    {
        exportName,
        baseOutputFilename,
        targetDirectory,
        gqlIntrospection,
    }: { exportName: string; baseOutputFilename: string; targetDirectory: string; gqlIntrospection: IntrospectionQuery },
    config: SimpleFormConfig,
): GeneratorReturn {
    const gqlQueryScopeParamName = "scope";
    const gqlType = config.gqlType;
    const title = config.title ?? camelCaseToHumanReadable(gqlType);
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);
    const gqlDocuments: Record<string, string> = {};
    const imports: Imports = [];

    const fieldList = generateFieldListGqlString(config.fields, gqlType, gqlIntrospection);

    const queries = gqlIntrospection.__schema.types.find((type) => type.name === "Query");
    if (!queries || queries.kind !== "OBJECT") throw new Error(`Missing Query-Type in schema. Do any queries exist?`);
    const mutations = gqlIntrospection.__schema.types.find((type) => type.name === "Mutation");
    if (!mutations || mutations.kind !== "OBJECT") throw new Error(`Missing Mutation-Type in schema. Do any mutations exist?`);

    const queryName = instanceGqlType;
    const introspectedQueryField = queries.fields.find((field) => field.name === queryName);
    if (!introspectedQueryField) throw new Error(`query "${queryName}" for ${gqlType} in schema not found`);
    const queryScopeParam = introspectedQueryField.args.find((arg) => arg.name === gqlQueryScopeParamName);

    const createMutationName = `create${gqlType}`;
    const introspectedCreateMutationField = mutations.fields.find((field) => field.name === createMutationName);
    if (!introspectedCreateMutationField) throw new Error(`create-mutation "${createMutationName}" for ${gqlType} in schema not found`);
    const createMutationScopeParam = introspectedCreateMutationField.args.find((arg) => arg.name === gqlQueryScopeParamName);

    const updateMutationName = `update${gqlType}`;
    const introspectedUpdateMutationField = mutations.fields.find((field) => field.name === updateMutationName);
    if (!introspectedUpdateMutationField) throw new Error(`update-mutation "${updateMutationName}" for ${gqlType} in schema not found`);
    const updateMutationScopeParam = introspectedUpdateMutationField.args.find((arg) => arg.name === gqlQueryScopeParamName);

    const requiresScope = !!(queryScopeParam || createMutationScopeParam || updateMutationScopeParam);

    // TODO make RootBlocks configurable (from config)
    const rootBlocks = findRootBlocks({ gqlType, targetDirectory }, gqlIntrospection);

    const readOnlyFields = config.fields.filter((field) => field.readOnly);
    readOnlyFields.forEach((field) => {
        if (field.name.includes(".")) {
            throw new Error(`Readonly is currently not support for nested fields.`);
        }
    });

    let hooksCode = "";

    const fieldsCode = config.fields
        .map<string>((field) => {
            const generated = generateFormField({ gqlIntrospection }, field, config);
            for (const name in generated.gqlDocuments) {
                gqlDocuments[name] = generated.gqlDocuments[name];
            }
            imports.push(...generated.imports);
            hooksCode += generated.hooksCode;
            return generated.code;
        })
        .join("\n");

    const fragmentName = config.fragmentName ?? `${gqlType}Form`;
    gqlDocuments[`${instanceGqlType}FormFragment`] = `
        fragment ${fragmentName} on ${gqlType} { ${fieldList} }
    `;

    gqlDocuments[`${instanceGqlType}Query`] = `
        query ${gqlType}($id: ID!${queryScopeParam ? `, $scope: ${generateGqlParamDefinition(queryScopeParam)}` : ""}) {
            ${queryName}(id: $id${queryScopeParam ? `, scope: $scope` : ""}) {
                id
                updatedAt
                ...${fragmentName}
            }
        }
        \${${`${instanceGqlType}FormFragment`}}
    `;

    gqlDocuments[`create${gqlType}Mutation`] = `
        mutation Create${gqlType}($input: ${gqlType}Input!${
        createMutationScopeParam ? `, $scope: ${generateGqlParamDefinition(createMutationScopeParam)}` : ""
    }) {
            ${createMutationName}(input: $input${createMutationScopeParam ? `, scope: $scope` : ""}) {
                id
                updatedAt
                ...${fragmentName}
            }
        }
        \${${`${instanceGqlType}FormFragment`}}
    `;

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

    const code = `import { useApolloClient, useQuery } from "@apollo/client";
    import {
        Field,
        FinalForm,
        FinalFormCheckbox,
        FinalFormInput,
        FinalFormSaveSplitButton,
        FinalFormSelect,
        FinalFormSubmitEvent,
        Loading,
        MainContent,
        TextAreaField,
        TextField,
        Toolbar,
        ToolbarActions,
        ToolbarFillSpace,
        ToolbarItem,
        ToolbarTitleItem,
        useFormApiRef,
        useStackApi,
        useStackSwitchApi,
    } from "@comet/admin";
    import { ArrowLeft, Lock } from "@comet/admin-icons";
    import { FinalFormDatePicker } from "@comet/admin-date-time";
    import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
    import { EditPageLayout, queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "@comet/cms-admin";
    import { FormControlLabel, IconButton, MenuItem, InputAdornment } from "@mui/material";
    import { FormApi } from "final-form";
    import { filter } from "graphql-anywhere";
    import isEqual from "lodash.isequal";
    import React from "react";
    import { FormattedMessage } from "react-intl";
    ${generateImportsCode(imports)}

    import {
        create${gqlType}Mutation,
        ${instanceGqlType}FormFragment,
        ${instanceGqlType}Query,
        update${gqlType}Mutation,
    } from "./${baseOutputFilename}.gql";
    import {
        GQLCreate${gqlType}Mutation,
        GQLCreate${gqlType}MutationVariables,
        GQL${fragmentName}Fragment,
        GQL${gqlType}Query,
        GQL${gqlType}QueryVariables,
        GQLUpdate${gqlType}Mutation,
        GQLUpdate${gqlType}MutationVariables,
    } from "./${baseOutputFilename}.gql.generated";
    import { useContentScope } from "@src/common/ContentScopeProvider";
    ${Object.entries(rootBlocks)
        .map(([rootBlockKey, rootBlock]) => `import { ${rootBlock.name} } from "${rootBlock.import}";`)
        .join("\n")}

    ${
        Object.keys(rootBlocks).length > 0
            ? `const rootBlocks = {
                ${Object.entries(rootBlocks).map(([rootBlockKey, rootBlock]) => `${rootBlockKey}: ${rootBlock.name}`)}
                };`
            : ""
    }

    type FormValues = ${generateFormValuesTypeDefinition({ fragmentName, rootBlocks, config, gqlType, gqlIntrospection })};

    interface FormProps {
        id?: string;
    }

    export function ${exportName}({ id }: FormProps): React.ReactElement {
        const stackApi = useStackApi();
        const client = useApolloClient();
        const mode = id ? "edit" : "add";
        const formApiRef = useFormApiRef<FormValues>();
        const stackSwitchApi = useStackSwitchApi();
        ${requiresScope ? `const { scope } = useContentScope()` : ""};

        const { data, error, loading, refetch } = useQuery<GQL${gqlType}Query, GQL${gqlType}QueryVariables>(
            ${instanceGqlType}Query,
            id ? { variables: { id${queryScopeParam ? `, scope` : ""} } } : { skip: true },
        );
    
        const initialValues = ${generateInitialValuesValue({ config, fragmentName, rootBlocks, instanceGqlType, gqlType, gqlIntrospection })};
    
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

        const handleSubmit = async (formValues: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
            if (await saveConflict.checkForConflicts()) throw new Error("Conflicts detected");
            const output = ${generateOutputObject({ rootBlocks, config })};
            if (mode === "edit") {
                if (!id) throw new Error();
                const { ${readOnlyFields.map((field) => `${String(field.name)},`).join("")} ...updateInput } = output;
                await client.mutate<GQLUpdate${gqlType}Mutation, GQLUpdate${gqlType}MutationVariables>({
                    mutation: update${gqlType}Mutation,
                    variables: { id, input: updateInput },
                });
            } else {
                const { data: mutationResponse } = await client.mutate<GQLCreate${gqlType}Mutation, GQLCreate${gqlType}MutationVariables>({
                    mutation: create${gqlType}Mutation,
                    variables: { input: output${createMutationScopeParam ? `, scope` : ""} },
                });
                if (!event.navigatingBack) {
                    const id = mutationResponse?.create${gqlType}.id;
                    if (id) {
                        setTimeout(() => {
                            stackSwitchApi.activatePage(\`edit\`, id);
                        });
                    }
                }
            }
        };

        ${hooksCode}

        if (error) throw error;

        if (loading) {
            return <Loading behavior="fillPageHeight" />;
        }

        return (
            <FinalForm<FormValues>
                apiRef={formApiRef}
                onSubmit={handleSubmit}
                mode={mode}
                initialValues={initialValues}
                initialValuesEqual={isEqual} //required to compare block data correctly
                subscription={{}}
            >
                {() => (
                    <EditPageLayout>
                        {saveConflict.dialogs}
                        <Toolbar>
                            <ToolbarItem>
                                <IconButton onClick={stackApi?.goBack}>
                                    <ArrowLeft />
                                </IconButton>
                            </ToolbarItem>
                            <ToolbarTitleItem>
                                <Field name="title">
                                    {({ input }) =>
                                        input.value ? input.value : <FormattedMessage id="${instanceGqlType}.${instanceGqlType}Detail" defaultMessage="${title} Detail" />
                                    }
                                </Field>
                            </ToolbarTitleItem>
                            <ToolbarFillSpace />
                            <ToolbarActions>
                                <FinalFormSaveSplitButton hasConflict={saveConflict.hasConflict} />
                            </ToolbarActions>
                        </Toolbar>
                        <MainContent>
                            ${fieldsCode}
                        </MainContent>
                    </EditPageLayout>
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
