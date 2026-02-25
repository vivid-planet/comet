import { blockField, defineBlock } from "./block";

// Context provided at resolve-time (e.g. from a tRPC procedure or server action).
export type ImageBlockContext = {
    loadImage: (id: string) => Promise<{ url: string; width: number; height: number }>;
};

// BlockData (stored):  { imageId: string }
// OutputData (resolved): { imageId: string; url: string; width: number; height: number }
export const ImageBlock = defineBlock("ImageBlock", {
    fields: {
        imageId: blockField.string(),
    },
    toOutput: async (data, ctx: ImageBlockContext) => {
        const { url, width, height } = await ctx.loadImage(data.imageId);
        return { imageId: data.imageId, url, width, height };
    },
});
