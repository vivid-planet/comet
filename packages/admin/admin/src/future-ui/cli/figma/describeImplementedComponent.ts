import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ComponentDescription } from "./componentDescription.js";
import { FigmaCliError } from "./figmaCliError.js";
import { findFigmaNodeId } from "./figmaNodeId.js";
import { describeComponentProps } from "./propDescription.js";
import { createTsMorphProject } from "./tsMorphProject.js";

const componentsDirectory = join(dirname(fileURLToPath(import.meta.url)), "../../components");

function listFeatureFolders(): string[] {
    return readdirSync(componentsDirectory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
}

function findFeatureFolder(componentArgument: string): string {
    const featureFolders = listFeatureFolders();
    const featureFolder = featureFolders.find((entry) => entry.toLowerCase() === componentArgument.toLowerCase());
    if (!featureFolder) {
        throw new FigmaCliError(
            "component_unknown",
            `"${componentArgument}" is not a future-ui component. Known components: ${featureFolders.join(", ")}`,
        );
    }
    return featureFolder;
}

function requireExistingFile(filePath: string): string {
    if (!existsSync(filePath)) {
        throw new FigmaCliError("source_incomplete", `Could not find "${filePath}"`);
    }
    return filePath;
}

export interface ImplementedComponent extends Omit<ComponentDescription, "nodeId"> {
    nodeId?: string;
}

export function readImplementedComponent(componentArgument: string): ImplementedComponent {
    const featureFolder = findFeatureFolder(componentArgument);
    const componentName = featureFolder.charAt(0).toUpperCase() + featureFolder.slice(1);
    const featureDirectory = join(componentsDirectory, featureFolder);

    const componentFilePath = requireExistingFile(join(featureDirectory, `${componentName}.tsx`));
    const storyFilePath = requireExistingFile(join(featureDirectory, "__stories__", `${componentName}.stories.tsx`));
    const project = createTsMorphProject();

    return {
        component: componentName,
        nodeId: findFigmaNodeId({ project, storyFilePath }),
        props: describeComponentProps({ project, componentFilePath, propsInterfaceName: `${componentName}Props` }),
    };
}

export function describeImplementedComponent(componentArgument: string): ComponentDescription {
    const { component, nodeId, props } = readImplementedComponent(componentArgument);
    if (nodeId === undefined) {
        throw new FigmaCliError("source_incomplete", `The ${component} story has no \`figmaDesign({ nodeId })\` call`);
    }
    return { component, nodeId, props };
}

export function readAllImplementedComponents(): ImplementedComponent[] {
    return listFeatureFolders().map(readImplementedComponent);
}
