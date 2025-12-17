import { gql, useApolloClient } from "@apollo/client";
import { MainContent, Savable } from "@comet/admin";
import { useState } from "react";

import { type GQLAssignTenantUserMutation, type GQLAssignTenantUserMutationVariables } from "./AssignTenantUser.generated";
import { UserPermissionsUsersGrid } from "./generated/AssignUsersGrid";

const assignTenantUserQuery = gql`
    mutation AssignTenantUser($tenant: ID!, $userId: String!) {
        assignTenantUser(tenant: $tenant, userId: $userId) {
            id
        }
    }
`;

type AssignTenantUserProps = {
    tenantId: string;
    onDialogClose: () => void;
};

export const AssignTenantUser = ({ tenantId, onDialogClose }: AssignTenantUserProps) => {
    const client = useApolloClient();
    const [values, setValues] = useState<string[]>([]);

    return (
        <>
            <Savable
                doSave={async () => {
                    for (const userId of values) {
                        await client.mutate<GQLAssignTenantUserMutation, GQLAssignTenantUserMutationVariables>({
                            mutation: assignTenantUserQuery,
                            variables: { tenant: tenantId, userId },
                        });
                    }
                    return true;
                }}
                hasChanges={values.length > 0}
                doReset={() => {
                    setValues([]);
                }}
            />
            <MainContent disablePadding sx={{ height: 500 }}>
                <UserPermissionsUsersGrid
                    rowSelectionModel={values}
                    onRowSelectionModelChange={(newUserSelection) => {
                        setValues(newUserSelection.map((rowId) => String(rowId)));
                    }}
                />
            </MainContent>
        </>
    );
};
