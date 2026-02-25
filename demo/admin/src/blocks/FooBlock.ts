import { blockField, defineBlock } from "./block";
import { SpaceBlock } from "./SpaceBlock";

export const FooBlock = defineBlock("FooBlock", {
    fields: {
        space: blockField.block(SpaceBlock),
    },
    toOutput: async (data, context) => {
        return {
            space: await SpaceBlock.toOutput(data.space, context),
        };
    },
});
