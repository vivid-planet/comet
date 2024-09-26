import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Loading, MainContent, RouterTab, RouterTabs, Toolbar, ToolbarBackButton, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Box, Button, ButtonProps, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ContentScopeIndicator } from "../../contentScope/ContentScopeIndicator";
import { useCurrentUser, useUserPermissionCheck } from "../hooks/currentUser";
import { UserBasicData } from "./basicData/UserBasicData";
import { ContentScopeGrid } from "./permissions/ContentScopeGrid";
import { PermissionGrid } from "./permissions/PermissionGrid";
import {
    GQLUserPageQuery,
    GQLUserPageQueryVariables,
    GQLUserPermissionsImpersonateMutation,
    GQLUserPermissionsImpersonateMutationVariables,
    GQLUserPermissionsStopImpersonateMutation,
} from "./UserPage.generated";

export const StopImpersonateButton: React.FC<ButtonProps> = (buttonProps) => {
    const client = useApolloClient();
    const stopImpersonate = async () => {
        const result = await client.mutate<GQLUserPermissionsStopImpersonateMutation>({
            mutation: gql`
                mutation UserPermissionsStopImpersonate {
                    userPermissionsStopImpersonate
                }
            `,
        });
        if (result.data?.userPermissionsStopImpersonate) {
            location.href = "/";
        }
    };

    return (
        <Button onClick={stopImpersonate} {...buttonProps}>
            <FormattedMessage id="comet.stopImpersonate" defaultMessage="Exit Impersonation" />
        </Button>
    );
};

const ImpersonationButton: React.FC<{ userId: string }> = ({ userId }) => {
    const currentUser = useCurrentUser();
    const client = useApolloClient();
    const impersonate = async () => {
        const result = await client.mutate<GQLUserPermissionsImpersonateMutation, GQLUserPermissionsImpersonateMutationVariables>({
            mutation: gql`
                mutation UserPermissionsImpersonate($userId: String!) {
                    userPermissionsImpersonate(userId: $userId)
                }
            `,
            variables: {
                userId,
            },
        });
        if (result.data?.userPermissionsImpersonate) {
            location.href = "/";
        }
    };

    if (currentUser.id !== userId && !currentUser.impersonated) {
        return (
            <Button onClick={impersonate} variant="contained">
                <FormattedMessage id="comet.userPermissions.impersonate" defaultMessage="Impersonate" />
            </Button>
        );
    }

    if (currentUser.impersonated && currentUser.id === userId) {
        return <StopImpersonateButton variant="contained" />;
    }

    return null;
};

export const UserPage: React.FC<{ userId: string }> = ({ userId }) => {
    const isAllowed = useUserPermissionCheck();
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
        return <Loading />;
    }

    return (
        <>
            <Toolbar scopeIndicator={<ContentScopeIndicator global />}>
                <ToolbarBackButton />
                <ToolbarTitleItem>
                    <TitleText>{data.user.name}</TitleText>
                    <SupportText>{data.user.email}</SupportText>
                </ToolbarTitleItem>
                <ToolbarFillSpace />
                {isAllowed("impersonation") && (
                    <CardContent>
                        <ImpersonationButton userId={userId} />
                    </CardContent>
                )}
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
