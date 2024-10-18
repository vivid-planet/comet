import { gql, useApolloClient } from "@apollo/client";
import { Button, ButtonProps } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useCurrentUser, useUserPermissionCheck } from "../hooks/currentUser";
import {
    GQLUserPermissionsStartImpersonationMutation,
    GQLUserPermissionsStartImpersonationMutationVariables,
    GQLUserPermissionsStopImpersonationMutation,
} from "./ImpersonationButtons.generated";

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

export const StartImpersonationButton = ({ userId }: { userId: string }) => {
    const currentUser = useCurrentUser();
    const isAllowed = useUserPermissionCheck();
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

    if (!isAllowed("impersonation")) return null;

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
