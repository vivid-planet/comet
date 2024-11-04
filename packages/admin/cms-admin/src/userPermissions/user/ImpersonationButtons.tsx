import { messages } from "@comet/admin";
import { Button, ButtonProps } from "@mui/material";
import Cookies from "js-cookie";
import { FormattedMessage } from "react-intl";

import { useCurrentUser, useUserPermissionCheck } from "../hooks/currentUser";

export const StopImpersonationButton = (buttonProps: ButtonProps) => {
    const stopImpersonation = async () => {
        Cookies.remove("comet-impersonate-user-id");
        location.href = "/";
    };

    return (
        <Button onClick={stopImpersonation} {...buttonProps}>
            <FormattedMessage {...messages.stopImpersonation} />
        </Button>
    );
};

export const StartImpersonationButton = ({ userId }: { userId: string }) => {
    const currentUser = useCurrentUser();
    const isAllowed = useUserPermissionCheck();
    const startImpersonation = async () => {
        Cookies.set("comet-impersonate-user-id", userId);
        location.href = "/";
    };

    if (!isAllowed("impersonation")) return null;

    if (currentUser.id !== userId && !currentUser.impersonated) {
        return (
            <Button onClick={startImpersonation} variant="contained">
                <FormattedMessage {...messages.startImpersonation} />
            </Button>
        );
    }

    if (currentUser.impersonated && currentUser.id === userId) {
        return <StopImpersonationButton variant="contained" />;
    }

    return null;
};
