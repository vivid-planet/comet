import { BlockContext, BlockDataInterface, isBlockDataInterface } from "@comet/blocks-api";
import { INJECTABLE_WATERMARK } from "@nestjs/common/constants";
import { ModuleRef } from "@nestjs/core";
import opentelemetry from "@opentelemetry/api";

const tracer = opentelemetry.trace.getTracer("@comet/cms-api");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function transformToPlain(block: BlockDataInterface, ctx: BlockContext, moduleRef: ModuleRef): Promise<any> {
    return tracer.startActiveSpan("BlockTransformer", async (span) => {
        const traverse = createAsyncTraverse("transformToPlain", [ctx], isBlockDataInterface, moduleRef);
        // TODO is await correct here?
        const ret = await traverse(block);
        span.end();
        return ret;
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createAsyncTraverse(methodName: string, argsArray: any[], isTargetObject: (obj: any) => boolean = () => true, moduleRef: ModuleRef) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function traverse(jsonObj: any): Promise<any> {
        if (Array.isArray(jsonObj)) {
            return Promise.all(jsonObj.map(traverse));
        } else if (jsonObj !== null && typeof jsonObj === "object") {
            let entries: [string, unknown][];

            if (isTargetObject(jsonObj) && typeof jsonObj[methodName] === "function") {
                const methodResponse = await jsonObj[methodName](...argsArray);

                const isService = Reflect.hasMetadata(INJECTABLE_WATERMARK, methodResponse);

                if (isService) {
                    // TODO Support transient or request-scoped services using moduleRef.resolve?
                    const service = await moduleRef.get(methodResponse, { strict: false });
                    entries = Object.entries(await service.transformToPlain(jsonObj, argsArray[0]));
                } else {
                    entries = Object.entries(methodResponse);
                }
            } else {
                entries = Object.entries(jsonObj);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedEntries = entries.map(async ([k, i]: [string, any]) => {
                return [k, await traverse(i)];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any;
            return Object.fromEntries(await Promise.all(mappedEntries));
        } else {
            // keep literal as it is
            return jsonObj;
        }
    };
}
