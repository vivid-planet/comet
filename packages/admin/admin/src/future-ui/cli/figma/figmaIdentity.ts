/**
 * Reads a future-ui component's Figma identity from its story. Every component
 * links its Figma frame through a fixed `figmaDesign({ nodeId })` call in the
 * story's `meta`; the node id is the component's only stored per-component
 * state. The `node-id` is stored in the URL's dash form (`25-2`) and converted
 * to the REST API's colon form (`25:2`).
 */
import { Node, type Project, SyntaxKind } from "ts-morph";

import { getOrAddSourceFile } from "./tsMorphProject.js";

const FIGMA_DESIGN_HELPER_NAME = "figmaDesign";

/** Converts a Figma `node-id` from the URL dash form (`25-2`) to the API colon form (`25:2`). */
function toNodeIdColonForm(urlNodeId: string): string {
    return urlNodeId.replace(/-/g, ":");
}

/**
 * The Figma node id a story links via `figmaDesign({ nodeId })`, in the REST
 * API's colon form. Throws when the story has no such call, so a missing link
 * is surfaced rather than approximated.
 */
export function extractFigmaNodeId({ project, storyFilePath }: { project: Project; storyFilePath: string }): string {
    const storyFile = getOrAddSourceFile(project, storyFilePath);

    for (const call of storyFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
        if (call.getExpression().getText() !== FIGMA_DESIGN_HELPER_NAME) {
            continue;
        }

        const [argument] = call.getArguments();
        if (!argument || !Node.isObjectLiteralExpression(argument)) {
            continue;
        }

        const nodeIdProperty = argument.getProperty("nodeId");
        if (!nodeIdProperty || !Node.isPropertyAssignment(nodeIdProperty)) {
            continue;
        }

        const nodeIdLiteral = nodeIdProperty.getInitializerIfKind(SyntaxKind.StringLiteral);
        if (nodeIdLiteral) {
            return toNodeIdColonForm(nodeIdLiteral.getLiteralValue());
        }
    }

    throw new Error(`Could not find a \`${FIGMA_DESIGN_HELPER_NAME}({ nodeId })\` call in "${storyFilePath}"`);
}
