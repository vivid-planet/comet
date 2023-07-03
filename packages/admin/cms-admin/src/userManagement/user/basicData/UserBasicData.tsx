import { gql, useQuery } from "@apollo/client";
import { Field, FinalForm, FinalFormInput, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Card, CardContent, CircularProgress, Switch } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

import { CardToolbar } from "../../Comet";
import { GQLUserBasicDataQuery, GQLUserBasicDataQueryVariables } from "./UserBasicData.generated";

export const UserBasicData: React.FC<{
    id: string;
}> = ({ id }) => {
    const { data, error, loading } = useQuery<GQLUserBasicDataQuery, GQLUserBasicDataQueryVariables>(
        gql`
            query UserBasicData($id: String!) {
                user: userManagementUserById(id: $id) {
                    id
                    name
                    email
                    language
                    status
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
        return <CircularProgress />;
    }

    return (
        <Card>
            <CardToolbar>
                <ToolbarTitleItem>
                    <FormattedMessage id="comet.userManagement.basicData" defaultMessage="Basic Data" />
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
                        name="status"
                        component={(props) => <Switch defaultChecked={props.input.value === "ACTIVE"} {...props} />}
                        disabled={true}
                        label={<FormattedMessage id="comet.userManagement.status" defaultMessage="Status" />}
                    />
                    <Field
                        variant="horizontal"
                        name="email"
                        component={FinalFormInput}
                        disabled={true}
                        label={<FormattedMessage id="comet.userManagement.email" defaultMessage="E-Mail" />}
                    />
                    <Field
                        variant="horizontal"
                        name="name"
                        component={FinalFormInput}
                        disabled={true}
                        label={<FormattedMessage id="comet.userManagement.name" defaultMessage="Name" />}
                    />
                    <Field
                        variant="horizontal"
                        name="language"
                        component={FinalFormInput}
                        disabled={true}
                        label={<FormattedMessage id="comet.userManagement.language" defaultMessage="Language" />}
                    />
                </FinalForm>
            </CardContent>
        </Card>
    );
};
