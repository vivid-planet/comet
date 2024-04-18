import {
    BlockContext,
    BlockDataInterface,
    BlockTransformerServiceInterface,
    isBlockDataInterface,
    TraversableTransformResponse,
} from "@comet/blocks-api";
import { Type } from "@nestjs/common";
import { INJECTABLE_WATERMARK } from "@nestjs/common/constants";
import { ModuleRef } from "@nestjs/core";
import opentelemetry from "@opentelemetry/api";

const tracer = opentelemetry.trace.getTracer("@comet/cms-api");

export async function transformToPlain(block: BlockDataInterface, context: BlockContext, moduleRef: ModuleRef): Promise<unknown> {
    return tracer.startActiveSpan("BlockTransformer", async (span) => {
        async function traverse(json: unknown): Promise<unknown> {
            if (Array.isArray(json)) {
                return Promise.all(json.map(traverse));
            } else if (typeof json === "object" && json !== null) {
                let entries: [string, unknown][];

                if (isBlockDataInterface(json)) {
                    const transformResponse = await json.transformToPlain(context);

                    if (isBlockTransformerService(transformResponse)) {
                        // TODO Support transient or request-scoped services using moduleRef.resolve?
                        const service = moduleRef.get(transformResponse, { strict: false });
                        entries = Object.entries(await service.transformToPlain(json, context));
                    } else {
                        entries = Object.entries(transformResponse);
                    }
                } else {
                    entries = Object.entries(json);
                }

                return Object.fromEntries(await Promise.all(entries.map(async ([key, value]: [string, unknown]) => [key, await traverse(value)])));
            } else {
                // Keep literal as it is
                return json;
            }
        }

        const result = await traverse(block);
        span.end();
        return result;
    });
}

function isBlockTransformerService(
    transformResponse: Type<BlockTransformerServiceInterface> | TraversableTransformResponse,
): transformResponse is Type<BlockTransformerServiceInterface> {
    return Reflect.hasMetadata(INJECTABLE_WATERMARK, transformResponse);
}
