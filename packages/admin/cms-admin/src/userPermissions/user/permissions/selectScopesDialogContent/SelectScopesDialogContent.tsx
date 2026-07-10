import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Button, Field, FinalForm, type GridColDef, Loading } from "@comet/admin";
import { Delete } from "@comet/admin-icons";
import { Box, IconButton, MenuItem, TextField } from "@mui/material";
import isEqual from "lodash.isequal";
import { type FunctionComponent, type PropsWithChildren, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { DataGrid } from "../../../../dataGrid/DataGrid";
import { generateGridColumnsFromContentScopeProperties } from "../ContentScopeGrid";
import type { GQLContentScopesQuery } from "../ContentScopeGrid.generated";
import type {
    GQLAvailableContentScopesQuery,
    GQLUpdateContentScopesMutation,
    GQLUpdateContentScopesMutationVariables,
} from "./SelectScopesDialogContent.generated";

interface SelectScopesDialogContentProps {
    userId: string;
    userContentScopes: GQLContentScopesQuery["userContentScopes"];
    userContentScopesSkipManual: GQLContentScopesQuery["userContentScopesSkipManual"];
}

type FormValues = {
    contentScopes: string[];
};

type ContentScope = {
    [key: string]: string;
};

export const SelectScopesDialogContent: FunctionComponent<PropsWithChildren<SelectScopesDialogContentProps>> = ({
    userId,
    userContentScopes,
    userContentScopesSkipManual,
}) => {
    const client = useApolloClient();
    const [selectedScope, setSelectedScope] = useState<string>("");
    const [freeValues, setFreeValues] = useState<Record<string, string>>({});

    // Memoized so that re-renders caused by the builder inputs don't recreate the initial values and reinitialize the form
    // (which would discard added scopes). Only the rule-based scopes are excluded; the rest are the manually assigned scopes.
    const initialValues = useMemo<FormValues>(
        () => ({
            contentScopes: userContentScopes
                .filter(
                    (contentScope) => !userContentScopesSkipManual.some((ruleContentScope: ContentScope) => isEqual(ruleContentScope, contentScope)),
                )
                .map((contentScope) => JSON.stringify(contentScope)),
        }),
        [userContentScopes, userContentScopesSkipManual],
    );

    const { data, error } = useQuery<GQLAvailableContentScopesQuery>(gql`
        query AvailableContentScopes {
            availableContentScopes: userPermissionsAvailableContentScopes {
                scope
                label
            }
            availableContentScopeDimensions: userPermissionsAvailableContentScopeDimensions {
                name
                label
            }
        }
    `);

    const submit = async (values: FormValues) => {
        await client.mutate<GQLUpdateContentScopesMutation, GQLUpdateContentScopesMutationVariables>({
            mutation: gql`
                mutation UpdateContentScopes($userId: String!, $input: UserContentScopesInput!) {
                    userPermissionsUpdateContentScopes(userId: $userId, input: $input)
                }
            `,
            variables: {
                userId,
                input: {
                    contentScopes: values.contentScopes.map((contentScope) => JSON.parse(contentScope)),
                },
            },
            refetchQueries: ["ContentScopes"],
        });
    };

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        return <Loading />;
    }

    // Dimensions whose values are enumerable are chosen from the available content scopes; the remaining declared dimensions
    // (e.g. one with too many values to enumerate) are entered as free text.
    const enumerableDimensions = new Set(data.availableContentScopes.flatMap((availableContentScope) => Object.keys(availableContentScope.scope)));
    const freeDimensions = data.availableContentScopeDimensions.filter((dimension) => !enumerableDimensions.has(dimension.name));

    const scopeOptions = data.availableContentScopes.map((availableContentScope) => ({
        value: JSON.stringify(availableContentScope.scope),
        label: Object.values(availableContentScope.label).join(" / "),
    }));

    const scopeColumns = generateGridColumnsFromContentScopeProperties(data.availableContentScopes, {
        dimensions: data.availableContentScopeDimensions,
    });

    return (
        <FinalForm<FormValues> subscription={{ values: true }} mode="edit" onSubmit={submit} onAfterSubmit={() => null} initialValues={initialValues}>
            <Field<string[]> name="contentScopes" fullWidth>
                {(props) => {
                    const contentScopes = props.input.value;

                    const addScope = () => {
                        if (!selectedScope) {
                            return;
                        }
                        const scope: ContentScope = { ...JSON.parse(selectedScope) };
                        for (const dimension of freeDimensions) {
                            const value = freeValues[dimension.name]?.trim();
                            if (value) {
                                scope[dimension.name] = value;
                            }
                        }
                        const serializedScope = JSON.stringify(scope);
                        if (!contentScopes.includes(serializedScope)) {
                            props.input.onChange([...contentScopes, serializedScope]);
                        }
                        setSelectedScope("");
                        setFreeValues({});
                    };

                    const removeScope = (scope: ContentScope) => {
                        props.input.onChange(contentScopes.filter((contentScope) => contentScope !== JSON.stringify(scope)));
                    };

                    const columns: GridColDef<ContentScope>[] = [
                        ...scopeColumns,
                        {
                            field: "actions",
                            headerName: "",
                            width: 52,
                            pinnable: false,
                            sortable: false,
                            filterable: true,
                            align: "right",
                            renderCell: ({ row }) => (
                                <IconButton onClick={() => removeScope(row)}>
                                    <Delete />
                                </IconButton>
                            ),
                        },
                    ];

                    return (
                        <>
                            <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start", marginBottom: 4 }}>
                                <TextField
                                    select
                                    label={<FormattedMessage id="comet.userPermissions.scope" defaultMessage="Scope" />}
                                    value={selectedScope}
                                    onChange={(event) => setSelectedScope(event.target.value)}
                                    sx={{ minWidth: 200 }}
                                >
                                    {scopeOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {freeDimensions.map((dimension) => (
                                    <TextField
                                        key={dimension.name}
                                        label={dimension.label}
                                        value={freeValues[dimension.name] ?? ""}
                                        onChange={(event) => setFreeValues((values) => ({ ...values, [dimension.name]: event.target.value }))}
                                        sx={{ minWidth: 200 }}
                                    />
                                ))}
                                <Button variant="outlined" disabled={!selectedScope} onClick={addScope}>
                                    <FormattedMessage id="comet.userPermissions.addScope" defaultMessage="Add scope" />
                                </Button>
                            </Box>
                            <DataGrid
                                autoHeight
                                rows={contentScopes.map((contentScope) => JSON.parse(contentScope))}
                                columns={columns}
                                rowCount={contentScopes.length}
                                loading={false}
                                getRowHeight={() => "auto"}
                                getRowId={(row) => JSON.stringify(row)}
                                initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                            />
                        </>
                    );
                }}
            </Field>
        </FinalForm>
    );
};
