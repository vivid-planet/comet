import { IntrospectionQuery } from "graphql";

import { generateFormField } from "./generateFormField";
import { FormConfig, FormFieldConfig, GeneratorReturn } from "./generator";
import { findRootBlocks } from "./utils/findRootBlocks";
import { generateImportsCode, Imports } from "./utils/generateImportsCode";
import { isFieldOptional } from "./utils/isFieldOptional";

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

    const rootBlockFields = config.fields
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

    const numberFields = config.fields.filter((field) => field.type == "number");
    const booleanFields = config.fields.filter((field) => field.type == "boolean");
    const dateFields = config.fields.filter((field) => field.type == "date");
    const readOnlyFields = config.fields.filter((field) => field.readOnly);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isOptional = (fieldConfig: FormFieldConfig<any>) => {
        return isFieldOptional({ config: fieldConfig, gqlIntrospection: gqlIntrospection, gqlType: gqlType });
    };

    let hooksCode = "";
    let formValueToGqlInputCode = "";

    const formFragmentFields: string[] = [];
    const fieldsCode = config.fields
        .map((field) => {
            const generated = generateFormField({ gqlIntrospection }, field, config);
            for (const name in generated.gqlDocuments) {
                gqlDocuments[name] = generated.gqlDocuments[name];
            }
            imports.push(...generated.imports);
            hooksCode += generated.hooksCode;
            formValueToGqlInputCode += generated.formValueToGqlInputCode;
            formFragmentFields.push(generated.formFragmentField);
            return generated.code;
        })
        .join("\n");

    const fragmentName = config.fragmentName ?? `${gqlType}Form`;
    gqlDocuments[`${instanceGqlType}FormFragment`] = `
        fragment ${fragmentName} on ${gqlType} {
            ${formFragmentFields.join("\n")}
        }
    `;

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

    gqlDocuments[`create${gqlType}Mutation`] = `
        mutation Create${gqlType}($input: ${gqlType}Input!) {
            create${gqlType}(input: $input) {
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

    const code = `import { useApolloClient, useQuery } from "@apollo/client";
    import {
        Field,
        FinalForm,
        FinalFormCheckbox,
        FinalFormInput,
        FinalFormSelect,
        FinalFormSubmitEvent,
        Loading,
        MainContent,
        TextAreaField,
        TextField,
        useFormApiRef,
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
    ${
        rootBlockFields.length > 0
            ? `const rootBlocks = {
                ${rootBlockFields.map((field) => `${String(field.name)}: ${field.block.name}`)}
                };`
            : ""
    }

    type FormValues = ${
        numberFields.length > 0
            ? `Omit<GQL${fragmentName}Fragment, ${numberFields.map((field) => `"${String(field.name)}"`).join(" | ")}>`
            : `GQL${fragmentName}Fragment`
    } ${
        numberFields.length > 0 || rootBlockFields.length > 0
            ? `& {
        ${numberFields.map((field) => `${String(field.name)}${isOptional(field) ? `?` : ``}: string;`).join("\n")}
        ${rootBlockFields.map((field) => `${String(field.name)}: BlockState<typeof rootBlocks.${String(field.name)}>;`).join("\n")}
    }`
            : ""
    };

    interface FormProps {
        id?: string;
    }
    
    export function ${exportName}({ id }: FormProps): React.ReactElement {
        const client = useApolloClient();
        const mode = id ? "edit" : "add";
        const formApiRef = useFormApiRef<FormValues>();
        const stackSwitchApi = useStackSwitchApi();
    
        const { data, error, loading, refetch } = useQuery<GQL${gqlType}Query, GQL${gqlType}QueryVariables>(
            ${instanceGqlType}Query,
            id ? { variables: { id } } : { skip: true },
        );
    
        const initialValues = React.useMemo<Partial<FormValues>>(() => data?.${instanceGqlType}
        ? {
            ...filter<GQL${fragmentName}Fragment>(${instanceGqlType}FormFragment, data.${instanceGqlType}),
            ${numberFields
                .map((field) => {
                    let assignment = `String(data.${instanceGqlType}.${String(field.name)})`;
                    if (isOptional(field)) {
                        assignment = `data.${instanceGqlType}.${String(field.name)} ? ${assignment} : undefined`;
                    }
                    return `${String(field.name)}: ${assignment},`;
                })
                .join("\n")}
            ${dateFields
                .map(
                    (field) =>
                        `${String(field.name)}: data.${instanceGqlType}.${String(field.name)} ? new Date(data.${instanceGqlType}.${String(
                            field.name,
                        )}) : undefined,`,
                )
                .join("\n")}
            ${rootBlockFields
                .map((field) => `${String(field.name)}: rootBlocks.${String(field.name)}.input2State(data.${instanceGqlType}.${String(field.name)}),`)
                .join("\n")}
        }
        : {
            ${booleanFields.map((field) => `${String(field.name)}: false,`).join("\n")}
            ${rootBlockFields.map((field) => `${String(field.name)}: rootBlocks.${String(field.name)}.defaultValues(),`).join("\n")}
        }
    , [data]);
    
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
                ...formValues,
                ${formValueToGqlInputCode}
            };
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
                    variables: { input: output },
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
