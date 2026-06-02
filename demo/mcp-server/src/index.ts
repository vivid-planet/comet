import { randomUUID } from "node:crypto";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import express from "express";

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

const app = express();
app.use(express.json());

// Map of session ID -> transport, so requests for an established session are
// routed to the transport that owns its MCP server instance.
const transports: Record<string, StreamableHTTPServerTransport> = {};

// Handles client-to-server requests (initialization and tool/resource calls).
app.post(MCP_ENDPOINT, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    let transport: StreamableHTTPServerTransport;
    if (sessionId && transports[sessionId]) {
        // Reuse the transport for an existing session.
        transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
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
        res.status(400).json({
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Bad Request: No valid session ID provided",
            },
            id: null,
        });
        return;
    }

    await transport.handleRequest(req, res, req.body);
});

// Handles server-to-client notifications (GET, via SSE) and session teardown (DELETE).
const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
        res.status(400).send("Invalid or missing session ID");
        return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
};

app.get(MCP_ENDPOINT, handleSessionRequest);
app.delete(MCP_ENDPOINT, handleSessionRequest);

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Comet Demo MCP server listening on http://localhost:${PORT}${MCP_ENDPOINT}`);
});
