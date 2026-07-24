import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ComponentDescription } from "./componentDescription.js";
import { FigmaCliError } from "./figmaCliError.js";
import { extractFigmaNodeId } from "./figmaNodeId.js";
import { describeComponentProps } from "./propDescription.js";
import { createTsMorphProject } from "./tsMorphProject.js";

const componentsDirectory = join(dirname(fileURLToPath(import.meta.url)), "../../components");

function findFeatureFolder(componentArgument: string): string {
    const featureFolders = readdirSync(componentsDirectory);
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

export function describeImplementedComponent(componentArgument: string): ComponentDescription {
    const featureFolder = findFeatureFolder(componentArgument);
    const componentName = featureFolder.charAt(0).toUpperCase() + featureFolder.slice(1);
    const featureDirectory = join(componentsDirectory, featureFolder);

    const componentFilePath = requireExistingFile(join(featureDirectory, `${componentName}.tsx`));
    const storyFilePath = requireExistingFile(join(featureDirectory, "__stories__", `${componentName}.stories.tsx`));
    const project = createTsMorphProject();

    return {
        component: componentName,
        nodeId: extractFigmaNodeId({ project, storyFilePath }),
        props: describeComponentProps({ project, componentFilePath, propsInterfaceName: `${componentName}Props` }),
    };
}
