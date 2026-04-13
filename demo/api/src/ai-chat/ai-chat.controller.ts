import { anthropic } from "@ai-sdk/anthropic";
import { DisableCometGuards, PageTreeService } from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Controller, Inject, Post, Req, Res } from "@nestjs/common";
import { Config } from "@src/config/config";
import { Page } from "@src/documents/pages/entities/page.entity";
import { convertToModelMessages, stepCountIs, streamText, type ToolSet } from "ai";
import { Request, Response } from "express";

import { createDamTools } from "./tools/dam.tools";
import { createPageTreeTools } from "./tools/page-tree.tools";
import { createPagesTools, executeSavePage } from "./tools/pages.tools";

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

    @Post("execute-save-page")
    async executeSavePageEndpoint(@Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            const result = await executeSavePage(req.body.args as Parameters<typeof executeSavePage>[0], this.pageTreeService, this.em);
            res.json({ result });
        } catch (err) {
            res.status(500).json({ result: JSON.stringify({ error: (err as Error).message }) });
        }
    }

    @Post("get-page-current-data")
    async getPageCurrentData(@Req() req: Request, @Res() res: Response): Promise<void> {
        const page = await this.em.findOne(Page, { id: req.body.pageId });
        if (!page) {
            res.json(null);
            return;
        }
        res.json({ content: page.content, seo: page.seo, stage: page.stage });
    }
}
