import { gql, useQuery } from "@apollo/client";
import { Dialog, RowActionsItem } from "@comet/admin";
import { ImpersonateUser, QuestionMark, Reset } from "@comet/admin-icons";
import { CircularProgress, DialogContent, List, ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { commonImpersonationMessages } from "../common/impersonation/commonImpersonationMessages";
import { useCurrentUser } from "./hooks/currentUser";
import {
    type GQLUserImpersonationCheckQuery,
    type GQLUserImpersonationCheckQueryVariables,
    type GQLUserImpersonationMismatchesQuery,
    type GQLUserImpersonationMismatchesQueryVariables,
} from "./ImpersonateMenuItem.generated";
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
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, loading } = useQuery<GQLUserImpersonationCheckQuery, GQLUserImpersonationCheckQueryVariables>(userImpersonationCheckQuery, {
        variables: { id: userId },
        skip: isSelf,
    });
    const impersonationAllowed = data?.user.impersonationAllowed ?? false;

    const { data: mismatchData, loading: mismatchLoading } = useQuery<
        GQLUserImpersonationMismatchesQuery,
        GQLUserImpersonationMismatchesQueryVariables
    >(userImpersonationMismatchesQuery, {
        variables: { id: userId },
        skip: !dialogOpen,
    });

    const label = loading ? (
        <FormattedMessage id="comet.userPermissions.evaluatingPermissions" defaultMessage="Evaluating permissions" />
    ) : isSelf ? (
        <FormattedMessage id="comet.userPermissions.cannotImpersonateYourself" defaultMessage="Cannot impersonate yourself" />
    ) : !impersonationAllowed ? (
        <FormattedMessage id="comet.userPermissions.cannotImpersonate" defaultMessage="Cannot impersonate" />
    ) : (
        commonImpersonationMessages.startImpersonation
    );

    const permissionMismatches = mismatchData?.user.impersonationNotAllowedByPermissions ?? [];

    return (
        <>
            <RowActionsItem
                icon={loading ? <CircularProgress size={16} /> : <ImpersonateUser />}
                disabled={loading || !impersonationAllowed || isSelf}
                onClick={() => startImpersonation(userId)}
            >
                {label}
            </RowActionsItem>
            {!loading && !isSelf && !impersonationAllowed && (
                <RowActionsItem icon={<QuestionMark />} onClick={() => setDialogOpen(true)}>
                    <FormattedMessage id="comet.userPermissions.whyCannotImpersonate" defaultMessage="Why can't I impersonate?" />
                </RowActionsItem>
            )}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
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
                                        primary={m.permission}
                                        secondary={
                                            m.missingContentScopes.length > 0
                                                ? intl.formatMessage(
                                                      {
                                                          id: "comet.userPermissions.missingContentScopes",
                                                          defaultMessage: "Missing scopes: {scopes}",
                                                      },
                                                      {
                                                          scopes: m.missingContentScopes.map((cs) => Object.values(cs).join("/")).join(", "),
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
        </>
    );
}
