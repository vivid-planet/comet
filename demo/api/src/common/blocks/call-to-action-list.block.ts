import { createListBlock } from "@comet/blocks-api";
import { CallToActionBlock } from "@src/common/blocks/call-to-action.block";

export const CallToActionListBlock = createListBlock({ block: CallToActionBlock }, "CallToActionList");
