import { gql, useQuery } from "@apollo/client";
import { CrudMoreActionsMenu, Loading, StackToolbar, ToolbarActions, ToolbarBackButton, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { ImpersonateUser, Reset } from "@comet/admin-icons";
import { styled } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

import { ContentScopeIndicator } from "../../contentScope/ContentScopeIndicator";
import { useCurrentUser, useUserPermissionCheck } from "../hooks/currentUser";
import { StartImpersonationButton } from "./ImpersonationButtons";
import { GQLUserPageQuery, GQLUserPageQueryVariables } from "./UserPageToolbar.generated";

export const UserPermissionsUserPageToolbar = ({ userId }: { userId: string }) => {
    const currentUser = useCurrentUser();
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

    if (error) {
        throw new Error(error.message);
    }

    if (loading || !data) {
        return <Loading />;
    }

    return (
        <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
            <ToolbarBackButton />
            <ToolbarTitleItem>
                <TitleText>{data.user.name}</TitleText>
                <SupportText>{data.user.email}</SupportText>
            </ToolbarTitleItem>
            <ToolbarFillSpace />
            <ToolbarActions>
                <StartImpersonationButton userId={userId} />
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
                              }
                            : null,
                        currentUser.impersonated
                            ? {
                                  icon: <Reset />,
                                  label: <FormattedMessage id="comet.impersonate.stop" defaultMessage="Impersonate" />,
                              }
                            : null,
                    ]}
                />{" "}
            </ToolbarActions>
        </StackToolbar>
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
