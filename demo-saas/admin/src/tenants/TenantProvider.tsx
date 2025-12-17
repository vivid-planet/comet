import { gql, useQuery } from "@apollo/client";
import { MenuItem, Select } from "@mui/material";
import { createContext, type ReactNode, useContext } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory, useRouteMatch } from "react-router";

import { type GQLTenantsQuery, type GQLTenantsQueryVariables } from "./TenantProvider.generated";

const Context = createContext<TenantContext>({
    tenantId: "",
});

interface TenantContext {
    tenantId: string;
}

export function useTenant(): TenantContext {
    return useContext(Context);
}

export function TenantProvider({ children }: { children: (p: { tenantId: string }) => ReactNode }) {
    const routeMatch = useRouteMatch<{ tenantId?: string }>("/:tenantId");

    if (!routeMatch || !routeMatch.params.tenantId) {
        return <TenantSelector />;
    }

    return (
        <Context.Provider
            value={{
                tenantId: routeMatch.params.tenantId,
            }}
        >
            {children({ tenantId: routeMatch.params.tenantId })}
        </Context.Provider>
    );
}

export function TenantSelector() {
    const { data } = useQuery<GQLTenantsQuery, GQLTenantsQueryVariables>(tenantsQuery);
    const history = useHistory();

    if (data?.tenants.nodes.length === 1) {
        history.push(`/${data?.tenants.nodes[0].id}`);
    }

    return (
        <>
            <h1>
                <FormattedMessage id="tenants.selectTenant" defaultMessage="Select Tenant" />
            </h1>
            <Select
                label={<FormattedMessage id="tenants.selectTenant" defaultMessage="Select Tenant" />}
                onChange={(event) => {
                    history.push(`/${event.target.value}`);
                }}
                sx={{ width: "300px" }}
            >
                {data?.tenants.nodes.map((tenant) => (
                    <MenuItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
}

const tenantsQuery = gql`
    query Tenants {
        tenants {
            nodes {
                id
                name
            }
        }
    }
`;
