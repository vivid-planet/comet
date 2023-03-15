import * as React from "react";

import { FileDependency } from "../dam/FileDependency";
import { DependencyComponentInterface } from "./Dependency";

export interface DependencyEntities {
    [graphqlObjectType: string]: {
        DependencyComponent: DependencyComponentInterface;
    };
}

const DependenciesConfigContext = React.createContext<DependencyEntities | undefined>(undefined);

export const DependenciesConfigProvider: React.FunctionComponent<{ entities: DependencyEntities }> = ({ children, entities }) => {
    return (
        <DependenciesConfigContext.Provider
            value={{
                DamFile: {
                    DependencyComponent: FileDependency,
                },
                ...entities,
            }}
        >
            {children}
        </DependenciesConfigContext.Provider>
    );
};

export const useDependenciesConfig = (): DependencyEntities => {
    const context = React.useContext(DependenciesConfigContext);
    return context ?? {};
};
