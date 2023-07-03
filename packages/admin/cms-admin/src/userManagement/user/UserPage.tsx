import { gql, useQuery } from "@apollo/client";
import { MainContent, Tab, Tabs, Toolbar, ToolbarBackButton, ToolbarTitleItem } from "@comet/admin";
import { Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { UserBasicData } from "./basicData/UserBasicData";
import { ContentScopes } from "./permissions/ContentScopes";
import { Permissions } from "./permissions/Permissions";
import { GQLUserPageQuery, GQLUserPageQueryVariables } from "./UserPage.generated";

export const UserPage: React.FC<{ userId: string }> = ({ userId }) => {
    const { data, error, loading } = useQuery<GQLUserPageQuery, GQLUserPageQueryVariables>(
        gql`
            query UserPage($id: String!) {
                user: userManagementUserById(id: $id) {
                    name
                    email
                }
            }
        `,
        {
            variables: { id: userId },
        },
    );

    if (error) {
        throw new Error(error.message);
    }

    if (loading || !data) {
        return <CircularProgress />;
    }

    return (
        <>
            <Toolbar>
                <ToolbarBackButton />
                <ToolbarTitleItem>
                    <TitleText>{data.user.name}</TitleText>
                    <SupportText>{data.user.email}</SupportText>
                </ToolbarTitleItem>
            </Toolbar>
            <MainContent>
                {/* TODO Use RouterTabs when working under subroutes */}
                <Tabs>
                    <Tab label={<FormattedMessage id="comet.userManagemant.basicData" defaultMessage="Basic Data" />}>
                        <UserBasicData id={userId} />
                    </Tab>
                    <Tab label={<FormattedMessage id="comet.userManagemant.permissions" defaultMessage="Permissions" />}>
                        <ContentScopes userId={userId} />
                        <Box sx={{ height: 20 }} />
                        <Permissions userId={userId} />
                    </Tab>
                </Tabs>
            </MainContent>
        </>
    );
};

const TitleText = styled("div")`
    font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
    font-size: 18px;
    line-height: 21px;
    color: ${({ theme }) => theme.palette.text.primary};
`;

const SupportText = styled("div")`
    font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme }) => theme.palette.text.secondary};
`;
