import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core";
import { GraphQLSchemaHost } from "@nestjs/graphql";
import {
    type GraphQLEnumType,
    type GraphQLField,
    type GraphQLInputObjectType,
    type GraphQLInputType,
    type GraphQLNamedType,
    type GraphQLOutputType,
    type GraphQLScalarType,
    isEnumType,
    isInputObjectType,
    isListType,
    isNonNullType,
    isObjectType,
    isScalarType,
} from "graphql";

import { MCP_FIELD_METADATA_KEY, MCP_TOOL_METADATA_KEY, type McpToolOptions } from "./mcp-tool.decorator";

interface JsonSchema {
    type: string;
    properties?: Record<string, JsonSchema>;
    required?: string[];
    items?: JsonSchema;
    description?: string;
    enum?: string[];
    default?: unknown;
}

interface FieldResolverRef {
    instance: Record<string, (...args: unknown[]) => unknown>;
    methodName: string;
}

/**
 * Describes how a resolver method parameter maps to GraphQL arguments.
 * - Named args (`@Args("name")`) extract a single named argument.
 * - Unnamed args (`@Args()`) receive all arguments merged as an object.
 */
interface ParamMapping {
    index: number;
    type: "named" | "args-object";
    name?: string; // only for "named" type
}

export interface McpToolDefinition {
    name: string;
    description: string;
    inputSchema: JsonSchema;
    operationType: "query" | "mutation";
    graphqlFieldName: string;
    /** Reference to the resolver instance and method for direct invocation */
    resolverRef: {
        instance: Record<string, (...args: unknown[]) => unknown>;
        methodName: string;
    };
    /** Describes how to map MCP input args to resolver method parameters */
    paramMappings: ParamMapping[];
    /** The return type info for building the response */
    returnTypeName: string | undefined;
}

// NestJS stores parameter metadata under this key
const PARAM_ARGS_METADATA = "__routeArguments__";

// NestJS GraphQL param types
const GQL_PARAMTYPE_ARGS = 3;

@Injectable()
export class McpToolDiscoveryService implements OnModuleInit {
    private readonly logger = new Logger(McpToolDiscoveryService.name);
    private tools: McpToolDefinition[] = [];
    private fieldResolverMethods = new Set<string>(); // "TypeName.fieldName"
    private mcpFieldMethods = new Set<string>(); // "TypeName.fieldName" - field resolvers with @McpField
    private fieldResolverRefs = new Map<string, FieldResolverRef>(); // "TypeName.fieldName" -> resolver ref

    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
        private readonly reflector: Reflector,
        private readonly schemaHost: GraphQLSchemaHost,
    ) {}

    onModuleInit(): void {
        this.discoverFieldResolvers();
        this.discoverTools();
    }

    getTools(): McpToolDefinition[] {
        return this.tools;
    }

    private discoverFieldResolvers(): void {
        const providers = this.discoveryService.getProviders();

        for (const wrapper of providers) {
            const instance = wrapper.instance;
            if (!instance || typeof instance !== "object") {
                continue;
            }

            const prototype = Object.getPrototypeOf(instance);
            if (!prototype) {
                continue;
            }

            const resolverType = Reflect.getMetadata("graphql:resolver_type", instance.constructor);
            if (!resolverType) {
                continue;
            }

            const typeName = typeof resolverType === "function" ? resolverType.name : String(resolverType);

            const methodNames = this.metadataScanner.getAllMethodNames(prototype);
            for (const methodName of methodNames) {
                const method = prototype[methodName];
                if (!method) {
                    continue;
                }

                const isFieldResolver = Reflect.getMetadata("graphql:resolve_property", method);
                if (!isFieldResolver) {
                    continue;
                }

                const resolverName: string = Reflect.getMetadata("graphql:resolver_name", method) || methodName;
                const key = `${typeName}.${resolverName}`;
                this.fieldResolverMethods.add(key);

                this.fieldResolverRefs.set(key, {
                    instance: instance as Record<string, (...args: unknown[]) => unknown>,
                    methodName,
                });

                const mcpFieldMeta = this.reflector.get(MCP_FIELD_METADATA_KEY, method);
                if (mcpFieldMeta !== undefined) {
                    this.mcpFieldMethods.add(key);
                }
            }
        }

        this.logger.log(`Discovered ${this.fieldResolverMethods.size} field resolvers, ${this.mcpFieldMethods.size} with @McpField`);
    }

    /**
     * Extract the parameter mappings from NestJS's @Args() metadata.
     * This tells us how to map flat GraphQL arguments to the resolver method's parameters.
     */
    private extractParamMappings(resolverInstance: object, methodName: string): ParamMapping[] {
        const metadata: Record<string, { index: number; data: string | undefined }> =
            Reflect.getMetadata(PARAM_ARGS_METADATA, resolverInstance.constructor, methodName) || {};

        const mappings: ParamMapping[] = [];

        for (const [key, value] of Object.entries(metadata)) {
            // Key format is "paramType:index", e.g. "3:0" for @Args at index 0
            const [paramTypeStr] = key.split(":");
            const paramType = parseInt(paramTypeStr, 10);

            if (paramType === GQL_PARAMTYPE_ARGS) {
                if (value.data) {
                    // Named arg: @Args("name")
                    mappings.push({ index: value.index, type: "named", name: value.data });
                } else {
                    // Unnamed args: @Args() - receives all args as object
                    mappings.push({ index: value.index, type: "args-object" });
                }
            }
        }

        // Sort by parameter index
        mappings.sort((a, b) => a.index - b.index);
        return mappings;
    }

    private discoverTools(): void {
        const providers = this.discoveryService.getProviders();
        const schema = this.schemaHost.schema;

        for (const wrapper of providers) {
            const instance = wrapper.instance;
            if (!instance || typeof instance !== "object") {
                continue;
            }

            const prototype = Object.getPrototypeOf(instance);
            if (!prototype) {
                continue;
            }

            const methodNames = this.metadataScanner.getAllMethodNames(prototype);
            for (const methodName of methodNames) {
                const method = prototype[methodName];
                if (!method) {
                    continue;
                }

                const mcpMeta: McpToolOptions | undefined = this.reflector.get(MCP_TOOL_METADATA_KEY, method);
                if (!mcpMeta) {
                    continue;
                }

                const resolverTypeMetadata = Reflect.getMetadata("graphql:resolver_type", method);
                let operationType: "query" | "mutation" | undefined;

                if (resolverTypeMetadata === "Query") {
                    operationType = "query";
                } else if (resolverTypeMetadata === "Mutation") {
                    operationType = "mutation";
                }

                if (!operationType) {
                    this.logger.warn(`@McpTool on ${methodName} but it's not a @Query or @Mutation - skipping`);
                    continue;
                }

                const graphqlFieldName: string = Reflect.getMetadata("graphql:resolver_name", method) || methodName;
                const toolName = mcpMeta.name ?? graphqlFieldName;

                const rootType = operationType === "query" ? schema.getQueryType() : schema.getMutationType();
                if (!rootType) {
                    continue;
                }

                const field = rootType.getFields()[graphqlFieldName];
                if (!field) {
                    this.logger.warn(`GraphQL field "${graphqlFieldName}" not found in ${operationType} type - skipping`);
                    continue;
                }

                const inputSchema = this.buildInputSchema(field);
                const returnType = this.unwrapType(field.type);
                const paramMappings = this.extractParamMappings(instance, methodName);

                this.tools.push({
                    name: toolName,
                    description: mcpMeta.description,
                    inputSchema,
                    operationType,
                    graphqlFieldName,
                    resolverRef: {
                        instance: instance as Record<string, (...args: unknown[]) => unknown>,
                        methodName,
                    },
                    paramMappings,
                    returnTypeName: isObjectType(returnType) ? returnType.name : undefined,
                });
            }
        }

        this.logger.log(`Registered ${this.tools.length} MCP tools`);
    }

    /**
     * Execute a tool by directly calling the resolver method.
     * Maps the flat MCP arguments to the resolver's parameter format using the extracted parameter mappings.
     */
    async executeTool(tool: McpToolDefinition, args: Record<string, unknown>): Promise<unknown> {
        const { instance, methodName } = tool.resolverRef;

        // Build the arguments array based on the param mappings
        const resolverArgs: unknown[] = [];
        for (const mapping of tool.paramMappings) {
            if (mapping.type === "named" && mapping.name) {
                resolverArgs[mapping.index] = args[mapping.name];
            } else if (mapping.type === "args-object") {
                // Pass all args as an object (for @Args() without a name)
                resolverArgs[mapping.index] = args;
            }
        }

        const result = await instance[methodName](...resolverArgs);

        // Resolve any @McpField field resolvers on the result
        if (result !== null && result !== undefined && tool.returnTypeName) {
            return this.resolveFields(result, tool.returnTypeName);
        }

        return result;
    }

    private async resolveFields(entity: unknown, typeName: string): Promise<unknown> {
        if (entity === null || entity === undefined) {
            return entity;
        }
        if (typeof entity !== "object") {
            return entity;
        }

        if (Array.isArray(entity)) {
            return Promise.all(entity.map((item) => this.resolveFields(item, typeName)));
        }

        const entityObj = entity as Record<string, unknown>;
        const schema = this.schemaHost.schema;
        const gqlType = schema.getType(typeName);

        if (!gqlType || !isObjectType(gqlType)) {
            return entity;
        }

        const fields = gqlType.getFields();
        const result: Record<string, unknown> = {};

        for (const [fieldName, field] of Object.entries(fields)) {
            const key = `${typeName}.${fieldName}`;
            const unwrapped = this.unwrapType(field.type);

            if (this.fieldResolverMethods.has(key)) {
                if (this.mcpFieldMethods.has(key)) {
                    const ref = this.fieldResolverRefs.get(key);
                    if (ref) {
                        try {
                            const resolved = await ref.instance[ref.methodName](entity);
                            if (isObjectType(unwrapped)) {
                                result[fieldName] = await this.resolveFields(resolved, unwrapped.name);
                            } else {
                                result[fieldName] = resolved;
                            }
                        } catch (error) {
                            this.logger.warn(`Failed to resolve field ${key}: ${error instanceof Error ? error.message : String(error)}`);
                        }
                    }
                }
                // else: skip - field resolver without @McpField
            } else if (fieldName in entityObj) {
                const value = entityObj[fieldName];
                if (isObjectType(unwrapped) && value !== null && value !== undefined) {
                    result[fieldName] = await this.resolveFields(value, unwrapped.name);
                } else {
                    result[fieldName] = value;
                }
            }
        }

        return result;
    }

    private buildInputSchema(field: GraphQLField<unknown, unknown>): JsonSchema {
        const properties: Record<string, JsonSchema> = {};
        const required: string[] = [];

        for (const arg of field.args) {
            const argSchema = this.graphqlInputTypeToJsonSchema(arg.type);
            if (arg.description) {
                argSchema.description = arg.description;
            }
            if (arg.defaultValue !== undefined) {
                argSchema.default = arg.defaultValue;
            }
            properties[arg.name] = argSchema;

            if (isNonNullType(arg.type) && arg.defaultValue === undefined) {
                required.push(arg.name);
            }
        }

        const schema: JsonSchema = {
            type: "object",
            properties,
        };
        if (required.length > 0) {
            schema.required = required;
        }
        return schema;
    }

    private graphqlInputTypeToJsonSchema(type: GraphQLInputType): JsonSchema {
        if (isNonNullType(type)) {
            return this.graphqlInputTypeToJsonSchema(type.ofType);
        }

        if (isListType(type)) {
            return {
                type: "array",
                items: this.graphqlInputTypeToJsonSchema(type.ofType),
            };
        }

        if (isScalarType(type)) {
            return this.scalarToJsonSchema(type);
        }

        if (isEnumType(type)) {
            return this.enumToJsonSchema(type);
        }

        if (isInputObjectType(type)) {
            return this.inputObjectToJsonSchema(type);
        }

        return { type: "object" };
    }

    private scalarToJsonSchema(type: GraphQLScalarType): JsonSchema {
        switch (type.name) {
            case "String":
            case "ID":
            case "DateTime":
            case "Date":
            case "Time":
            case "UUID":
                return { type: "string" };
            case "Int":
                return { type: "integer" };
            case "Float":
                return { type: "number" };
            case "Boolean":
                return { type: "boolean" };
            case "JSON":
            case "JSONObject":
                return { type: "object" };
            default:
                return { type: "object", description: `GraphQL scalar: ${type.name}` };
        }
    }

    private enumToJsonSchema(type: GraphQLEnumType): JsonSchema {
        return {
            type: "string",
            enum: type.getValues().map((v) => v.value),
            description: type.description ?? undefined,
        };
    }

    private inputObjectToJsonSchema(type: GraphQLInputObjectType): JsonSchema {
        const fields = type.getFields();
        const properties: Record<string, JsonSchema> = {};
        const required: string[] = [];

        for (const [fieldName, field] of Object.entries(fields)) {
            const fieldSchema = this.graphqlInputTypeToJsonSchema(field.type);
            if (field.description) {
                fieldSchema.description = field.description;
            }
            if (field.defaultValue !== undefined) {
                fieldSchema.default = field.defaultValue;
            }
            properties[fieldName] = fieldSchema;

            if (isNonNullType(field.type) && field.defaultValue === undefined) {
                required.push(fieldName);
            }
        }

        const schema: JsonSchema = {
            type: "object",
            properties,
            description: type.description ?? undefined,
        };
        if (required.length > 0) {
            schema.required = required;
        }
        return schema;
    }

    private unwrapType(type: GraphQLOutputType | GraphQLInputType): GraphQLNamedType {
        let current = type;
        while (isNonNullType(current) || isListType(current)) {
            current = current.ofType as GraphQLOutputType;
        }
        return current as GraphQLNamedType;
    }
}
