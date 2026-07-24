import { Command } from "commander";

import { ddsFigmaFileUrl } from "../../storybook/figmaDesign.js";
import { discoverComponentInventory } from "./componentInventory.js";
import { exitCode, exitCodeForError, FigmaRestClient, isFigmaCliError, parseFigmaFileKey, resolveFigmaToken } from "./figmaClient.js";
import { FigmaCliError } from "./figmaCliError.js";
import { describeFigmaTarget } from "./figmaTargetDescription.js";

function writeResult(payload: object): void {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

async function runList(): Promise<void> {
    const token = resolveFigmaToken();
    const fileKey = parseFigmaFileKey(ddsFigmaFileUrl);
    const client = new FigmaRestClient({ token, fileKey });
    const { version, components } = await discoverComponentInventory(client);
    writeResult({ ok: true, fileKey, version, components });
}

async function runDescribeTarget(componentName: string): Promise<void> {
    const token = resolveFigmaToken();
    const fileKey = parseFigmaFileKey(ddsFigmaFileUrl);
    const client = new FigmaRestClient({ token, fileKey });
    const { components } = await discoverComponentInventory(client);
    const component = components.find((candidate) => candidate.name === componentName);
    if (!component) {
        const knownNames = components.map((candidate) => candidate.name).join(", ");
        throw new FigmaCliError("component_unknown", `Component "${componentName}" is not in the inventory. Known components: ${knownNames}`);
    }
    const nodes = await client.getFileNodes(component.nodeId);
    writeResult({ ok: true, ...describeFigmaTarget(nodes, component.nodeId) });
}

const program = new Command();
program.name("future-ui-figma").description("Figma bridge for the future-ui component library (experimental)");
program.command("list").description("List the DDS component inventory discovered in the Figma file").action(runList);
program.command("describe-target <component>").description("Describe what a future-ui component's Figma design specifies").action(runDescribeTarget);

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
