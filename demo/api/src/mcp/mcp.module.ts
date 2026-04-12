import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";

import { McpController } from "./mcp.controller";
import { McpToolDiscoveryService } from "./mcp-tool-discovery.service";

@Module({
    imports: [DiscoveryModule],
    controllers: [McpController],
    providers: [McpToolDiscoveryService],
    exports: [McpToolDiscoveryService],
})
export class McpModule {}
