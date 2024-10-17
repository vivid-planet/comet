import {
    IntrospectionEnumType,
    IntrospectionField,
    IntrospectionInputObjectType,
    IntrospectionNamedTypeRef,
    IntrospectionObjectType,
    IntrospectionQuery,
} from "graphql";

import { CrudGeneratorConfig } from "./types";
import { buildNameVariants } from "./utils/buildNameVariants";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { findRootBlocks } from "./utils/findRootBlocks";
import { writeGenerated } from "./utils/writeGenerated";

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
    const inputFieldNames = updateSchemaEntity.inputFields.map((field) => field.name);

    const formFields = schemaEntity.fields
        .filter((field) => {
            if (field.name === "id" || field.name === "updatedAt" || field.name === "createdAt" || field.name === "scope") return false;
            if (!inputFieldNames.includes(field.name)) return false;
            return true;
        })
        .filter((field) => {
            let type = field.type;
            if (type.kind == "NON_NULL") type = type.ofType;
            if (type.kind == "LIST") return false;
            if (type.kind == "OBJECT") return false; //TODO support nested objects
            return true;
        });

    const hasScope = schemaEntity.fields.some((field) => {
        return field.name === "scope";
    });

    const outGql = `
    import { gql } from "@apollo/client";

    export const ${instanceEntityName}FormFragment = gql\`
        fragment ${entityName}Form on ${entityName} {
            ${formFields.map((field) => field.name).join("\n")}
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
        mutation Update${entityName}($id: ID!, $input: ${entityName}UpdateInput!) {
            update${entityName}(id: $id, input: $input) {
                id
                updatedAt
                ...${entityName}Form
            }
        }
        \${${instanceEntityName}FormFragment}
    \`;
    
    `;
    writeGenerated(`${targetDirectory}/${entityName}Form.gql.ts`, outGql);

    const numberFields = formFields.filter((field) => {
        const type = field.type.kind === "NON_NULL" ? field.type.ofType : field.type;
        return type.kind == "SCALAR" && (type.name == "Float" || type.name == "Int");
    });
    const booleanFields = formFields.filter((field) => {
        const type = field.type.kind === "NON_NULL" ? field.type.ofType : field.type;
        return type.kind == "SCALAR" && type.name == "Boolean";
    });

    const out = `
    import { useApolloClient, useQuery } from "@apollo/client";
    import {
        CheckboxField,
        DateTimeField,
        Field,
        filterByFragment,
        FinalForm,
        FinalFormInput,
        FinalFormSaveButton,
        FinalFormSelect,
        FinalFormSubmitEvent,
        Loading,
        MainContent,
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
    import { DateField } from "@comet/admin-date-time";
    import { ArrowLeft } from "@comet/admin-icons";
    import { BlockState, createFinalFormBlock } from "@comet/blocks-admin";
    import { ContentScopeIndicator, resolveHasSaveConflict, useFormSaveConflict, queryUpdatedAt } from "@comet/cms-admin";
    import { IconButton, FormControlLabel, MenuItem } from "@mui/material";
    import { FormApi } from "final-form";
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
            ? `Omit<GQL${entityName}FormFragment, ${numberFields.map((field) => `"${field.name}"`).join(" | ")}>`
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
                  ...filterByFragment<GQL${entityName}FormFragment>(${instanceEntityName}FormFragment, data.${instanceEntityName}),
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
                    variables: { id, input: output },
                });
            } else {
                const { data: mutationResponse } = await client.mutate<GQLCreate${entityName}Mutation, GQLCreate${entityName}MutationVariables>({
                    mutation: create${entityName}Mutation,
                    variables: { ${hasScope ? `scope, ` : ""}input: output },
                });
                if (!event.navigatingBack) {
                    const id = mutationResponse?.create${entityName}.id;
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
            >
                {({ values }) => (
                    <>
                        {saveConflict.dialogs}
                        <Toolbar scopeIndicator={<ContentScopeIndicator ${!hasScope ? "global" : ""} />}>
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
                                <FinalFormSaveButton hasConflict={saveConflict.hasConflict} />
                            </ToolbarActions>
                        </Toolbar>
                        <MainContent>
                            ${formFields.map((field) => generateField(generatorConfig, field, schema)).join("\n")}
                        </MainContent>
                    </>
                )}
            </FinalForm>
        );
    }
    `;

    writeGenerated(`${targetDirectory}/${entityName}Form.tsx`, out);
}

function generateField({ entityName, ...generatorConfig }: CrudGeneratorConfig, field: IntrospectionField, schema: IntrospectionQuery) {
    const rootBlocks = findRootBlocks({ entityName, ...generatorConfig }, schema);
    const instanceEntityName = entityName[0].toLowerCase() + entityName.substring(1);

    const label = camelCaseToHumanReadable(field.name);
    const type = field.type.kind === "NON_NULL" ? field.type.ofType : field.type;
    if (type.kind === "SCALAR" && rootBlocks[field.name]) {
        const rootBlock = rootBlocks ? rootBlocks[field.name] : undefined;
        if (!rootBlock) return "";
        return `<Field name="${field.name}" isEqual={isEqual}>
            {createFinalFormBlock(rootBlocks.${field.name})}
        </Field>`;
    } else if (type.kind === "ENUM") {
        const enumType = schema.__schema.types.find((t) => t.kind === "ENUM" && t.name === (type as IntrospectionNamedTypeRef).name) as
            | IntrospectionEnumType
            | undefined;
        if (!enumType) throw new Error(`Enum type not found`);
        const values = enumType.enumValues.map((i) => i.name);
        return `<Field
            variant="horizontal"
            fullWidth
            name="${field.name}"
            label={<FormattedMessage id="${instanceEntityName}.${field.name}" defaultMessage="${label}" />}>
            {(props) => 
                <FinalFormSelect {...props}>
                ${values
                    .map((value) => {
                        const id = `${instanceEntityName}.${field.name}.${value.charAt(0).toLowerCase() + value.slice(1)}`;
                        const label = `<FormattedMessage id="${id}" defaultMessage="${camelCaseToHumanReadable(value)}" />`;
                        return `<MenuItem value="${value}">${label}</MenuItem>`;
                    })
                    .join("\n")}
                </FinalFormSelect>
            }
        </Field>`;
    } else if (type.kind === "SCALAR" && type.name === "Boolean") {
        return `<CheckboxField
                        label={<FormattedMessage id="${instanceEntityName}.${field.name}" defaultMessage="${label}" />}
                        name="${field.name}"
                        fullWidth
                        variant="horizontal"
                    />`;
    } else if (type.kind === "SCALAR" && type.name === "String") {
        return `<TextField ${field.type.kind === "NON_NULL" ? "required" : ""} variant="horizontal" fullWidth name="${
            field.name
        }"  label={<FormattedMessage id="${instanceEntityName}.${field.name}" defaultMessage="${label}"/>} />`;
    } else if (type.kind === "SCALAR" && type.name === "DateTime") {
        //TODO DateTime vs Date
        return `<DateField ${field.type.kind === "NON_NULL" ? "required" : ""} variant="horizontal" fullWidth name="${
            field.name
        }"  label={<FormattedMessage id="${instanceEntityName}.${field.name}" defaultMessage="${label}"/>} />`;
    } else {
        let component;
        let additionalProps = "";
        if (type.kind === "SCALAR" && type.name === "Float") {
            component = "FinalFormInput";
            additionalProps += 'type="number"';
            //TODO MUI suggest not using type=number https://mui.com/material-ui/react-text-field/#type-quot-number-quot
        } else if (type.kind === "SCALAR" && type.name === "Int") {
            component = "FinalFormInput";
            additionalProps += 'type="number"';
            //TODO
        } else {
            //unknown type
            return "";
        }
        return `<Field ${field.type.kind === "NON_NULL" ? "required" : ""}
                    variant="horizontal"
                    fullWidth
                    name="${field.name}"
                    component={${component}}
                    ${additionalProps}
                    label={<FormattedMessage id="${instanceEntityName}.${field.name}" defaultMessage="${label}" />}
                />`;
    }
}
