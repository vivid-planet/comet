import { FlatBlocks } from "../flat-blocks/flat-blocks";
import { BlockContext, BlockDataInterface } from "./block";

export async function getPreviewImageUrlTemplates(
    block: BlockDataInterface,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependencies: Record<string, any>,
    context: BlockContext,
): Promise<string[]> {
    const previewImageUrlTemplates: string[] = [];

    const visitor = new FlatBlocks(block);

    for (const node of visitor.depthFirst()) {
        if (node.visible) {
            const previewImageUrlTemplate = await node.block.previewImageUrlTemplate(dependencies, context);

            if (previewImageUrlTemplate !== undefined) {
                previewImageUrlTemplates.push(previewImageUrlTemplate);
            }
        }
    }

    return previewImageUrlTemplates;
}

export async function getMostSignificantPreviewImageUrlTemplate(
    block: BlockDataInterface,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependencies: Record<string, any>,
    context: BlockContext,
): Promise<string | undefined> {
    const previewImageUrlTemplates = await getPreviewImageUrlTemplates(block, dependencies, context);

    return previewImageUrlTemplates.length > 0 ? previewImageUrlTemplates[0] : undefined;
}
