import { gql, useQuery } from "@apollo/client";
import { Dialog, RowActionsItem } from "@comet/admin";
import { ImpersonateUser, QuestionMark, Reset } from "@comet/admin-icons";
import { CircularProgress, DialogContent, List, ListItem, ListItemText } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { commonImpersonationMessages } from "../common/impersonation/commonImpersonationMessages";
import { useCurrentUser } from "./hooks/currentUser";
import {
    type GQLUserImpersonationCheckQuery,
    type GQLUserImpersonationCheckQueryVariables,
    type GQLUserImpersonationMismatchesQuery,
    type GQLUserImpersonationMismatchesQueryVariables,
} from "./ImpersonateMenuItem.generated";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { startImpersonation, stopImpersonation } from "./utils/handleImpersonation";

const userImpersonationCheckQuery = gql`
    query UserImpersonationCheck($id: String!) {
        user: userPermissionsUserById(id: $id) {
            id
            impersonationAllowed
        }
    }
`;

const userImpersonationMismatchesQuery = gql`
    query UserImpersonationMismatches($id: String!) {
        user: userPermissionsUserById(id: $id) {
            id
            impersonationNotAllowedByPermissions {
                permission
                missingContentScopes
            }
        }
    }
`;

export function ImpersonateMenuItem({ userId, onShowMismatches }: { userId: string; onShowMismatches?: () => void }) {
    const currentUser = useCurrentUser();

    if (currentUser.impersonated) {
        return (
            <RowActionsItem icon={<Reset />} onClick={() => stopImpersonation()}>
                {commonImpersonationMessages.stopImpersonation}
            </RowActionsItem>
        );
    }

    return <StartImpersonationMenuItem userId={userId} onShowMismatches={onShowMismatches} />;
}

function StartImpersonationMenuItem({ userId, onShowMismatches }: { userId: string; onShowMismatches?: () => void }) {
    const currentUser = useCurrentUser();
    const isSelf = currentUser.id === userId;

    const { data, loading } = useQuery<GQLUserImpersonationCheckQuery, GQLUserImpersonationCheckQueryVariables>(userImpersonationCheckQuery, {
        variables: { id: userId },
        skip: isSelf,
    });
    const impersonationAllowed = data?.user.impersonationAllowed ?? false;

    const label = loading ? (
        <FormattedMessage id="comet.userPermissions.evaluatingPermissions" defaultMessage="Evaluating permissions" />
    ) : isSelf ? (
        <FormattedMessage id="comet.userPermissions.cannotImpersonateYourself" defaultMessage="Cannot impersonate yourself" />
    ) : !impersonationAllowed ? (
        <FormattedMessage id="comet.userPermissions.cannotImpersonate" defaultMessage="Cannot impersonate" />
    ) : (
        commonImpersonationMessages.startImpersonation
    );

    return (
        <>
            <RowActionsItem
                icon={loading ? <CircularProgress size={16} /> : <ImpersonateUser />}
                disabled={loading || !impersonationAllowed || isSelf}
                onClick={() => startImpersonation(userId)}
            >
                {label}
            </RowActionsItem>
            {!loading && !isSelf && !impersonationAllowed && onShowMismatches && (
                <RowActionsItem icon={<QuestionMark />} onClick={onShowMismatches}>
                    <FormattedMessage id="comet.userPermissions.whyCannotImpersonate" defaultMessage="Why can't I impersonate?" />
                </RowActionsItem>
            )}
        </>
    );
}

export function ImpersonationMismatchDialog({ userId, open, onClose }: { userId: string | null; open: boolean; onClose: () => void }) {
    const intl = useIntl();

    const { data: mismatchData, loading: mismatchLoading } = useQuery<
        GQLUserImpersonationMismatchesQuery,
        GQLUserImpersonationMismatchesQueryVariables
    >(userImpersonationMismatchesQuery, {
        variables: { id: userId ?? "" },
        skip: !open || !userId,
    });

    const permissionMismatches = mismatchData?.user.impersonationNotAllowedByPermissions ?? [];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={intl.formatMessage({
                id: "comet.userPermissions.impersonationNotAllowed",
                defaultMessage: "Impersonation not allowed",
            })}
        >
            <DialogContent>
                {mismatchLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <List dense>
                        {permissionMismatches.map((m) => (
                            <ListItem key={m.permission}>
                                <ListItemText
                                    primary={camelCaseToHumanReadable(m.permission)}
                                    secondary={
                                        m.missingContentScopes.length > 0
                                            ? intl.formatMessage(
                                                  {
                                                      id: "comet.userPermissions.missingContentScopes",
                                                      defaultMessage: "Missing scopes: {scopes}",
                                                  },
                                                  {
                                                      scopes: m.missingContentScopes
                                                          .map((cs) =>
                                                              Object.entries(cs)
                                                                  .map(
                                                                      ([key, value]) =>
                                                                          `${camelCaseToHumanReadable(key)}: ${camelCaseToHumanReadable(String(value))}`,
                                                                  )
                                                                  .join(", "),
                                                          )
                                                          .join("; "),
                                                  },
                                              )
                                            : intl.formatMessage({
                                                  id: "comet.userPermissions.missingPermission",
                                                  defaultMessage: "Permission not available",
                                              })
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
}
