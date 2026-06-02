import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

import { registerBlockMetaResource } from "./resources/blockMeta/blockMeta";
import { registerBlockTypesResource } from "./resources/blockTypes/blockTypes";
import { registerCheckSlugAvailability } from "./tools/checkSlugAvailability/checkSlugAvailability";
import { registerCreatePageTreeNode } from "./tools/createPageTreeNode/createPageTreeNode";
import { registerDeletePageTreeNode } from "./tools/deletePageTreeNode/deletePageTreeNode";
import { registerGetDamFile } from "./tools/getDamFile/getDamFile";
import { registerGetPage } from "./tools/getPage/getPage";
import { registerGetPageTreeNode } from "./tools/getPageTreeNode/getPageTreeNode";
import { registerGetPageTreeNodeByPath } from "./tools/getPageTreeNodeByPath/getPageTreeNodeByPath";
import { registerListDamFiles } from "./tools/listDamFiles/listDamFiles";
import { registerListPageTreeNodes } from "./tools/listPageTreeNodes/listPageTreeNodes";
import { registerSavePage } from "./tools/savePage/savePage";
import { registerUpdatePageTreeNode } from "./tools/updatePageTreeNode/updatePageTreeNode";
import { registerUpdatePageTreeNodeVisibility } from "./tools/updatePageTreeNodeVisibility/updatePageTreeNodeVisibility";

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

function createMcpServer(): McpServer {
    const server = new McpServer({
        name: "comet-demo",
        version: "1.0.0",
    });

    // -----------------------------------------------------------------------
    // Tools
    // -----------------------------------------------------------------------

    registerListPageTreeNodes(server);
    registerGetPageTreeNode(server);
    registerGetPageTreeNodeByPath(server);
    registerGetPage(server);
    registerCheckSlugAvailability(server);
    registerCreatePageTreeNode(server);
    registerUpdatePageTreeNode(server);
    registerSavePage(server);
    registerUpdatePageTreeNodeVisibility(server);
    registerListDamFiles(server);
    registerGetDamFile(server);
    registerDeletePageTreeNode(server);

    // -----------------------------------------------------------------------
    // Resources
    // -----------------------------------------------------------------------

    registerBlockMetaResource(server);
    registerBlockTypesResource(server);

    return server;
}

// ---------------------------------------------------------------------------
// Start server (Streamable HTTP transport)
// ---------------------------------------------------------------------------

const PORT = Number(process.env.PORT ?? 3001);
const MCP_ENDPOINT = "/mcp";

// Map of session ID -> transport, so requests for an established session are
// routed to the transport that owns its MCP server instance.
const transports: Record<string, StreamableHTTPServerTransport> = {};

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    return raw.length > 0 ? JSON.parse(raw) : undefined;
}

// Handles client-to-server requests (initialization and tool/resource calls).
async function handlePost(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    const body = await readJsonBody(req);

    let transport: StreamableHTTPServerTransport;
    if (sessionId && transports[sessionId]) {
        // Reuse the transport for an existing session.
        transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(body)) {
        // New initialization request: create a transport and MCP server instance.
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (newSessionId) => {
                transports[newSessionId] = transport;
            },
        });

        transport.onclose = () => {
            if (transport.sessionId) {
                delete transports[transport.sessionId];
            }
        };

        const server = createMcpServer();
        await server.connect(transport);
    } else {
        // Invalid request: no session ID and not an initialization request.
        sendJson(res, 400, {
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Bad Request: No valid session ID provided",
            },
            id: null,
        });
        return;
    }

    await transport.handleRequest(req, res, body);
}

// Handles server-to-client notifications (GET, via SSE) and session teardown (DELETE).
async function handleSessionRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid or missing session ID");
        return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
}

const httpServer = createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (url.pathname !== MCP_ENDPOINT) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
    }

    const handler = req.method === "POST" ? handlePost : req.method === "GET" || req.method === "DELETE" ? handleSessionRequest : undefined;

    if (!handler) {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method Not Allowed");
        return;
    }

    handler(req, res).catch((error) => {
        console.error("Error handling MCP request:", error);
        if (!res.headersSent) {
            sendJson(res, 500, {
                jsonrpc: "2.0",
                error: { code: -32603, message: "Internal server error" },
                id: null,
            });
        }
    });
});

httpServer.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Comet Demo MCP server listening on http://localhost:${PORT}${MCP_ENDPOINT}`);
});
