/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "redraft" {
    interface InlineStylesMap {
        [key: string]: (children: React.ReactNode, options: { key: string }) => React.ReactNode;
    }

    interface BlockMap {
        [key: string]: (children: React.ReactNode[], options: { key: string; depth: number; keys: string[] }) => React.ReactNode;
    }

    interface EntityMap {
        [key: string]: (children: React.ReactNode, data: P, options: { key: string }) => React.ReactNode;
    }

    export interface Renderers {
        inline?: InlineStylesMap;
        blocks?: BlockMap;
        entities?: EntityMap;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
    const redraft = (raw: any, renderers: Renderers): React.ReactElement<any, any> | null => {};

    export default redraft;
}
