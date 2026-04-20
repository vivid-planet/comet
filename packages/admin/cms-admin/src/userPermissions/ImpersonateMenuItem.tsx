import { gql, useQuery } from "@apollo/client";
import { RowActionsItem, Tooltip } from "@comet/admin";
import { ImpersonateUser, Reset } from "@comet/admin-icons";
import { CircularProgress } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { commonImpersonationMessages } from "../common/impersonation/commonImpersonationMessages";
import { useCurrentUser } from "./hooks/currentUser";
import { type GQLUserImpersonationCheckQuery, type GQLUserImpersonationCheckQueryVariables } from "./ImpersonateMenuItem.generated";
import { startImpersonation, stopImpersonation } from "./utils/handleImpersonation";

const userImpersonationCheckQuery = gql`
    query UserImpersonationCheck($id: String!) {
        user: userPermissionsUserById(id: $id) {
            id
            impersonationNotAllowedByPermissions {
                permission
                missingContentScopes
            }
        }
    }
`;

export function ImpersonateMenuItem({ userId }: { userId: string }) {
    const currentUser = useCurrentUser();

    if (currentUser.impersonated) {
        return (
            <RowActionsItem icon={<Reset />} onClick={() => stopImpersonation()}>
                {commonImpersonationMessages.stopImpersonation}
            </RowActionsItem>
        );
    }

    return <StartImpersonationMenuItem userId={userId} />;
}

function StartImpersonationMenuItem({ userId }: { userId: string }) {
    const currentUser = useCurrentUser();
    const intl = useIntl();
    const isSelf = currentUser.id === userId;

    const { data, loading } = useQuery<GQLUserImpersonationCheckQuery, GQLUserImpersonationCheckQueryVariables>(userImpersonationCheckQuery, {
        variables: { id: userId },
        skip: isSelf,
    });
    const permissionMismatches = data?.user.impersonationNotAllowedByPermissions ?? [];
    const impersonationAllowed = permissionMismatches.length === 0;

    const label = loading ? (
        <FormattedMessage id="comet.userPermissions.evaluatingPermissions" defaultMessage="Evaluating permissions" />
    ) : isSelf ? (
        <FormattedMessage id="comet.userPermissions.cannotImpersonateYourself" defaultMessage="Cannot impersonate yourself" />
    ) : !impersonationAllowed ? (
        <FormattedMessage id="comet.userPermissions.cannotImpersonate" defaultMessage="Cannot impersonate" />
    ) : (
        commonImpersonationMessages.startImpersonation
    );

    const tooltipTitle =
        !loading && !isSelf && !impersonationAllowed
            ? permissionMismatches
                  .map((m) => {
                      if (m.missingContentScopes.length === 0) {
                          return m.permission;
                      }
                      const scopes = m.missingContentScopes.map((cs) => Object.values(cs).join("/")).join(", ");
                      return intl.formatMessage(
                          {
                              id: "comet.userPermissions.permissionWithMissingScopes",
                              defaultMessage: "{permission} (missing scopes: {scopes})",
                          },
                          { permission: m.permission, scopes },
                      );
                  })
                  .join(", ")
            : "";

    return (
        <Tooltip title={tooltipTitle}>
            <span>
                <RowActionsItem
                    icon={loading ? <CircularProgress size={16} /> : <ImpersonateUser />}
                    disabled={loading || !impersonationAllowed || isSelf}
                    onClick={() => startImpersonation(userId)}
                >
                    {label}
                </RowActionsItem>
            </span>
        </Tooltip>
    );
}
