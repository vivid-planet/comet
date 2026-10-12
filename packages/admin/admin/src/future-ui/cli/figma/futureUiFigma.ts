import { Command } from "commander";

import { ddsFigmaFileUrl } from "../../storybook/figmaDesign.js";
import type { ComponentDescription } from "./componentDescription.js";
import { findImplementedComponentDifferences } from "./componentDifferences.js";
import { discoverComponentInventory } from "./componentInventory.js";
import { describeImplementedComponent, type ImplementedComponent, readImplementedComponent } from "./describeImplementedComponent.js";
import { FigmaRestClient, parseFigmaFileKey, resolveFigmaToken } from "./figmaClient.js";
import { exitCode, exitCodeForError, FigmaCliError, isFigmaCliError } from "./figmaCliError.js";
import { describeFigmaTarget, findFigmaTarget } from "./figmaTargetDescription.js";

function writeResult(payload: object): void {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function createClient(): FigmaRestClient {
    return new FigmaRestClient({ token: resolveFigmaToken(), fileKey: parseFigmaFileKey(ddsFigmaFileUrl) });
}

async function runList(): Promise<void> {
    const fileKey = parseFigmaFileKey(ddsFigmaFileUrl);
    const { version, components } = await discoverComponentInventory(createClient());
    writeResult({ ok: true, fileKey, version, components });
}

async function runDescribeTarget(componentName: string): Promise<void> {
    const client = createClient();
    const { components } = await discoverComponentInventory(client);
    const component = components.find((candidate) => candidate.name === componentName);
    if (!component) {
        const knownNames = components.map((candidate) => candidate.name).join(", ");
        throw new FigmaCliError("component_unknown", `Component "${componentName}" is not in the inventory. Known components: ${knownNames}`);
    }
    const nodes = await client.getFileNodes([component.nodeId]);
    writeResult({ ok: true, ...describeFigmaTarget(nodes, component.nodeId) });
}

function runDescribeImplemented(componentName: string): void {
    writeResult({ ok: true, ...describeImplementedComponent(componentName) });
}

async function fetchFigmaTargets(client: FigmaRestClient, nodeIds: string[]): Promise<Map<string, ComponentDescription>> {
    const targetsByNodeId = new Map<string, ComponentDescription>();
    if (nodeIds.length === 0) {
        return targetsByNodeId;
    }
    const nodesResponse = await client.getFileNodes(nodeIds);
    for (const nodeId of nodeIds) {
        const target = findFigmaTarget(nodesResponse, nodeId);
        if (target !== undefined) {
            targetsByNodeId.set(nodeId, target);
        }
    }
    return targetsByNodeId;
}

function listLinkedNodeIds(implementedComponents: ImplementedComponent[]): string[] {
    return implementedComponents.flatMap(({ nodeId }) => (nodeId === undefined ? [] : [nodeId]));
}

async function diffComponent(componentArgument: string): Promise<void> {
    const client = createClient();
    const implemented = readImplementedComponent(componentArgument);
    const isLinked = implemented.nodeId !== undefined;
    const inventory = isLinked ? [] : (await discoverComponentInventory(client)).components;
    const targetsByNodeId = await fetchFigmaTargets(client, listLinkedNodeIds([implemented]));
    const differences = findImplementedComponentDifferences({ implemented, inventory, targetsByNodeId });
    writeResult({ ok: true, component: implemented.component, nodeId: implemented.nodeId, differences });
}

const program = new Command();
program.name("future-ui-figma").description("Figma bridge for the future-ui component library (experimental)");
program.command("list").description("List the DDS component inventory discovered in the Figma file").action(runList);
program.command("describe-target <component>").description("Describe what a future-ui component's Figma design specifies").action(runDescribeTarget);
program
    .command("describe-implemented <component>")
    .description("Describe what a future-ui component's source implements")
    .action(runDescribeImplemented);
program.command("diff <component>").description("Report how a future-ui component's source differs from its Figma design").action(diffComponent);

function toFigmaCliError(error: unknown): FigmaCliError {
    if (isFigmaCliError(error)) {
        return error;
    }
    return new FigmaCliError("figma_error", error instanceof Error ? error.message : String(error));
}

async function main(): Promise<void> {
    try {
        await program.parseAsync(process.argv);
        process.exit(exitCode.ok);
    } catch (error) {
        const figmaError = toFigmaCliError(error);
        writeResult({ ok: false, error: { code: figmaError.code, message: figmaError.message } });
        process.exit(exitCodeForError(figmaError.code));
    }
}

await main();
