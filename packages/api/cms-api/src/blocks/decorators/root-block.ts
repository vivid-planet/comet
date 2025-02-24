import { type Block } from "../block";

export function RootBlock(block: Block): PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, propertyKey: string | symbol) {
        Reflect.defineMetadata(`data:rootBlock`, block, target, propertyKey);

        const propertyKeys = Reflect.getOwnMetadata(`keys:rootBlock`, target) || (Reflect.getMetadata(`keys:rootBlock`, target) || []).slice(0);
        propertyKeys.push(propertyKey);
        Reflect.defineMetadata(`keys:rootBlock`, propertyKeys, target);
    };
}
