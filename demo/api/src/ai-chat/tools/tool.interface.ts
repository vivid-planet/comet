import type Anthropic from "@anthropic-ai/sdk";

export interface AiChatTool {
    definition: Anthropic.Tool;
    execute: (input: unknown) => Promise<string>;
}
