import { gql, useQuery } from "@apollo/client";
import { CrudMoreActionsMenu, FillSpace, Loading, StackToolbar, ToolbarActions, ToolbarBackButton, ToolbarTitleItem, Tooltip } from "@comet/admin";
import { ImpersonateUser, Reset } from "@comet/admin-icons";
import { styled } from "@mui/material/styles";
import { useIntl } from "react-intl";

import { commonImpersonationMessages } from "../../common/impersonation/commonImpersonationMessages";
import { ContentScopeIndicator } from "../../contentScope/ContentScopeIndicator";
import { useCurrentUser, useUserPermissionCheck } from "../hooks/currentUser";
import { startImpersonation, stopImpersonation } from "../utils/handleImpersonation";
import { type GQLUserPageQuery, type GQLUserPageQueryVariables } from "./UserPageToolbar.generated";

export const UserPermissionsUserPageToolbar = ({ userId }: { userId: string }) => {
    const currentUser = useCurrentUser();
    const isAllowed = useUserPermissionCheck();
    const intl = useIntl();

    const { data, error, loading } = useQuery<GQLUserPageQuery, GQLUserPageQueryVariables>(
        gql`
            query UserPage($id: String!) {
                user: userPermissionsUserById(id: $id) {
                    name
                    email
                    impersonationNotAllowedByPermissions {
                        permission
                        missingContentScopes
                    }
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

    const permissionMismatches = data.user.impersonationNotAllowedByPermissions;
    const impersonationAllowed = permissionMismatches.length === 0;

    const tooltipTitle = !impersonationAllowed
        ? intl.formatMessage(
              {
                  id: "comet.userPermissions.cannotImpersonateMissingPermissions",
                  defaultMessage: "Missing permissions: {permissions}",
              },
              { permissions: permissionMismatches.map((m) => m.permission).join(", ") },
          )
        : "";

    return (
        <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
            <ToolbarBackButton />
            <ToolbarTitleItem>
                <TitleText>{data.user.name}</TitleText>
                <SupportText>{data.user.email}</SupportText>
            </ToolbarTitleItem>
            <FillSpace />
            <ToolbarActions>
                {isAllowed("impersonation") && (
                    <CrudMoreActionsMenu
                        overallActions={[
                            currentUser.impersonated
                                ? {
                                      icon: <Reset />,
                                      label: commonImpersonationMessages.stopImpersonation,
                                      onClick: () => stopImpersonation(),
                                  }
                                : {
                                      label: (
                                          <Tooltip title={tooltipTitle}>
                                              <span>{commonImpersonationMessages.startImpersonation}</span>
                                          </Tooltip>
                                      ),
                                      icon: <ImpersonateUser />,
                                      disabled: !impersonationAllowed,
                                      onClick: () => startImpersonation(userId),
                                  },
                        ]}
                    />
                )}
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
