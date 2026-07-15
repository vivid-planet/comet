import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Field, FinalForm, Loading } from "@comet/admin";
import { Box, MenuItem, TextField } from "@mui/material";
import isEqual from "lodash.isequal";
import { type FunctionComponent, type PropsWithChildren, useMemo } from "react";
import { useIntl } from "react-intl";

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

type ContentScope = {
    [key: string]: string;
};

type FormValues = {
    scope: ContentScope;
};

export const SelectScopesDialogContent: FunctionComponent<PropsWithChildren<SelectScopesDialogContentProps>> = ({
    userId,
    userContentScopes,
    userContentScopesSkipManual,
}) => {
    const intl = useIntl();
    const client = useApolloClient();

    // The dialog only selects a single new scope; existing manually assigned scopes are kept and are shown/deleted in the grid.
    const existingManualContentScopes = useMemo(
        () =>
            userContentScopes.filter(
                (contentScope) => !userContentScopesSkipManual.some((ruleContentScope: ContentScope) => isEqual(ruleContentScope, contentScope)),
            ),
        [userContentScopes, userContentScopesSkipManual],
    );
    // Memoized so that re-renders don't reinitialize the form and discard the selection.
    const initialValues = useMemo<FormValues>(() => ({ scope: {} }), []);

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
        const scope: ContentScope = Object.fromEntries(
            Object.entries(values.scope)
                .filter(([, value]) => value != null && String(value).trim() !== "")
                .map(([dimension, value]) => [dimension, String(value).trim()]),
        );
        const contentScopes = existingManualContentScopes.some((existing) => isEqual(existing, scope))
            ? existingManualContentScopes
            : [...existingManualContentScopes, scope];
        await client.mutate<GQLUpdateContentScopesMutation, GQLUpdateContentScopesMutationVariables>({
            mutation: gql`
                mutation UpdateContentScopes($userId: String!, $input: UserContentScopesInput!) {
                    userPermissionsUpdateContentScopes(userId: $userId, input: $input)
                }
            `,
            variables: {
                userId,
                input: { contentScopes },
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

    const validate = ({ scope }: FormValues) => {
        if (!enumerableDimensionNames.every((dimension) => scope[dimension])) {
            return {
                scope: intl.formatMessage({ id: "comet.userPermissions.selectAllDimensions", defaultMessage: "Select a value for each dimension." }),
            };
        }
        // Only a combination of enumerable values that exists in the available content scopes can be assigned
        const enumerablePartOfScope = Object.fromEntries(enumerableDimensionNames.map((dimension) => [dimension, scope[dimension]]));
        if (!data.availableContentScopes.some((availableContentScope) => isEqual(availableContentScope.scope, enumerablePartOfScope))) {
            return {
                scope: intl.formatMessage({
                    id: "comet.userPermissions.contentScopeDoesNotExist",
                    defaultMessage: "This combination of scopes does not exist.",
                }),
            };
        }
        return {};
    };

    return (
        <FinalForm<FormValues>
            subscription={{ values: true }}
            mode="edit"
            onSubmit={submit}
            onAfterSubmit={() => null}
            initialValues={initialValues}
            validate={validate}
        >
            <Field<ContentScope> name="scope" fullWidth>
                {(props) => {
                    const scope = props.input.value;
                    const setDimensionValue = (dimension: string, value: string) => props.input.onChange({ ...scope, [dimension]: value });

                    return (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "flex-start" }}>
                            {data.availableContentScopeDimensions.map((dimension) =>
                                isEnumerableDimension(dimension.name) ? (
                                    <TextField
                                        key={dimension.name}
                                        select
                                        label={dimension.label}
                                        value={scope[dimension.name] ?? ""}
                                        onChange={(event) => setDimensionValue(dimension.name, event.target.value)}
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
                                        value={scope[dimension.name] ?? ""}
                                        onChange={(event) => setDimensionValue(dimension.name, event.target.value)}
                                        sx={{ minWidth: 200 }}
                                    />
                                ),
                            )}
                        </Box>
                    );
                }}
            </Field>
        </FinalForm>
    );
};
