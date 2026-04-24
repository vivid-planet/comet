import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { CrudMoreActionsMenu, Dialog, FillSpace, Loading, StackToolbar, ToolbarActions, ToolbarBackButton, ToolbarTitleItem } from "@comet/admin";
import { ImpersonateUser, QuestionMark, Reset } from "@comet/admin-icons";
import { CircularProgress, DialogContent, List, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { commonImpersonationMessages } from "../../common/impersonation/commonImpersonationMessages";
import { ContentScopeIndicator } from "../../contentScope/ContentScopeIndicator";
import { useCurrentUser, useUserPermissionCheck } from "../hooks/currentUser";
import { startImpersonation, stopImpersonation } from "../utils/handleImpersonation";
import {
    type GQLUserPageMismatchesQuery,
    type GQLUserPageMismatchesQueryVariables,
    type GQLUserPageQuery,
    type GQLUserPageQueryVariables,
} from "./UserPageToolbar.generated";

export const UserPermissionsUserPageToolbar = ({ userId }: { userId: string }) => {
    const currentUser = useCurrentUser();
    const isAllowed = useUserPermissionCheck();
    const intl = useIntl();
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, error, loading } = useQuery<GQLUserPageQuery, GQLUserPageQueryVariables>(
        gql`
            query UserPage($id: String!) {
                user: userPermissionsUserById(id: $id) {
                    name
                    email
                    impersonationAllowed
                }
            }
        `,
        {
            variables: { id: userId },
        },
    );

    const [loadMismatches, { data: mismatchData, loading: mismatchLoading }] = useLazyQuery<
        GQLUserPageMismatchesQuery,
        GQLUserPageMismatchesQueryVariables
    >(gql`
        query UserPageMismatches($id: String!) {
            user: userPermissionsUserById(id: $id) {
                id
                impersonationNotAllowedByPermissions {
                    permission
                    missingContentScopes
                }
            }
        }
    `);

    if (error) {
        throw new Error(error.message);
    }

    if (loading || !data) {
        return <Loading />;
    }

    const impersonationAllowed = data.user.impersonationAllowed;
    const permissionMismatches = mismatchData?.user.impersonationNotAllowedByPermissions ?? [];

    const handleQuestionMarkClick = () => {
        loadMismatches({ variables: { id: userId } });
        setDialogOpen(true);
    };

    return (
        <>
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
                                          label: commonImpersonationMessages.startImpersonation,
                                          icon: <ImpersonateUser />,
                                          disabled: !impersonationAllowed,
                                          onClick: () => startImpersonation(userId),
                                      },
                                !currentUser.impersonated && !impersonationAllowed
                                    ? {
                                          icon: <QuestionMark />,
                                          label: (
                                              <FormattedMessage
                                                  id="comet.userPermissions.whyCannotImpersonate"
                                                  defaultMessage="Why can't I impersonate?"
                                              />
                                          ),
                                          onClick: handleQuestionMarkClick,
                                      }
                                    : null,
                            ]}
                        />
                    )}
                </ToolbarActions>
            </StackToolbar>
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
                                                          scopes: m.missingContentScopes
                                                              .map((cs: Record<string, unknown>) => Object.values(cs).join("/"))
                                                              .join(", "),
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
