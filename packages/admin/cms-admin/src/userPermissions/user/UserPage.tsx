import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    CrudMoreActionsMenu,
    Loading,
    MainContent,
    RouterTab,
    RouterTabs,
    Toolbar,
    ToolbarBackButton,
    ToolbarFillSpace,
    ToolbarTitleItem,
} from "@comet/admin";
import { ImpersonateUser, Reset } from "@comet/admin-icons";
import { Box, Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormattedMessage, useIntl } from "react-intl";

import { ContentScopeIndicator } from "../../contentScope/ContentScopeIndicator";
import { useCurrentUser, useUserPermissionCheck } from "../hooks/currentUser";
import { useImpersonation } from "../hooks/useImpersonation";
import { GQLUserPermissionsStopImpersonationMutation } from "../hooks/useImpersonation.generated";
import { UserBasicData } from "./basicData/UserBasicData";
import { ContentScopeGrid } from "./permissions/ContentScopeGrid";
import { PermissionGrid } from "./permissions/PermissionGrid";
import { GQLUserPageQuery, GQLUserPageQueryVariables } from "./UserPage.generated";

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

export const UserPage = ({ userId }: { userId: string }) => {
    const isAllowed = useUserPermissionCheck();
    const currentUser = useCurrentUser();
    const { stopImpersonation, startImpersonation } = useImpersonation();
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
                {/* TODO: remove this condition once more actions are added to that menu */}
                {userId !== currentUser.id && isAllowed("impersonation") && (
                    <CrudMoreActionsMenu
                        slotProps={{
                            group: { groupTitle: null },
                        }}
                        overallActions={[
                            isAllowed("impersonation")
                                ? {
                                      label: <FormattedMessage id="comet.impersonate" defaultMessage="Impersonate" />,
                                      icon: <ImpersonateUser />,
                                      disabled: userId === currentUser.id,
                                      onClick: () => startImpersonation(userId),
                                  }
                                : null,
                            currentUser.impersonated
                                ? {
                                      icon: <Reset />,
                                      label: <FormattedMessage id="comet.impersonate.stop" defaultMessage="Impersonate" />,
                                      onClick: stopImpersonation,
                                  }
                                : null,
                        ]}
                    />
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
