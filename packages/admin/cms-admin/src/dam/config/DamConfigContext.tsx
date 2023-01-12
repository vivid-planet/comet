import { ApolloClient } from "@apollo/client";
import * as React from "react";

export interface DamDependencyRenderInfo {
    type: React.ReactNode;
    name: React.ReactNode;
    secondaryInfo: React.ReactNode;
}

export interface DamConfig {
    additionalMimeTypes?: string[];
    dependencyRenderInfoProvider?: {
        [key: string]: {
            getRenderInfo: (id: string, apolloClient: ApolloClient<unknown>) => Promise<DamDependencyRenderInfo> | DamDependencyRenderInfo;
            renderCustomContent?: (renderInfo: DamDependencyRenderInfo) => React.ReactNode;
        };
    };
}

export const DamConfigContext = React.createContext<DamConfig | undefined>(undefined);
