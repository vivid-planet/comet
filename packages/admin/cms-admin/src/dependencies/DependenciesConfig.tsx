import * as React from "react";

import { DependencyInterface } from "./types";

export interface EntityDependencyMap {
    [graphqlObjectType: string]: DependencyInterface;
}

const DependenciesConfigContext = React.createContext<EntityDependencyMap>({});

export const DependenciesConfigProvider: React.FunctionComponent<{ entityDependencyMap: EntityDependencyMap }> = ({
    children,
    entityDependencyMap,
}) => {
    return <DependenciesConfigContext.Provider value={entityDependencyMap}>{children}</DependenciesConfigContext.Provider>;
};

export const useDependenciesConfig = (): EntityDependencyMap => {
    return React.useContext(DependenciesConfigContext);
};
