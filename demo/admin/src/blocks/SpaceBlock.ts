import { blockField, defineBlock } from "./block";

export const SpaceBlock = defineBlock("SpaceBlock", {
    fields: {
        height: blockField.number(),
    },
    toOutput: async (data) => {
        return { height: data.height, foo: 42 };
    },
});
/*
// when no custom toOutput is needed this is the short version:
export const SpaceBlock = defineBlock(
    "SpaceBlock",
    blockFields({
        height: blockField.number(),
    }),
);
*/
