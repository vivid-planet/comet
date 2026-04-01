import Anthropic from "@anthropic-ai/sdk";
import { DisableCometGuards, PageTreeService } from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Body, Controller, Inject, Post, Res } from "@nestjs/common";
import { Config } from "@src/config/config";
import { Page } from "@src/documents/pages/entities/page.entity";
import { randomUUID } from "crypto";
import { Response } from "express";

import { AiChatService } from "./ai-chat.service";
import { AiChatPermissionResponseInput } from "./dto/ai-chat-permission-response.input";
import { AiChatStreamInput } from "./dto/ai-chat-stream.input";
import { AiChatMessageRole } from "./entities/ai-chat-message.entity";
import { createDamTools } from "./tools/dam.tools";
import { createPageTreeTools } from "./tools/page-tree.tools";
import { createPagesTools } from "./tools/pages.tools";
import { AiChatTool } from "./tools/tool.interface";

interface PermissionContext {
    toolName: string;
    newData: unknown;
    currentData: unknown;
}

const MAX_TOOL_ITERATIONS = 50;

@Controller("ai-chat")
@DisableCometGuards()
export class AiChatController {
    private readonly toolDefinitions: Anthropic.Tool[];
    private readonly toolMap: Map<string, (input: unknown) => Promise<string>>;
    private readonly pendingPermissions = new Map<string, (approved: boolean) => void>();

    constructor(
        @Inject("config") private readonly config: Config,
        private readonly aiChatService: AiChatService,
        private readonly pageTreeService: PageTreeService,
        private readonly em: EntityManager,
    ) {
        const allTools: AiChatTool[] = [...createPageTreeTools(pageTreeService), ...createPagesTools(pageTreeService, em), ...createDamTools(em)];
        this.toolDefinitions = allTools.map((t) => t.definition);
        this.toolMap = new Map(allTools.map((t) => [t.definition.name, t.execute]));
    }

    @Post("permission-response")
    permissionResponse(@Body() body: AiChatPermissionResponseInput): void {
        const resolve = this.pendingPermissions.get(body.requestId);
        if (resolve) {
            this.pendingPermissions.delete(body.requestId);
            resolve(body.approved);
        }
    }

    @Post("stream")
    async stream(@Body() body: AiChatStreamInput, @Res() res: Response): Promise<void> {
        if (!this.config.anthropicApiKey) {
            res.status(500).json({ message: "ANTHROPIC_API_KEY not configured" });
            return;
        }

        const conversation = await this.aiChatService.getOrCreateConversation(body.conversationId);
        await this.aiChatService.addMessage(conversation, AiChatMessageRole.User, body.message);

        const history: Anthropic.MessageParam[] = conversation.messages
            .getItems()
            .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache, no-transform"); // no-transform: tells compression middleware not to buffer this SSE response
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no"); //tells nginx / oauth2-proxy / mitmproxy not to buffer
        res.flushHeaders();

        const anthropic = new Anthropic({ apiKey: this.config.anthropicApiKey });

        let assistantContent = "";
        let iteration = 0;

        while (iteration < MAX_TOOL_ITERATIONS) {
            const stream = anthropic.messages.stream({
                //model: "claude-opus-4-6",
                model: "claude-haiku-4-5",
                max_tokens: 1024 * 10,
                tools: this.toolDefinitions,
                messages: this.compressHistory(history),
            });

            for await (const event of stream) {
                //console.log(event);
                if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
                    assistantContent += event.delta.text;
                    res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
                }
            }

            const message = await stream.finalMessage();
            console.log("final message", message);

            if (message.stop_reason === "tool_use") {
                const toolUseBlocks = message.content.filter((block): block is Anthropic.ToolUseBlock => block.type === "tool_use");

                for (const block of toolUseBlocks) {
                    res.write(`data: ${JSON.stringify({ toolUse: { id: block.id, name: block.name, args: JSON.stringify(block.input) } })}\n\n`);
                }

                history.push({ role: "assistant", content: message.content });

                //console.time("tool-call");
                const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
                    toolUseBlocks.map(async (block) => {
                        if (block.name === "save_page") {
                            // TODO: obviously, this should not be in here
                            const pageId = (block.input as { pageId?: string }).pageId;
                            const currentPage = pageId ? await this.em.findOne(Page, { id: pageId }) : null;
                            const currentData = currentPage ? { content: currentPage.content, seo: currentPage.seo, stage: currentPage.stage } : null;
                            const requestId = randomUUID();
                            const approved = await this.waitForPermission(requestId, res, {
                                toolName: block.name,
                                newData: block.input,
                                currentData,
                            });
                            if (!approved) {
                                const content = JSON.stringify({ error: "Permission denied by user." });
                                res.write(`data: ${JSON.stringify({ toolResult: { id: block.id, result: content } })}\n\n`);
                                return {
                                    type: "tool_result" as const,
                                    tool_use_id: block.id,
                                    content,
                                };
                            }
                        }

                        const handler = this.toolMap.get(block.name);
                        const content = handler
                            ? await handler(block.input).catch((err: Error) => {
                                  console.error(`Tool ${block.name} threw an error:`, err);
                                  return JSON.stringify({ error: err.message });
                              })
                            : JSON.stringify({ error: `Unknown tool: ${block.name}` });
                        try {
                            const parsed = JSON.parse(content) as { error?: string };
                            if (parsed.error) {
                                res.write(`data: ${JSON.stringify({ toolErrorLine: `${block.name}: ${parsed.error}` })}\n\n`);
                            }
                        } catch {
                            // content is not JSON (e.g. raw file content) — no error to surface
                        }
                        res.write(`data: ${JSON.stringify({ toolResult: { id: block.id, result: content } })}\n\n`);
                        return { type: "tool_result" as const, tool_use_id: block.id, content };
                    }),
                );
                //console.timeEnd("tool-call");

                history.push({ role: "user", content: toolResults });
                iteration++;
            } else if (message.stop_reason === "max_tokens") {
                //console.log("max_tokens, break");
                res.write(`data: ${JSON.stringify({ maxTokens: true })}\n\n`);
                break;
            } else {
                //console.log("break");
                break;
            }
        }

        await this.aiChatService.addMessage(conversation, AiChatMessageRole.Assistant, assistantContent);
        res.write("data: [DONE]\n\n");
        res.end();
    }

    private waitForPermission(requestId: string, res: Response, context: PermissionContext): Promise<boolean> {
        return new Promise((resolve) => {
            this.pendingPermissions.set(requestId, resolve);
            res.write(`data: ${JSON.stringify({ permissionRequest: { requestId, ...context } })}\n\n`);
            setTimeout(() => {
                if (this.pendingPermissions.has(requestId)) {
                    this.pendingPermissions.delete(requestId);
                    resolve(false);
                }
            }, 60_000);
        });
    }

    // Truncate old tool results in history before sending to the API.
    // The model has already processed them; keeping full content re-inflates input tokens on every iteration.
    private compressHistory(history: Anthropic.MessageParam[]): Anthropic.MessageParam[] {
        const MAX_TOOL_RESULT_LENGTH = 2000;
        return history.map((msg, i) => {
            const isLastMessage = i === history.length - 1;
            if (!isLastMessage && msg.role === "user" && Array.isArray(msg.content)) {
                const content = msg.content.map((block) => {
                    if (block.type === "tool_result" && typeof block.content === "string" && block.content.length > MAX_TOOL_RESULT_LENGTH) {
                        return { ...block, content: `${block.content.slice(0, MAX_TOOL_RESULT_LENGTH)}\n[truncated]` };
                    }
                    return block;
                });
                return { ...msg, content };
            }
            return msg;
        });
    }
}
