/**
 * Projects a future-ui component's committed source into the comparable
 * representation — the deterministic description a later `diff` compares
 * against the Figma-side projection. This is pure static analysis: it reads the
 * component's props (via the type checker), its parts (its SCSS module's class
 * names), and its Figma node id (its story), and makes no network calls.
 *
 * It reports what the code implements as-is; where the code and the Figma
 * design differ, surfacing the gap is the `diff`'s job, not this projection's.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { extractFigmaNodeId } from "./figmaIdentity.js";
import { projectComponentProps, type ProjectedProp } from "./propProjection.js";
import { extractScssParts } from "./scssParts.js";
import { createProject } from "./tsMorphProject.js";

const componentsDirectory = join(dirname(fileURLToPath(import.meta.url)), "../../components");

export interface ImplementedProjection {
    component: string;
    componentId: string;
    props: Record<string, ProjectedProp>;
    rootElementProps?: string;
    parts: string[];
}

function toComponentName(argument: string): string {
    return argument.charAt(0).toUpperCase() + argument.slice(1);
}

function toFeatureFolder(componentName: string): string {
    return componentName.charAt(0).toLowerCase() + componentName.slice(1);
}

/** Projects the named future-ui component (e.g. `Button`) from its committed source. */
export function projectImplementedComponent(componentArgument: string): ImplementedProjection {
    const componentName = toComponentName(componentArgument);
    const featureDirectory = join(componentsDirectory, toFeatureFolder(componentName));

    const componentFilePath = join(featureDirectory, `${componentName}.tsx`);
    const scssModulePath = join(featureDirectory, `${componentName}.module.scss`);
    const storyFilePath = join(featureDirectory, "__stories__", `${componentName}.stories.tsx`);

    if (!existsSync(componentFilePath)) {
        throw new Error(`Component "${componentName}" not found at "${componentFilePath}"`);
    }
    if (!existsSync(scssModulePath)) {
        throw new Error(`Component "${componentName}" has no SCSS module at "${scssModulePath}"`);
    }
    if (!existsSync(storyFilePath)) {
        throw new Error(`Component "${componentName}" has no story at "${storyFilePath}"`);
    }

    const project = createProject();
    const componentId = extractFigmaNodeId({ project, storyFilePath });
    const { props, rootElementProps } = projectComponentProps({
        project,
        componentFilePath,
        propsInterfaceName: `${componentName}Props`,
    });
    const parts = extractScssParts(readFileSync(scssModulePath, "utf8"));

    return {
        component: componentName,
        componentId,
        props,
        ...(rootElementProps ? { rootElementProps } : {}),
        parts,
    };
}
