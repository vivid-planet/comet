import { BlockMigration, BlockMigrationInterface } from "@comet/api-blocks";

interface From {
    attachedBlocks: Array<
        { type: "internal"; props: { targetPageId?: string } } | { type: "external"; props: { targetUrl?: string; openInNewWindow: boolean } }
    >;
    activeType?: "internal" | "external" | null;
}

interface To {
    attachedBlocks: Array<
        { type: "internal"; props: { targetPageId?: string } } | { type: "external"; props: { targetUrl?: string; openInNewWindow: boolean } }
    >;
    activeType: "internal" | "external";
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
                    attachedBlocks: [{ type: "internal", props: { targetPageId: undefined } }],
                    activeType: "internal",
                };
            }
        }
    }
}
