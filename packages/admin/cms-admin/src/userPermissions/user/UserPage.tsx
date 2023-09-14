import { gql, useQuery } from "@apollo/client";
import { MainContent, RouterTab, RouterTabs, Toolbar, ToolbarBackButton, ToolbarTitleItem } from "@comet/admin";
import { Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useIntl } from "react-intl";

import { UserBasicData } from "./basicData/UserBasicData";
import { ContentScopeGrid } from "./permissions/ContentScopeGrid";
import { PermissionGrid } from "./permissions/PermissionGrid";
import { GQLUserPageQuery, GQLUserPageQueryVariables } from "./UserPage.generated";

export const UserPage: React.FC<{ userId: string }> = ({ userId }) => {
    const { data, error, loading } = useQuery<GQLUserPageQuery, GQLUserPageQueryVariables>(
        gql`
            query UserPage($id: String!) {
                user: userPermissionsUserById(id: $id) {
                    name
                    email
                }
            }
        `,
        {
            variables: { id: userId },
        },
    );
    const intl = useIntl();

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
                <RouterTabs>
                    <RouterTab path="" label={intl.formatMessage({ id: "comet.userPermissions.basicData", defaultMessage: "Basic Data" })}>
                        <UserBasicData id={userId} />
                    </RouterTab>
                    <RouterTab
                        path="/permissions"
                        label={intl.formatMessage({ id: "comet.userPermissions.permissions", defaultMessage: "Permissions" })}
                    >
                        <ContentScopeGrid userId={userId} />
                        <Box sx={{ height: 20 }} />
                        <PermissionGrid userId={userId} />
                    </RouterTab>
                </RouterTabs>
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
