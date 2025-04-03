import { CrudMoreActionsMenu, FillSpace, StackToolbar, ToolbarActions, ToolbarBackButton } from "@comet/admin";
import { ImpersonateUser, Reset } from "@comet/admin-icons";

import { commonImpersonationMessages } from "../../common/impersonation/commonImpersonationMessages";
import { ContentScopeIndicator } from "../../contentScope/ContentScopeIndicator";
import { useCurrentUser, useUserPermissionCheck } from "../hooks/currentUser";
import { startImpersonation, stopImpersonation } from "../utils/handleImpersonation";
import { ToolbarUserTitleItem } from "./userTitleItem/ToolbarUserTitleItem";

export const UserPermissionsUserPageToolbar = ({ userId }: { userId: string }) => {
    const currentUser = useCurrentUser();
    const isAllowed = useUserPermissionCheck();

    return (
        <StackToolbar scopeIndicator={<ContentScopeIndicator global />}>
            <ToolbarBackButton />
            <ToolbarUserTitleItem userId={userId} />
            <FillSpace />
            <ToolbarActions>
                {isAllowed("impersonation") && (
                    <CrudMoreActionsMenu
                        overallActions={[
                            currentUser.impersonated
                                ? {
                                      icon: <Reset />,
                                      label: commonImpersonationMessages.stopImpersonation,
                                      onClick: () => stopImpersonation,
                                  }
                                : {
                                      label: commonImpersonationMessages.startImpersonation,
                                      icon: <ImpersonateUser />,
                                      disabled: userId === currentUser.id,
                                      onClick: () => startImpersonation(userId),
                                  },
                        ]}
                    />
                )}
            </ToolbarActions>
        </StackToolbar>
    );
};
