import { BlockData, BlockInput, blockInputToData, createBlock } from "@comet/cms-api";

class MailDividerBlockData extends BlockData {}

class MailDividerBlockInput extends BlockInput {
    transformToBlockData(): MailDividerBlockData {
        return blockInputToData(MailDividerBlockData, this);
    }
}

export const MailDividerBlock = createBlock(MailDividerBlockData, MailDividerBlockInput, "MailDivider");
