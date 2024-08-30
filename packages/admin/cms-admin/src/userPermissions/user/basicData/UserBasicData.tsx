import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Field, FinalForm, FinalFormInput, Loading, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Button, Card, CardContent, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLUserBasicDataQuery,
    GQLUserBasicDataQueryVariables,
    GQLUserPermissionsImpersonateMutation,
    GQLUserPermissionsImpersonateMutationVariables,
} from "./UserBasicData.generated";

export const UserBasicData: React.FC<{
    id: string;
}> = ({ id }) => {
    const client = useApolloClient();
    const impersonate = async () => {
        const result = await client.mutate<GQLUserPermissionsImpersonateMutation, GQLUserPermissionsImpersonateMutationVariables>({
            mutation: gql`
                mutation UserPermissionsImpersonate($userId: String!) {
                    userPermissionsImpersonate(userId: $userId)
                }
            `,
            variables: {
                userId: id,
            },
        });
        if (result.data?.userPermissionsImpersonate) {
            location.href = "/";
        }
    };

    const { data, error, loading } = useQuery<GQLUserBasicDataQuery, GQLUserBasicDataQueryVariables>(
        gql`
            query UserBasicData($id: String!) {
                user: userPermissionsUserById(id: $id) {
                    id
                    name
                    email
                }
            }
        `,
        {
            variables: { id },
        },
    );

    if (error) {
        throw new Error(error.message);
    }

    if (loading || !data) {
        return <Loading />;
    }

    return (
        <Card>
            <CardToolbar>
                <ToolbarTitleItem>
                    <FormattedMessage id="comet.userPermissions.basicData" defaultMessage="Basic Data" />
                </ToolbarTitleItem>
                <ToolbarFillSpace />
            </CardToolbar>
            <CardContent>
                <FinalForm
                    mode="edit"
                    initialValues={data.user}
                    onSubmit={() => {
                        /* do nothing */
                    }}
                >
                    <Field
                        variant="horizontal"
                        name="email"
                        component={FinalFormInput}
                        disabled={true}
                        label={<FormattedMessage id="comet.userPermissions.email" defaultMessage="E-Mail" />}
                    />
                    <Field
                        variant="horizontal"
                        name="name"
                        component={FinalFormInput}
                        disabled={true}
                        label={<FormattedMessage id="comet.userPermissions.name" defaultMessage="Name" />}
                    />
                </FinalForm>
            </CardContent>
            <CardContent>
                <Button onClick={impersonate} variant="contained">
                    <FormattedMessage id="comet.userPermissions.impersonate" defaultMessage="Impersonate" />
                </Button>
            </CardContent>
        </Card>
    );
};

const CardToolbar = styled(Toolbar)`
    top: 0px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;
