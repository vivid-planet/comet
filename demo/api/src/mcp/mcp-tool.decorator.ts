import { SetMetadata } from "@nestjs/common";

export const MCP_TOOL_METADATA_KEY = "mcp:tool";
export const MCP_FIELD_METADATA_KEY = "mcp:field";

export interface McpToolOptions {
    /** Description of the tool shown to the LLM */
    description: string;
    /** Optional: override the tool name (defaults to the GraphQL field name) */
    name?: string;
}

export interface McpFieldOptions {
    /** Description hint for including this field-resolver field in MCP output */
    description?: string;
}

/**
 * Decorator to expose a GraphQL Query or Mutation as an MCP tool.
 * Apply to a method decorated with @Query() or @Mutation().
 */
export const McpTool = (options: McpToolOptions): MethodDecorator => SetMetadata(MCP_TOOL_METADATA_KEY, options);

/**
 * Decorator to include a field-resolver field in MCP tool output.
 * By default, fields with a @ResolveField() are excluded from MCP output.
 * Apply this decorator to the @ResolveField() method to include it.
 */
export const McpField = (options?: McpFieldOptions): MethodDecorator => SetMetadata(MCP_FIELD_METADATA_KEY, options ?? {});
