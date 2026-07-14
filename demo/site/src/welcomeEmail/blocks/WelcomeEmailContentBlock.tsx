import { BlocksBlock, type SupportedBlocks } from "@comet/mail-react";
import type { WelcomeEmailContentBlockData } from "@src/blocks.generated";

const supportedBlocks: SupportedBlocks = {};

export function WelcomeEmailContentBlock({ content }: { content: WelcomeEmailContentBlockData }) {
    return <BlocksBlock data={content} supportedBlocks={supportedBlocks} />;
}
