import { BlockContext, BlockDataInterface, isBlockDataInterface } from "@comet/blocks-api";
import { ModuleRef } from "@nestjs/core";
import opentelemetry from "@opentelemetry/api";

const tracer = opentelemetry.trace.getTracer("@comet/cms-api");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function transformToPlain(block: BlockDataInterface, dependencies: any, ctx: BlockContext, moduleRef: ModuleRef): Promise<any> {
    return tracer.startActiveSpan("BlockTransformer", async (span) => {
        const traverse = createAsyncTraverse("transformToPlain", [dependencies, ctx], isBlockDataInterface, moduleRef);
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
            const entries = Object.entries(
                isTargetObject(jsonObj) && typeof jsonObj[methodName] === "function" ? await jsonObj[methodName](...argsArray) : jsonObj,
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedEntries = entries.map(async ([k, i]: [string, any]) => {
                const returnValue = await traverse(i);

                if (typeof returnValue === "object" && returnValue !== null && "service" in returnValue) {
                    const service = await moduleRef.get(returnValue.service, { strict: false });
                    // TODO fix context
                    return [k, await service.transformToPlain(i, argsArray[1])];
                }

                return [k, returnValue];

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any;
            return Object.fromEntries(await Promise.all(mappedEntries));
        } else {
            // keep literal as it is
            return jsonObj;
        }
    };
}
