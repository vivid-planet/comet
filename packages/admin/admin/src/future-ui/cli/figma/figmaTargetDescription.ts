import { z } from "zod";

import type { ComponentDescription, PropDescription } from "./componentDescription.js";
import { FigmaCliError } from "./figmaCliError.js";

const NON_PUBLIC_NAME_PREFIX = "_";
const YES_OPTION = "yes";
const NO_OPTION = "no";

const componentPropertyDefinitionSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("VARIANT"), defaultValue: z.string(), variantOptions: z.array(z.string()) }),
    z.object({ type: z.literal("BOOLEAN"), defaultValue: z.boolean() }),
    z.object({ type: z.literal("TEXT"), defaultValue: z.string() }),
    z.object({ type: z.literal("INSTANCE_SWAP"), defaultValue: z.string() }),
    z.object({ type: z.literal("SLOT") }),
]);
type ComponentPropertyDefinition = z.infer<typeof componentPropertyDefinitionSchema>;

const nodesResponseSchema = z.object({ nodes: z.record(z.string(), z.unknown()) });
const nodeWithDocumentSchema = z.object({ document: z.record(z.string(), z.unknown()) });
const componentSetDocumentSchema = z.object({
    name: z.string(),
    componentPropertyDefinitions: z.record(z.string(), componentPropertyDefinitionSchema).optional(),
});
type ComponentSetDocument = z.infer<typeof componentSetDocumentSchema>;

function parseComponentSetDocument(nodesResponse: unknown, nodeId: string): ComponentSetDocument {
    const response = nodesResponseSchema.safeParse(nodesResponse);
    if (!response.success) {
        throw new FigmaCliError("figma_error", `Figma nodes response is malformed: ${response.error.message}`);
    }
    const requestedNode = response.data.nodes[nodeId];
    if (requestedNode === undefined || requestedNode === null) {
        throw new FigmaCliError("node_missing", `Figma node "${nodeId}" was not found in the file`);
    }
    const node = nodeWithDocumentSchema.safeParse(requestedNode);
    if (!node.success) {
        throw new FigmaCliError("figma_error", `Figma node "${nodeId}" is malformed: ${node.error.message}`);
    }
    const document = componentSetDocumentSchema.safeParse(node.data.document);
    if (!document.success) {
        throw new FigmaCliError("figma_error", `Figma node "${nodeId}" has malformed component properties: ${document.error.message}`);
    }
    return document.data;
}

/** Figma suffixes a property key with `#<id>`, except on a variant axis. */
function propertyNameFromKey(propertyKey: string): string {
    const idSeparatorIndex = propertyKey.lastIndexOf("#");
    return idSeparatorIndex < 0 ? propertyKey : propertyKey.slice(0, idSeparatorIndex);
}

function toCamelCase(name: string): string {
    const words = name.split(/[^a-zA-Z0-9]+/).filter((word) => word.length > 0);
    return words.map((word, index) => (index === 0 ? word.charAt(0).toLowerCase() : word.charAt(0).toUpperCase()) + word.slice(1)).join("");
}

function isYesNoAxis(options: string[]): boolean {
    const lowercasedOptions = options.map((option) => option.toLowerCase());
    return lowercasedOptions.length === 2 && lowercasedOptions.includes(YES_OPTION) && lowercasedOptions.includes(NO_OPTION);
}

function describeProp(definition: ComponentPropertyDefinition): PropDescription {
    switch (definition.type) {
        case "TEXT":
            // No default: Figma's is the placeholder copy the design renders.
            return { type: "string" };
        case "INSTANCE_SWAP":
        case "SLOT":
            // No default: Figma's is the id of the swapped-in instance, or an empty reference for a slot.
            return { type: "node" };
        case "BOOLEAN":
            return { type: "boolean", default: definition.defaultValue };
        case "VARIANT":
            return isYesNoAxis(definition.variantOptions)
                ? { type: "boolean", default: definition.defaultValue.toLowerCase() === YES_OPTION }
                : { type: "enum", options: definition.variantOptions.map(toCamelCase), default: toCamelCase(definition.defaultValue) };
    }
}

interface FigmaProperty {
    name: string;
    codePropName: string;
    definition: ComponentPropertyDefinition;
}

/** Describes the component set at `nodeId` in a `GET /v1/files/:key/nodes` response. */
export function describeFigmaTarget(nodesResponse: unknown, nodeId: string): ComponentDescription {
    const document = parseComponentSetDocument(nodesResponse, nodeId);
    const publicProperties: FigmaProperty[] = Object.entries(document.componentPropertyDefinitions ?? {})
        .map(([propertyKey, definition]) => {
            const name = propertyNameFromKey(propertyKey);
            return { name, codePropName: toCamelCase(name), definition };
        })
        .filter(({ name }) => !name.startsWith(NON_PUBLIC_NAME_PREFIX))
        .sort((a, b) => (a.codePropName < b.codePropName ? -1 : a.codePropName > b.codePropName ? 1 : 0));

    const props: Record<string, PropDescription> = {};
    const figmaPropertyByCodePropName = new Map<string, FigmaProperty>();
    for (const property of publicProperties) {
        const otherProperty = figmaPropertyByCodePropName.get(property.codePropName);
        if (otherProperty !== undefined) {
            throw new FigmaCliError(
                "figma_error",
                `The Figma properties "${otherProperty.name}" and "${property.name}" both become the prop "${property.codePropName}", which no component can implement`,
            );
        }
        figmaPropertyByCodePropName.set(property.codePropName, property);
        props[property.codePropName] = describeProp(property.definition);
    }

    return { component: document.name, nodeId, props };
}
