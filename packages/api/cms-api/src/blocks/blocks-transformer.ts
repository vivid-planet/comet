import {
    BlockContext,
    BlockDataInterface,
    BlockTransformerServiceInterface,
    isBlockDataInterface,
    TraversableTransformResponse,
} from "@comet/blocks-api";
import { Scope, Type } from "@nestjs/common";
import { INJECTABLE_WATERMARK } from "@nestjs/common/constants";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";
import opentelemetry from "@opentelemetry/api";

const tracer = opentelemetry.trace.getTracer("@comet/cms-api");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function transformToPlain(block: BlockDataInterface, blockContext: BlockContext, moduleRef: ModuleRef, context: any): Promise<unknown> {
    return tracer.startActiveSpan("BlockTransformer", async (span) => {
        async function traverse(json: unknown): Promise<unknown> {
            if (Array.isArray(json)) {
                return Promise.all(json.map(traverse));
            } else if (typeof json === "object" && json !== null) {
                let entries: [string, unknown][];

                if (isBlockDataInterface(json)) {
                    const transformResponse = await json.transformToPlain(blockContext);

                    if (isBlockTransformerService(transformResponse)) {
                        let service: BlockTransformerServiceInterface;

                        if (moduleRef.introspect(transformResponse).scope === Scope.DEFAULT) {
                            service = moduleRef.get(transformResponse, { strict: false });
                        } else {
                            service = await moduleRef.resolve(transformResponse, ContextIdFactory.getByRequest(context), { strict: false });
                        }

                        entries = Object.entries(await service.transformToPlain(json, blockContext));
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
