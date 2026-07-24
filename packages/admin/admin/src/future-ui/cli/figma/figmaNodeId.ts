import { Node, type Project, SyntaxKind } from "ts-morph";

import { FigmaCliError } from "./figmaCliError.js";
import { getOrAddSourceFile } from "./tsMorphProject.js";

const FIGMA_DESIGN_HELPER_NAME = "figmaDesign";
const URL_NODE_ID_SEPARATOR = "-";
const REST_API_NODE_ID_SEPARATOR = ":";

function toRestApiNodeId(urlNodeId: string): string {
    return urlNodeId.split(URL_NODE_ID_SEPARATOR).join(REST_API_NODE_ID_SEPARATOR);
}

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
            return toRestApiNodeId(nodeIdLiteral.getLiteralValue());
        }
    }

    throw new FigmaCliError("source_incomplete", `Could not find a \`${FIGMA_DESIGN_HELPER_NAME}({ nodeId })\` call in "${storyFilePath}"`);
}
