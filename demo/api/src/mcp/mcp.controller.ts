import { DisableCometGuards } from "@comet/cms-api";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Controller, Delete, Get, Logger, type OnModuleDestroy, type OnModuleInit, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";

import { McpToolDiscoveryService } from "./mcp-tool-discovery.service";

@Controller("mcp")
@DisableCometGuards()
export class McpController implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(McpController.name);
    private transports = new Map<string, StreamableHTTPServerTransport>();

    constructor(private readonly toolDiscovery: McpToolDiscoveryService) {}

    onModuleInit(): void {
        const toolCount = this.toolDiscovery.getTools().length;
        this.logger.log(`MCP server ready with ${toolCount} tools at /api/mcp`);
    }

    private createMcpServer(): Server {
        const server = new Server(
            {
                name: "comet-demo-api",
                version: "1.0.0",
            },
            {
                capabilities: {
                    tools: {},
                },
            },
        );

        const tools = this.toolDiscovery.getTools();

        server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: tools.map((tool) => ({
                    name: tool.name,
                    description: tool.description,
                    inputSchema: tool.inputSchema as {
                        type: "object";
                        properties?: Record<string, unknown>;
                        required?: string[];
                    },
                })),
            };
        });

        server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const toolName = request.params.name;
            const tool = tools.find((t) => t.name === toolName);

            if (!tool) {
                return {
                    content: [{ type: "text" as const, text: `Error: Unknown tool "${toolName}"` }],
                    isError: true,
                };
            }

            try {
                const args = (request.params.arguments ?? {}) as Record<string, unknown>;
                const result = await this.toolDiscovery.executeTool(tool, args);
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                return {
                    content: [{ type: "text" as const, text: `Error: ${message}` }],
                    isError: true,
                };
            }
        });

        return server;
    }

    @Post()
    async handlePost(@Req() req: Request, @Res() res: Response): Promise<void> {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        let transport: StreamableHTTPServerTransport;

        if (sessionId) {
            const existingTransport = this.transports.get(sessionId);
            if (!existingTransport) {
                res.status(404).json({ error: "Session not found" });
                return;
            }
            transport = existingTransport;
        } else {
            // New session - create transport and connect
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => crypto.randomUUID(),
            });
            transport.onclose = () => {
                if (transport.sessionId) {
                    this.transports.delete(transport.sessionId);
                }
            };

            const server = this.createMcpServer();
            await server.connect(transport);

            if (transport.sessionId) {
                this.transports.set(transport.sessionId, transport);
            }
        }

        await transport.handleRequest(req, res, req.body);
    }

    @Get()
    async handleGet(@Req() req: Request, @Res() res: Response): Promise<void> {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        const transport = sessionId ? this.transports.get(sessionId) : undefined;
        if (!transport) {
            res.status(404).json({ error: "Session not found" });
            return;
        }

        await transport.handleRequest(req, res);
    }

    @Delete()
    async handleDelete(@Req() req: Request, @Res() res: Response): Promise<void> {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        const transport = sessionId ? this.transports.get(sessionId) : undefined;
        if (!sessionId || !transport) {
            res.status(404).json({ error: "Session not found" });
            return;
        }

        await transport.close();
        this.transports.delete(sessionId);
        res.status(200).json({ message: "Session closed" });
    }

    async onModuleDestroy(): Promise<void> {
        for (const transport of this.transports.values()) {
            await transport.close();
        }
        this.transports.clear();
    }
}
