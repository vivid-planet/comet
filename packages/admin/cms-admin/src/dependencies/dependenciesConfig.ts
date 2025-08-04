import { useCometConfig } from "../config/CometConfigContext";
import { type DependencyInterface } from "./types";

export type DependenciesConfig = {
    entityDependencyMap: EntityDependencyMap;
};

interface EntityDependencyMap {
    [graphqlObjectType: string]: DependencyInterface;
}

export function useDependenciesConfig(): DependenciesConfig {
    const cometConfig = useCometConfig();

    if (!cometConfig.dependencies) {
        return { entityDependencyMap: {} };
    }

    return cometConfig.dependencies;
}
