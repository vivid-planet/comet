import { BlockContext, BlockDataInterface, isBlockDataInterface } from "@comet/blocks-api";
import opentelemetry from "@opentelemetry/api";

const tracer = opentelemetry.trace.getTracer("@comet/cms-api");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function transformToPlain(block: BlockDataInterface, dependencies: any, ctx: BlockContext): Promise<any> {
    return tracer.startActiveSpan("BlockTransformer", (span) => {
        const traverse = createAsyncTraverse("transformToPlain", [dependencies, ctx], isBlockDataInterface);
        const ret = traverse(block);
        span.end();
        return ret;
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createAsyncTraverse(methodName: string, argsArray: any[], isTargetObject: (obj: any) => boolean = () => true) {
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
