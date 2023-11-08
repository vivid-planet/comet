import {
    IntrospectionEnumType,
    IntrospectionField,
    IntrospectionInputObjectType,
    IntrospectionInputValue,
    IntrospectionObjectType,
    IntrospectionQuery,
} from "graphql";

import { CrudGeneratorConfig } from "./types";
import { buildNameVariants } from "./utils/buildNameVariants";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { findRootBlocks, RootBlockConfig } from "./utils/findRootBlocks";
import { writeGenerated } from "./utils/writeGenerated";

type FormField = {
    name: string;
    nullable: boolean;
} & (
    | { kind: "enum"; values: string[] }
    | { kind: "rootBlock"; rootBlock: RootBlockConfig }
    | { kind: "nestedObject"; fields: FormField[] }
    | { kind: "boolean" | "dateTime" | "string" | "float" | "int" }
);

function buildFormFieldsFromSchema(
    fields: readonly IntrospectionField[],
    inputFields: readonly IntrospectionInputValue[],
    { rootBlocks, schema }: { rootBlocks: Record<string, RootBlockConfig>; schema: IntrospectionQuery },
): FormField[] {
    return fields
        .map((field): FormField | null => {
            const type = field.type.kind === "NON_NULL" ? field.type.ofType : field.type;

            const inputField = inputFields.find((inputField) => inputField.name === field.name);
            if (!inputField) return null; //input doesn't exist for field, skip

            const inputType = inputField.type.kind === "NON_NULL" ? inputField.type.ofType : inputField.type;
            const nullable = inputField.type.kind === "NON_NULL" ? true : false;

            if (type.kind === "SCALAR" && rootBlocks[field.name]) {
                return {
                    name: field.name,
                    nullable,
                    kind: "rootBlock",
                    rootBlock: rootBlocks[field.name],
                };
            } else if (type.kind === "ENUM") {
                const enumType = schema.__schema.types.find((t) => t.kind === "ENUM" && t.name === type.name) as IntrospectionEnumType | undefined;
                if (!enumType) throw new Error(`Enum type not found`);
                const values = enumType.enumValues.map((i) => i.name);
                return {
                    name: field.name,
                    nullable,
                    kind: "enum",
                    values,
                };
            } else if (type.kind === "SCALAR" && type.name === "Boolean") {
                return {
                    name: field.name,
                    nullable,
                    kind: "boolean",
                };
            } else if (type.kind === "SCALAR" && type.name === "DateTime") {
                return {
                    name: field.name,
                    nullable,
                    kind: "dateTime",
                };
            } else if (type.kind === "SCALAR" && type.name === "String") {
                return {
                    name: field.name,
                    nullable,
                    kind: "string",
                };
            } else if (type.kind === "SCALAR" && type.name === "Float") {
                return {
                    name: field.name,
                    nullable,
                    kind: "float",
                };
            } else if (type.kind === "SCALAR" && type.name === "Int") {
                return {
                    name: field.name,
                    nullable,
                    kind: "int",
                };
            } else if (type.kind === "OBJECT" && inputType.kind === "INPUT_OBJECT") {
                const nestedType = schema.__schema.types.find((t) => t.kind === "OBJECT" && t.name === type.name) as
                    | IntrospectionObjectType
                    | undefined;
                if (!nestedType) throw new Error(`nested object type not found`);

                const nestedInputType = schema.__schema.types.find((t) => t.kind === "INPUT_OBJECT" && t.name === inputType.name) as
                    | IntrospectionInputObjectType
                    | undefined;
                if (!nestedInputType) throw new Error(`nested input object type not found`);

                return {
                    name: field.name,
                    nullable,
                    kind: "nestedObject",
                    fields: buildFormFieldsFromSchema(nestedType.fields, nestedInputType.inputFields, { rootBlocks, schema }),
                };
            } else if (type.kind === "OBJECT" && inputType.kind === "SCALAR" && inputType.name === "ID") {
                //TODO add support for referenced id (Select)
                return null;
            } else if (type.kind === "LIST") {
                //TODO add support for referenced id (Multi Select)
                return null;
            } else {
                return null;
            }
        })
        .filter((field) => field !== null) as FormField[];
}

export async function writeCrudForm(generatorConfig: CrudGeneratorConfig, schema: IntrospectionQuery): Promise<void> {
    const { target: targetDirectory, entityName } = generatorConfig;
    const { classNameSingular, instanceNamePlural } = buildNameVariants(entityName);
    const rootBlocks = findRootBlocks(generatorConfig, schema);
    const instanceEntityName = entityName[0].toLowerCase() + entityName.substring(1);

    const schemaEntity = schema.__schema.types.find((type) => type.kind === "OBJECT" && type.name === entityName) as
        | IntrospectionObjectType
        | undefined;
    if (!schemaEntity) throw new Error("didn't find entity in schema types");

    const updateSchemaEntity = schema.__schema.types.find((type) => type.kind === "INPUT_OBJECT" && type.name === `${entityName}UpdateInput`) as
        | IntrospectionInputObjectType
        | undefined;
    if (!updateSchemaEntity) throw new Error("didn't find UpdateInput in schema types");

    const filteredSchemaFields = schemaEntity.fields.filter((field) => {
        if (field.name === "id" || field.name === "updatedAt" || field.name === "createdAt" || field.name === "scope") return false;
        return true;
    });
    const formFields = buildFormFieldsFromSchema(filteredSchemaFields, updateSchemaEntity.inputFields, { rootBlocks, schema });

    const hasScope = schemaEntity.fields.some((field) => {
        return field.name === "scope";
    });

    function buildFormFragment(formFields: FormField[]): string {
        return formFields
            .map((field) => {
                if (field.kind == "nestedObject") {
                    return `${field.name} {${buildFormFragment(field.fields)}}`;
                } else {
                    return field.name;
                }
            })
            .join("\n");
    }

    const outGql = `
    import { gql } from "@apollo/client";

    export const ${instanceEntityName}FormFragment = gql\`
        fragment ${entityName}Form on ${entityName} {
            ${buildFormFragment(formFields)}
        }
        \`;
    
    export const ${instanceEntityName}FormQuery = gql\`
        query ${entityName}Form($id: ID!) {
            ${instanceEntityName}(id: $id) {
                id
                updatedAt
                ...${entityName}Form
            }
        }
        \${${instanceEntityName}FormFragment}
    \`;
    
    export const ${instanceEntityName}FormCheckForChangesQuery = gql\`
        query ${entityName}FormCheckForChanges($id: ID!) {
            ${instanceEntityName}(id: $id) {
                updatedAt
            }
        }
    \`;

    export const create${entityName}Mutation = gql\`
        mutation Create${entityName}(${hasScope ? `$scope: ${entityName}ContentScopeInput!, ` : ""}$input: ${entityName}Input!) {
            create${entityName}(${hasScope ? `scope: $scope, ` : ""}input: $input) {
                id
                updatedAt
                ...${entityName}Form
            }
        }
        \${${instanceEntityName}FormFragment}
    \`
    
    export const update${entityName}Mutation = gql\`
        mutation Update${entityName}($id: ID!, $input: ${entityName}UpdateInput!, $lastUpdatedAt: DateTime) {
            update${entityName}(id: $id, input: $input, lastUpdatedAt: $lastUpdatedAt) {
                id
                updatedAt
                ...${entityName}Form
            }
        }
        \${${instanceEntityName}FormFragment}
    \`;
    
    `;
    writeGenerated(`${targetDirectory}/${entityName}Form.gql.tsx`, outGql);

    const numberFields = formFields.filter((field) => {
        return field.kind == "float" || field.kind == "int";
    });
    const booleanFields = formFields.filter((field) => {
        return field.kind == "boolean";
    });

    const out = `
    import { useApolloClient, useQuery } from "@apollo/client";
    import {
        Field,
        FinalForm,
        FinalFormInput,
        FinalFormSaveSplitButton,
        FinalFormSelect,
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
        FinalFormCheckbox,
        FormSection,
    } from "@comet/admin";
    import { ArrowLeft } from "@comet/admin-icons";
    import { FinalFormDatePicker } from "@comet/admin-date-time";
    import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
    import { EditPageLayout, resolveHasSaveConflict, useFormSaveConflict, queryUpdatedAt } from "@comet/cms-admin";
    import { IconButton, FormControlLabel, MenuItem } from "@mui/material";
    import { FormApi } from "final-form";
    import { filter } from "graphql-anywhere";
    import isEqual from "lodash.isequal";
    import React from "react";
    import { FormattedMessage } from "react-intl";
    import { useContentScope } from "@src/common/ContentScopeProvider";
    import { create${entityName}Mutation, ${instanceEntityName}CheckForChangesQuery, ${instanceEntityName}FormFragment, ${instanceEntityName}FormQuery, update${entityName}Mutation } from "./${entityName}Form.gql";
    import {
        GQL${entityName}FormCheckForChangesQuery,
        GQL${entityName}FormCheckForChangesQueryVariables,
        GQLCreate${entityName}Mutation,
        GQLCreate${entityName}MutationVariables,
        GQL${entityName}FormFragment,
        GQLUpdate${entityName}Mutation,
        GQLUpdate${entityName}MutationVariables,
        GQL${entityName}FormQuery,
        GQL${entityName}FormQueryVariables,
    } from "./${entityName}Form.gql.generated";
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
    
    type FormValues = ${
        numberFields.length > 0
            ? `Omit<GQL${entityName}FormFragment, ${numberFields.map((field) => `"${field.name}"`).join(", ")}>`
            : `GQL${entityName}FormFragment`
    } ${
        numberFields.length > 0 || Object.keys(rootBlocks).length > 0
            ? `& {
        ${numberFields.map((field) => `${field.name}: string;`).join("\n")}
        ${Object.keys(rootBlocks)
            .map((rootBlockKey) => `${rootBlockKey}: BlockState<typeof rootBlocks.${rootBlockKey}>;`)
            .join("\n")}
    }`
            : ""
    };

    interface FormProps {
        id?: string;
    }

    export function ${entityName}Form({ id }: FormProps): React.ReactElement {
        const stackApi = useStackApi();
        const client = useApolloClient();
        const mode = id ? "edit" : "add";
        const formApiRef = useFormApiRef<FormValues>();
        const stackSwitchApi = useStackSwitchApi();
        ${hasScope ? `const { scope } = useContentScope();` : ""}
    
        const { data, error, loading, refetch } = useQuery<GQL${entityName}FormQuery, GQL${entityName}FormQueryVariables>(${instanceEntityName}FormQuery,
            id ? { variables: { id } } : { skip: true },
        );
    
        const initialValues = React.useMemo<Partial<FormValues>>(() => data?.${instanceEntityName}
            ? {
                  ...filter<GQL${entityName}FormFragment>(${instanceEntityName}FormFragment, data.${instanceEntityName}),
                  ${numberFields.map((field) => `${field.name}: String(data.${instanceEntityName}.${field.name}),`).join("\n")}
                  ${Object.keys(rootBlocks)
                      .map((rootBlockKey) => `${rootBlockKey}: rootBlocks.${rootBlockKey}.input2State(data.${instanceEntityName}.${rootBlockKey}),`)
                      .join("\n")}
              }
            : {
                ${booleanFields.map((field) => `${field.name}: false,`).join("\n")}
                ${Object.keys(rootBlocks)
                    .map((rootBlockKey) => `${rootBlockKey}: rootBlocks.${rootBlockKey}.defaultValues(),`)
                    .join("\n")}
              }
        , [data]);
    
        const saveConflict = useFormSaveConflict({
            checkConflict: async () => {
                const updatedAt = await queryUpdatedAt(client, "${instanceEntityName}", id);
                return resolveHasSaveConflict(data?.${instanceEntityName}.updatedAt, updatedAt);
            },
            formApiRef,
            loadLatestVersion: async () => {
                await refetch();
            },
        });
    
        const handleSubmit = async (state: FormValues, form: FormApi<FormValues>, event: FinalFormSubmitEvent) => {
            if (await saveConflict.checkForConflicts()) {
                throw new Error("Conflicts detected");
            }
    
            const output = {
                ...state,
                ${numberFields.map((field) => `${field.name}: parseFloat(state.${field.name}),`).join("\n")}
                ${Object.keys(rootBlocks)
                    .map((rootBlockKey) => `${rootBlockKey}: rootBlocks.${rootBlockKey}.state2Output(state.${rootBlockKey}),`)
                    .join("\n")}
            };
    
            if (mode === "edit") {
                if (!id) {
                    throw new Error("Missing id in edit mode");
                }
                await client.mutate<GQLUpdate${entityName}Mutation, GQLUpdate${entityName}MutationVariables>({
                    mutation: update${entityName}Mutation,
                    variables: { id, input: output, lastUpdatedAt: data?.${instanceEntityName}?.updatedAt },
                });
            } else {
                const { data: mutationReponse } = await client.mutate<GQLCreate${entityName}Mutation, GQLCreate${entityName}MutationVariables>({
                    mutation: create${entityName}Mutation,
                    variables: { ${hasScope ? `scope, ` : ""}input: output },
                });
                if (!event.navigatingBack) {
                    const id = mutationReponse?.create${entityName}.id;
                    if (id) {
                        setTimeout(() => {
                            stackSwitchApi.activatePage("edit", id);
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
                onAfterSubmit={(values, form) => {
                    //don't go back automatically
                }}
            >
                {({ values }) => (
                    <EditPageLayout>
                        {saveConflict.dialogs}
                        <Toolbar>
                            <ToolbarItem>
                                <IconButton onClick={stackApi?.goBack}>
                                    <ArrowLeft />
                                </IconButton>
                            </ToolbarItem>
                            <ToolbarTitleItem>
                                <FormattedMessage id="${instanceNamePlural}.${classNameSingular}" defaultMessage="${camelCaseToHumanReadable(
        classNameSingular,
    )}" />
                            </ToolbarTitleItem>
                            <ToolbarFillSpace />
                            <ToolbarActions>
                                <FinalFormSaveSplitButton />
                            </ToolbarActions>
                        </Toolbar>
                        <MainContent>
                            ${formFields.map((field) => generateField(generatorConfig, field)).join("\n")}
                        </MainContent>
                    </EditPageLayout>
                )}
            </FinalForm>
        );
    }
    `;

    writeGenerated(`${targetDirectory}/${entityName}Form.tsx`, out);
}

function generateField(
    { entityName, ...generatorConfig }: CrudGeneratorConfig,
    field: FormField,
    { fieldNamePrefix = "" }: { fieldNamePrefix?: string } = {},
): string {
    const instanceEntityName = entityName[0].toLowerCase() + entityName.substring(1);

    const label = camelCaseToHumanReadable(field.name);
    if (field.kind == "rootBlock") {
        return `<Field name="${fieldNamePrefix}${field.name}" isEqual={isEqual}>
            {createFinalFormBlock(rootBlocks.${field.name})}
        </Field>`;
    } else if (field.kind == "enum") {
        return `<Field
            fullWidth
            name="${fieldNamePrefix}${field.name}"
            label={<FormattedMessage id="${instanceEntityName}.${field.name}" defaultMessage="${label}" />}>
            {(props) => 
                <FinalFormSelect {...props}>
                ${field.values
                    .map((value) => {
                        const id = `${instanceEntityName}.${field.name}.${value.charAt(0).toLowerCase() + value.slice(1)}`;
                        const label = `<FormattedMessage id="${id}" defaultMessage="${camelCaseToHumanReadable(value)}" />`;
                        return `<MenuItem value="${value}">${label}</MenuItem>`;
                    })
                    .join("\n")}
                </FinalFormSelect>
            }
        </Field>`;
    } else if (field.kind == "boolean") {
        return `<Field name="${fieldNamePrefix}${field.name}" label="" type="checkbox" fullWidth>
                {(props) => (
                    <FormControlLabel
                        label={<FormattedMessage id="${instanceEntityName}.${field.name}" defaultMessage="${label}" />}
                        control={<FinalFormCheckbox {...props} />}
                    />
                )}
            </Field>`;
    } else if (field.kind == "nestedObject") {
        return `<FormSection title={<FormattedMessage id="${instanceEntityName}.${field.name}" defaultMessage="${label}" />}>
            ${field.fields
                .map((innerField) => generateField({ ...generatorConfig, entityName }, innerField, { fieldNamePrefix: `${field.name}.` }))
                .join("\n")}
        </FormSection>`;
    } else {
        let component;
        let additionalProps = "";
        if (field.kind == "dateTime") {
            //TODO DateTime vs Date
            component = "FinalFormDatePicker";
        } else if (field.kind == "string") {
            component = "FinalFormInput";
        } else if (field.kind == "float") {
            component = "FinalFormInput";
            additionalProps += 'type="number"';
            //TODO MUI suggest not using type=number https://mui.com/material-ui/react-text-field/#type-quot-number-quot
        } else if (field.kind == "int") {
            component = "FinalFormInput";
            additionalProps += 'type="number"';
            //TODO
        } else {
            //unknown type
            return "";
        }
        return `<Field ${!field.nullable ? "required" : ""}
                    fullWidth
                    name="${fieldNamePrefix}${field.name}"
                    component={${component}}
                    ${additionalProps}
                    label={<FormattedMessage id="${instanceEntityName}.${field.name}" defaultMessage="${label}" />}
                />`;
    }
}
