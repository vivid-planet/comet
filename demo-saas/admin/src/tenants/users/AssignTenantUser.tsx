import { gql, useApolloClient } from "@apollo/client";
import { MainContent, Savable } from "@comet/admin";
import { useState } from "react";

import { type GQLAssignTenantUsersMutation, type GQLAssignTenantUsersMutationVariables } from "./AssignTenantUser.generated";
import { UserPermissionsUsersGrid } from "./generated/AssignUsersGrid";

const assignTenantUsersQuery = gql`
    mutation AssignTenantUsers($tenant: ID!, $userIds: [String!]!) {
        assignTenantUsers(tenant: $tenant, userIds: $userIds) {
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
                    await client.mutate<GQLAssignTenantUsersMutation, GQLAssignTenantUsersMutationVariables>({
                        mutation: assignTenantUsersQuery,
                        variables: { tenant: tenantId, userIds: values },
                    });

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
