import { gql, useQuery } from "@apollo/client";
import { Field, FinalForm, FinalFormInput, Loading, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Card, CardContent, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { GQLUserBasicDataQuery, GQLUserBasicDataQueryVariables } from "./UserBasicData.generated";

export const UserBasicData: React.FC<{
    id: string;
}> = ({ id }) => {
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
        </Card>
    );
};

const CardToolbar = styled(Toolbar)`
    top: 0px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;
