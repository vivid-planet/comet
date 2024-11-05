import { createContext, PropsWithChildren, useContext } from "react";

import { DependencyInterface } from "./types";

export interface EntityDependencyMap {
    [graphqlObjectType: string]: DependencyInterface;
}

const DependenciesConfigContext = createContext<EntityDependencyMap>({});

export const DependenciesConfigProvider = ({ children, entityDependencyMap }: PropsWithChildren<{ entityDependencyMap: EntityDependencyMap }>) => {
    return <DependenciesConfigContext.Provider value={entityDependencyMap}>{children}</DependenciesConfigContext.Provider>;
};

export const useDependenciesConfig = (): EntityDependencyMap => {
    return useContext(DependenciesConfigContext);
};
