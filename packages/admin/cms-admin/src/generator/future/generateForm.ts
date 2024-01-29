import { IntrospectionQuery } from "graphql";

import { generateFormField } from "./generateFormField";
import { FormConfig, GeneratorReturn } from "./generator";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { generateFieldListGqlString } from "./utils/generateFieldList";
import { generateImportsCode, Imports } from "./utils/generateImportsCode";

export function generateForm(
    { exportName, baseOutputFilename, gqlIntrospection }: { exportName: string; baseOutputFilename: string; gqlIntrospection: IntrospectionQuery },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: FormConfig<any>,
): GeneratorReturn {
    const gqlType = config.gqlType;
    const title = config.title ?? camelCaseToHumanReadable(gqlType);
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);
    const gqlQueries: Record<string, string> = {};
    const imports: Imports = [];

    const fieldNamesFromConfig = config.fields.map<string>((field) => field.name);
    const fieldList = generateFieldListGqlString(fieldNamesFromConfig);

    const fragmentName = config.fragmentName ?? `${gqlType}Form`;
    gqlQueries[`${instanceGqlType}FormFragment`] = `
        fragment ${fragmentName} on ${gqlType} ${fieldList}
    `;

    gqlQueries[`${instanceGqlType}Query`] = `
        query ${gqlType}($id: ID!) {
            ${instanceGqlType}(id: $id) {
                id
                updatedAt
                ...${fragmentName}
            }
        }
        \${${`${instanceGqlType}FormFragment`}}
    `;

    gqlQueries[`create${gqlType}Mutation`] = `
        mutation Create${gqlType}($input: ${gqlType}Input!) {
            create${gqlType}(input: $input) {
                id
                updatedAt
                ...${fragmentName}
            }
        }
        \${${`${instanceGqlType}FormFragment`}}
    `;

    gqlQueries[`update${gqlType}Mutation`] = `
        mutation Update${gqlType}($id: ID!, $input: ${gqlType}UpdateInput!, $lastUpdatedAt: DateTime) {
            update${gqlType}(id: $id, input: $input, lastUpdatedAt: $lastUpdatedAt) {
                id
                updatedAt
                ...${fragmentName}
            }
        }
        \${${`${instanceGqlType}FormFragment`}}
    `;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TS2589: Type instantiation is excessively deep and possibly infinite.
    const fieldsCode = config.fields
        .map((field) => {
            const generated = generateFormField({ gqlIntrospection }, field, config);
            for (const name in generated.gqlQueries) {
                gqlQueries[name] = generated.gqlQueries[name];
            }
            imports.push(...generated.imports);
            return generated.code;
        })
        .join("\n");

    const code = `import { useApolloClient, useQuery } from "@apollo/client";
    import {
        Field,
        FinalForm,
        FinalFormCheckbox,
        FinalFormInput,
        FinalFormSaveSplitButton,
        FinalFormSubmitEvent,
        Loading,
        MainContent,
        Toolbar,
        ToolbarActions,
        ToolbarFillSpace,
        ToolbarItem,
        ToolbarTitleItem,
        useFormApiRef,
        useStackApi,
        useStackSwitchApi,
    } from "packages/admin/admin/src/index";
    import { ArrowLeft } from "packages/admin/admin-icons/src/index";
    import { BlockState, createFinalFormBlock } from "packages/admin/blocks-admin/src/index";
    import { DamImageBlock, EditPageLayout, queryUpdatedAt, resolveHasSaveConflict, useFormSaveConflict } from "packages/admin/cms-admin/src/index";
    import { FormControlLabel, IconButton, MenuItem } from "@mui/material";
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
    } from "./${baseOutputFilename}.generated.gql";
    import {
        GQLCreate${gqlType}Mutation,
        GQLCreate${gqlType}MutationVariables,
        GQL${gqlType}FormFragment,
        GQL${gqlType}Query,
        GQL${gqlType}QueryVariables,
        GQLUpdate${gqlType}Mutation,
        GQLUpdate${gqlType}MutationVariables,
    } from "./${baseOutputFilename}.generated.gql.generated";
    
    interface FormProps {
        id?: string;
    }
    
    type FormValues = GQL${gqlType}FormFragment;
    
    export function ${exportName}({ id }: FormProps): React.ReactElement {
        const stackApi = useStackApi();
        const client = useApolloClient();
        const mode = id ? "edit" : "add";
        const formApiRef = useFormApiRef<FormValues>();
        const stackSwitchApi = useStackSwitchApi();
    
        const { data, error, loading, refetch } = useQuery<GQL${gqlType}Query, GQL${gqlType}QueryVariables>(
            ${instanceGqlType}Query,
            id ? { variables: { id } } : { skip: true },
        );
    
        const initialValues: Partial<FormValues> = data?.${instanceGqlType}
            ? {
                  ...filter<GQL${gqlType}FormFragment>(${instanceGqlType}FormFragment, data.${instanceGqlType}),
              }
            : {
              };
    
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
            const output = {
                ...formValues
            };
            if (mode === "edit") {
                if (!id) throw new Error();
                await client.mutate<GQLUpdate${gqlType}Mutation, GQLUpdate${gqlType}MutationVariables>({
                    mutation: update${gqlType}Mutation,
                    variables: { id, input: output, lastUpdatedAt: data?.${instanceGqlType}.updatedAt },
                });
            } else {
                const { data: mutationReponse } = await client.mutate<GQLCreate${gqlType}Mutation, GQLCreate${gqlType}MutationVariables>({
                    mutation: create${gqlType}Mutation,
                    variables: { input: output },
                });
                if (!event.navigatingBack) {
                    const id = mutationReponse?.create${gqlType}.id;
                    if (id) {
                        setTimeout(() => {
                            stackSwitchApi.activatePage(\`edit\`, id);
                        });
                    }
                }
            }
        };
    
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
        gqlQueries,
    };
}
