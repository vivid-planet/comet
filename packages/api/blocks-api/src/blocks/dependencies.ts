export interface PageTreeNodeInterface {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
}
export interface PageTreeApi {
    getNode: (nodeId: string) => Promise<PageTreeNodeInterface | null>;
    getNodePath: (node: PageTreeNodeInterface) => Promise<string>;
}

export type TransformDependencies = {
    pageTreeApi?: PageTreeApi;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, any>;
