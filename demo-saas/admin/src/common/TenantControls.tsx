import { gql, useQuery } from "@apollo/client";
import { type ReactNode } from "react";

import { type GQLTenantControlsTenantsQuery, type GQLTenantControlsTenantsQueryVariables } from "./TenantControls.generated";
import { TenantScopeSelect } from "./TenantScopeSelect";

interface ContentScopeControlsProps {
    searchable?: boolean;
    icon?: ReactNode;
}

export function TenantControls({ searchable, icon }: ContentScopeControlsProps): JSX.Element | null {
    const { data } = useQuery<GQLTenantControlsTenantsQuery, GQLTenantControlsTenantsQueryVariables>(tenantsQuery);
    const tenants = data?.tenants.nodes.map((tenant) => ({ id: tenant.id, name: tenant.name })) ?? [];

    // TODO: pagination

    // Only show tenant select when user has more than one tenant
    if (tenants.length > 1) {
        return <TenantScopeSelect value={tenants[0]?.id} onChange={() => {}} options={tenants} icon={icon} searchable={searchable} />;
    }

    return null;
}

const tenantsQuery = gql`
    query TenantControlsTenants {
        tenants {
            nodes {
                id
                name
            }
        }
    }
`;
