import * as React from "react";

import { DamFileDependency } from "./DamFileDependency";
import { DependencyInterface } from "./types";

export interface EntityDependencyMap {
    [graphqlObjectType: string]: DependencyInterface;
}

const DependenciesConfigContext = React.createContext<EntityDependencyMap | undefined>(undefined);

export const DependenciesConfigProvider: React.FunctionComponent<{ entityDependencyMap: EntityDependencyMap }> = ({
    children,
    entityDependencyMap,
}) => {
    return (
        <DependenciesConfigContext.Provider
            value={{
                DamFile: DamFileDependency,
                ...entityDependencyMap,
            }}
        >
            {children}
        </DependenciesConfigContext.Provider>
    );
};

export const useDependenciesConfig = (): EntityDependencyMap => {
    const context = React.useContext(DependenciesConfigContext);
    return context ?? {};
};
