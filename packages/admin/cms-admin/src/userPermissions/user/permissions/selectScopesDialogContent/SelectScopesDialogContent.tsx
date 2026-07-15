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
    const [draftScope, setDraftScope] = useState<ContentScope>({});

    // The dialog only collects new scopes to add; existing manually assigned scopes are kept and are shown/deleted in the grid.
    const existingManualContentScopes = useMemo(
        () =>
            userContentScopes.filter(
                (contentScope) => !userContentScopesSkipManual.some((ruleContentScope: ContentScope) => isEqual(ruleContentScope, contentScope)),
            ),
        [userContentScopes, userContentScopesSkipManual],
    );
    // Memoized so that re-renders caused by the builder inputs don't reinitialize the form and discard the added scopes.
    const initialValues = useMemo<FormValues>(() => ({ contentScopes: [] }), []);

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
                    contentScopes: [
                        ...existingManualContentScopes,
                        ...values.contentScopes
                            .map((contentScope) => JSON.parse(contentScope))
                            .filter((newContentScope) => !existingManualContentScopes.some((existing) => isEqual(existing, newContentScope))),
                    ],
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

    // Dimensions whose values are enumerable get a dropdown built from the available content scopes; the remaining declared
    // dimensions (e.g. one with too many values to enumerate) are entered as free text.
    const enumerableValuesByDimension: Record<string, Array<{ value: string; label: string }>> = {};
    for (const availableContentScope of data.availableContentScopes) {
        for (const [dimension, value] of Object.entries(availableContentScope.scope)) {
            const options = (enumerableValuesByDimension[dimension] ??= []);
            if (!options.some((option) => option.value === value)) {
                options.push({ value: String(value), label: availableContentScope.label?.[dimension] ?? String(value) });
            }
        }
    }
    const isEnumerableDimension = (dimension: string) => enumerableValuesByDimension[dimension] !== undefined;
    const enumerableDimensionNames = data.availableContentScopeDimensions.map((dimension) => dimension.name).filter(isEnumerableDimension);

    const scopeColumns = generateGridColumnsFromContentScopeProperties(data.availableContentScopes, {
        dimensions: data.availableContentScopeDimensions,
    });

    const enumerablePartOfDraft = Object.fromEntries(enumerableDimensionNames.map((dimension) => [dimension, draftScope[dimension]]));
    // Only a combination of enumerable values that exists in the available content scopes can be assigned
    const canAddScope =
        enumerableDimensionNames.every((dimension) => draftScope[dimension]) &&
        data.availableContentScopes.some((availableContentScope) => isEqual(availableContentScope.scope, enumerablePartOfDraft));

    return (
        <FinalForm<FormValues> subscription={{ values: true }} mode="edit" onSubmit={submit} onAfterSubmit={() => null} initialValues={initialValues}>
            <Field<string[]> name="contentScopes" fullWidth>
                {(props) => {
                    const contentScopes = props.input.value;

                    const addScope = () => {
                        if (!canAddScope) {
                            return;
                        }
                        const scope: ContentScope = {};
                        for (const dimension of data.availableContentScopeDimensions) {
                            const value = draftScope[dimension.name]?.trim();
                            if (value) {
                                scope[dimension.name] = value;
                            }
                        }
                        const serializedScope = JSON.stringify(scope);
                        if (!contentScopes.includes(serializedScope)) {
                            props.input.onChange([...contentScopes, serializedScope]);
                        }
                        setDraftScope({});
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
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "flex-end", marginBottom: 4 }}>
                                {data.availableContentScopeDimensions.map((dimension) =>
                                    isEnumerableDimension(dimension.name) ? (
                                        <TextField
                                            key={dimension.name}
                                            select
                                            label={dimension.label}
                                            value={draftScope[dimension.name] ?? ""}
                                            onChange={(event) => setDraftScope((scope) => ({ ...scope, [dimension.name]: event.target.value }))}
                                            sx={{ minWidth: 200 }}
                                        >
                                            {enumerableValuesByDimension[dimension.name].map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    ) : (
                                        <TextField
                                            key={dimension.name}
                                            label={dimension.label}
                                            value={draftScope[dimension.name] ?? ""}
                                            onChange={(event) => setDraftScope((scope) => ({ ...scope, [dimension.name]: event.target.value }))}
                                            sx={{ minWidth: 200 }}
                                        />
                                    ),
                                )}
                                <Button variant="outlined" disabled={!canAddScope} onClick={addScope}>
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
