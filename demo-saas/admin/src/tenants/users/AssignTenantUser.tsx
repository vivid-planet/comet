import { gql, useApolloClient } from "@apollo/client";
import { MainContent, Savable } from "@comet/admin";
import { useState } from "react";

import { type GQLCreateTenantUserMutation, type GQLCreateTenantUserMutationVariables } from "./AssignTenantUser.generated";
import { UserPermissionsUsersGrid } from "./generated/AssignUsersGrid";

const createTenantUserQuery = gql`
    mutation CreateTenantUser($tenant: ID!, $userId: String!) {
        createTenantUser(tenant: $tenant, input: { userId: $userId }) {
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
                        await client.mutate<GQLCreateTenantUserMutation, GQLCreateTenantUserMutationVariables>({
                            mutation: createTenantUserQuery,
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
