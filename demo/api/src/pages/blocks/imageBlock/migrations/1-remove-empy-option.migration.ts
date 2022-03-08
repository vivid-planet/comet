import { BlockMigration, BlockMigrationInterface } from "@comet/api-blocks";
import { ImageCropArea } from "@comet/api-cms";

interface From {
    attachedBlocks: Array<{ type: "pixelImage"; props: { damFileId?: string; cropArea?: ImageCropArea } }>;
    activeType?: "pixelImage" | null;
}

interface To {
    attachedBlocks: Array<{ type: "pixelImage"; props: { damFileId?: string; cropArea?: ImageCropArea } }>;
    activeType: "pixelImage";
}

export class RemoveEmptyOptionMigration extends BlockMigration<(from: From) => To> implements BlockMigrationInterface {
    public readonly toVersion = 1;

    protected migrate({ attachedBlocks, activeType }: From): To {
        if (activeType) {
            return { attachedBlocks, activeType };
        } else {
            if (attachedBlocks.length > 0) {
                return {
                    attachedBlocks,
                    activeType: attachedBlocks[0].type,
                };
            } else {
                return {
                    attachedBlocks: [{ type: "pixelImage", props: { damFileId: undefined, cropArea: undefined } }],
                    activeType: "pixelImage",
                };
            }
        }
    }
}
