import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    blockInputToData,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    PixelImageBlock,
} from "@comet/cms-api";
import { IsBoolean } from "class-validator";

class MailImageBlockData extends BlockData {
    @ChildBlock(PixelImageBlock)
    image: BlockDataInterface;

    @BlockField()
    fullWidth: boolean;
}

class MailImageBlockInput extends BlockInput {
    @ChildBlockInput(PixelImageBlock)
    image: ExtractBlockInput<typeof PixelImageBlock>;

    @BlockField()
    @IsBoolean()
    fullWidth: boolean;

    transformToBlockData(): MailImageBlockData {
        return blockInputToData(MailImageBlockData, this);
    }
}

export const MailImageBlock = createBlock(MailImageBlockData, MailImageBlockInput, "MailImage");
