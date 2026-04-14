import { anthropic } from "@ai-sdk/anthropic";
import { DisableCometGuards, PageTreeService } from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Controller, Inject, Post, Req, Res } from "@nestjs/common";
import { Config } from "@src/config/config";
import { convertToModelMessages, stepCountIs, streamText, type ToolSet } from "ai";
import { Request, Response } from "express";

import { createDamTools } from "./tools/dam.tools";
import { createPageTreeTools } from "./tools/page-tree.tools";
import { createPagesTools } from "./tools/pages.tools";

const MAX_STEPS = 50;

@Controller("ai-chat")
@DisableCometGuards()
export class AiChatController {
    private readonly tools: ToolSet;

    constructor(
        @Inject("config") private readonly config: Config,
        private readonly pageTreeService: PageTreeService,
        private readonly em: EntityManager,
    ) {
        this.tools = {
            ...createPageTreeTools(pageTreeService),
            ...createPagesTools(pageTreeService, em),
            ...createDamTools(em),
        };
    }

    @Post("chat")
    async chat(@Req() req: Request, @Res() res: Response): Promise<void> {
        if (!this.config.anthropicApiKey) {
            res.status(500).json({ message: "ANTHROPIC_API_KEY not configured" });
            return;
        }

        const { messages } = req.body;
        const modelMessages = await convertToModelMessages(messages, { tools: this.tools });

        const result = streamText({
            model: anthropic("claude-haiku-4-5"),
            stopWhen: stepCountIs(MAX_STEPS),
            tools: this.tools,
            messages: modelMessages,
        });

        result.pipeUIMessageStreamToResponse(res, {
            headers: {
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
            },
        });
    }
}
