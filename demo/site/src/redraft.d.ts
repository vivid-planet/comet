declare module "redraft" {
    interface InlineStylesMap {
        [key: string]: (children: React.ReactNode, options: { key: string }) => React.ReactNode;
    }

    export type TextBlockRenderFn = (children: React.ReactNode[], options: { key: string; depth: number; keys: string[] }) => React.ReactNode;
    interface BlockMap {
        [key: string]: TextBlockRenderFn;
    }

    interface EntityMap {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: (children: React.ReactNode, data: any, options: { key: string }) => React.ReactNode;
    }

    export interface Renderers {
        inline?: InlineStylesMap;
        blocks?: BlockMap;
        entities?: EntityMap;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
    const redraft = (raw: any, renderers: Renderers): React.ReactElement<any, any> | null => {};

    export default redraft;
}
