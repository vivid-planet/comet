import { z } from "zod";

import { FigmaCliError, type FigmaFileClient } from "./figmaClient.js";

const NON_PUBLIC_NAME_PREFIX = "_";

const componentNodeTypeSchema = z.enum(["COMPONENT", "COMPONENT_SET"]);
const componentDevStatusSchema = z.enum(["READY_FOR_DEV", "COMPLETED"]);

const componentNodeSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: componentNodeTypeSchema,
    devStatus: z.object({ type: componentDevStatusSchema }).optional(),
});

const nodeWithChildrenSchema = z.object({ children: z.array(z.unknown()) });

const figmaFileSchema = z.object({
    version: z.string(),
    document: z.record(z.string(), z.unknown()),
});

interface DiscoveredComponent {
    name: string;
    nodeId: string;
    type: z.infer<typeof componentNodeTypeSchema>;
    devStatus: z.infer<typeof componentDevStatusSchema>;
}

interface ComponentInventory {
    version: string;
    components: DiscoveredComponent[];
}

function collectComponents(node: unknown, components: DiscoveredComponent[]): void {
    const component = componentNodeSchema.safeParse(node);
    if (component.success) {
        const { id, name, type, devStatus } = component.data;
        if (devStatus && !name.startsWith(NON_PUBLIC_NAME_PREFIX)) {
            components.push({ name, nodeId: id, type, devStatus: devStatus.type });
        }
        // A set's variants are its children; stop here so they aren't listed as components of their own.
        return;
    }

    const parent = nodeWithChildrenSchema.safeParse(node);
    if (parent.success) {
        for (const child of parent.data.children) {
            collectComponents(child, components);
        }
    }
}

/** Lists each ready-for-dev or completed public component and set once, found by walking the file tree. */
export async function discoverComponentInventory(client: FigmaFileClient): Promise<ComponentInventory> {
    const parsed = figmaFileSchema.safeParse(await client.getFile());
    if (!parsed.success) {
        throw new FigmaCliError("figma_error", `Figma file response is malformed: ${parsed.error.message}`);
    }
    const components: DiscoveredComponent[] = [];
    collectComponents(parsed.data.document, components);
    return { version: parsed.data.version, components };
}
