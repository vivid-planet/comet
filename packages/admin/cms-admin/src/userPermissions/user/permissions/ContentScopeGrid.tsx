import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CheckboxListField, FinalForm, Loading, SaveButton, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Card, CardContent, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import isEqual from "lodash.isequal";
import { FormattedMessage } from "react-intl";

import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import {
    GQLContentScopesQuery,
    GQLContentScopesQueryVariables,
    GQLUpdateContentScopesMutation,
    GQLUpdateContentScopesMutationVariables,
} from "./ContentScopeGrid.generated";

type FormValues = {
    contentScopes: string[];
};
type ContentScope = {
    [key: string]: string;
};

export const ContentScopeGrid = ({ userId }: { userId: string }) => {
    const client = useApolloClient();

    const submit = async (data: FormValues) => {
        await client.mutate<GQLUpdateContentScopesMutation, GQLUpdateContentScopesMutationVariables>({
            mutation: gql`
                mutation UpdateContentScopes($userId: String!, $input: UserContentScopesInput!) {
                    userPermissionsUpdateContentScopes(userId: $userId, input: $input)
                }
            `,
            variables: {
                userId,
                input: {
                    contentScopes: data.contentScopes.map((contentScope) => JSON.parse(contentScope)),
                },
            },
            refetchQueries: ["ContentScopes"],
        });
    };

    const { data, error } = useQuery<GQLContentScopesQuery, GQLContentScopesQueryVariables>(
        gql`
            query ContentScopes($userId: String!) {
                availableContentScopes: userPermissionsAvailableContentScopes
                userContentScopes: userPermissionsContentScopes(userId: $userId)
                userContentScopesSkipManual: userPermissionsContentScopes(userId: $userId, skipManual: true)
            }
        `,
        {
            variables: { userId },
        },
    );

    if (error) throw new Error(error.message);

    if (!data) {
        return <Loading />;
    }
    return (
        <Card>
            <FinalForm<FormValues>
                mode="edit"
                onSubmit={submit}
                onAfterSubmit={() => null}
                initialValues={{ contentScopes: data.userContentScopes.map((cs) => JSON.stringify(cs)) }}
            >
                <CardToolbar>
                    <ToolbarTitleItem>
                        <FormattedMessage id="comet.userPermissions.scopes" defaultMessage="Scopes" />
                    </ToolbarTitleItem>
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <SaveButton type="submit">
                            <FormattedMessage id="comet.userPermissions.save" defaultMessage="Save" />
                        </SaveButton>
                    </ToolbarActions>
                </CardToolbar>
                <CardContent>
                    <CheckboxListField
                        fullWidth
                        name="contentScopes"
                        layout="column"
                        options={data.availableContentScopes.map((contentScope: ContentScope) => ({
                            label: Object.entries(contentScope).map(([scope, value]) => (
                                <>
                                    {camelCaseToHumanReadable(scope)}: {camelCaseToHumanReadable(value)}
                                    <br />
                                </>
                            )),
                            value: JSON.stringify(contentScope),
                            disabled: data.userContentScopesSkipManual.some((cs: ContentScope) => isEqual(cs, contentScope)),
                        }))}
                    />
                </CardContent>
            </FinalForm>
        </Card>
    );
};

const CardToolbar = styled(Toolbar)`
    top: 0px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;
