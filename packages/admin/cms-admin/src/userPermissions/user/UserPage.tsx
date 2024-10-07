import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Loading, MainContent, RouterTab, RouterTabs, Toolbar, ToolbarBackButton, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Box, Button, ButtonProps, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormattedMessage, useIntl } from "react-intl";

import { ContentScopeIndicator } from "../../contentScope/ContentScopeIndicator";
import { useCurrentUser, useUserPermissionCheck } from "../hooks/currentUser";
import { UserBasicData } from "./basicData/UserBasicData";
import { ContentScopeGrid } from "./permissions/ContentScopeGrid";
import { PermissionGrid } from "./permissions/PermissionGrid";
import {
    GQLUserPageQuery,
    GQLUserPageQueryVariables,
    GQLUserPermissionsStartImpersonationMutation,
    GQLUserPermissionsStartImpersonationMutationVariables,
    GQLUserPermissionsStopImpersonationMutation,
} from "./UserPage.generated";

export const StopImpersonationButton = (buttonProps: ButtonProps) => {
    const client = useApolloClient();
    const stopImpersonation = async () => {
        const result = await client.mutate<GQLUserPermissionsStopImpersonationMutation>({
            mutation: gql`
                mutation UserPermissionsStopImpersonation {
                    userPermissionsStopImpersonation
                }
            `,
        });
        if (result.data?.userPermissionsStopImpersonation) {
            location.href = "/";
        }
    };

    return (
        <Button onClick={stopImpersonation} {...buttonProps}>
            <FormattedMessage id="comet.stopImpersonation" defaultMessage="Stop Impersonation" />
        </Button>
    );
};

const ImpersonationButton = ({ userId }: { userId: string }) => {
    const currentUser = useCurrentUser();
    const client = useApolloClient();
    const startImpersonation = async () => {
        const result = await client.mutate<GQLUserPermissionsStartImpersonationMutation, GQLUserPermissionsStartImpersonationMutationVariables>({
            mutation: gql`
                mutation UserPermissionsStartImpersonation($userId: String!) {
                    userPermissionsStartImpersonation(userId: $userId)
                }
            `,
            variables: {
                userId,
            },
        });
        if (result.data?.userPermissionsStartImpersonation) {
            location.href = "/";
        }
    };

    if (currentUser.id !== userId && !currentUser.impersonated) {
        return (
            <Button onClick={startImpersonation} variant="contained">
                <FormattedMessage id="comet.userPermissions.startImpersonation" defaultMessage="Start Impersonation" />
            </Button>
        );
    }

    if (currentUser.impersonated && currentUser.id === userId) {
        return <StopImpersonationButton variant="contained" />;
    }

    return null;
};

export const UserPage = ({ userId }: { userId: string }) => {
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
