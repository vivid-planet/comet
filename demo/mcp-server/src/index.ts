import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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

const server = new McpServer({
    name: "comet-demo",
    version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

registerBlockMetaResource(server);
registerBlockTypesResource(server);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
