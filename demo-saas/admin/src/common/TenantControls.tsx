import { gql, useQuery } from "@apollo/client";
import { type ReactNode } from "react";
import { useHistory } from "react-router";

import { type GQLTenantControlsTenantsQuery, type GQLTenantControlsTenantsQueryVariables } from "./TenantControls.generated";
import { TenantScopeSelect } from "./TenantScopeSelect";

interface ContentScopeControlsProps {
    searchable?: boolean;
    icon?: ReactNode;
}

export function TenantControls({ searchable, icon }: ContentScopeControlsProps): JSX.Element | null {
    const { data, loading } = useQuery<GQLTenantControlsTenantsQuery, GQLTenantControlsTenantsQueryVariables>(tenantsQuery); // TODO: pagination
    const tenants = data?.tenants.nodes.map((tenant) => ({ id: tenant.id, name: tenant.name })) ?? [];

    const url = new URL(window.location.href);
    const tenantId = url.pathname.split("/")[1];
    const history = useHistory();

    // check if tenantId is in tenants, if not redirect to landing page tenant selector
    const tenant = tenants.find((tenant) => tenant.id === tenantId);
    if (!tenant && !loading) {
        history.push(`/`);
    }

    function handleChange(tenantId: string) {
        history.push(`/${tenantId}`);
    }

    // Only show tenant select when user has more than one tenant
    if (tenants.length <= 1) {
        return null;
    }

    return <TenantScopeSelect value={tenantId} onChange={handleChange} options={tenants} icon={icon} searchable={searchable} />;
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
