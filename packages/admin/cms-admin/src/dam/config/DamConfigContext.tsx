import { ApolloClient } from "@apollo/client";
import * as React from "react";

import { UseContentScopeApi } from "../../contentScope/Provider";
import { GQLDamFileDependentsQuery } from "../../graphql.generated";

export interface DamDependencyRenderInfoOptions {
    data: GQLDamFileDependentsQuery["damFile"]["dependents"][0];
    apolloClient: ApolloClient<unknown>;
    contentScope: UseContentScopeApi;
}

export interface DamDependencyRenderInfo {
    type: React.ReactNode;
    name: React.ReactNode;
    secondaryInfo?: React.ReactNode;
    url?: string;
}

export type GetRenderInfo = (id: string, options: DamDependencyRenderInfoOptions) => Promise<DamDependencyRenderInfo> | DamDependencyRenderInfo;

export interface DamConfig {
    additionalMimeTypes?: string[];
    dependencyRenderInfoProvider?: {
        [key: string]: {
            getRenderInfo: GetRenderInfo;
            renderCustomContent?: (renderInfo: DamDependencyRenderInfo) => React.ReactNode;
        };
    };
}

export const DamConfigContext = React.createContext<DamConfig | undefined>(undefined);
