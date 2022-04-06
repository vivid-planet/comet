import { PageTreeNodeInterface } from "../types";
import pathBuilder from "./path-builder";

export class InMemoryPathResolver {
    private dict: Map<string, PageTreeNodeInterface> = new Map();

    constructor(nodes: PageTreeNodeInterface[]) {
        this.dict = new Map(nodes.map((c) => [c.id, c]));
    }

    public resolve(nodeId: string): string | undefined {
        const node = this.dict.get(nodeId);
        if (!node) {
            return;
        }
        let parentNode = node;
        const slugs = [node.slug];
        while (parentNode.parentId) {
            const currentParentNode = this.dict.get(parentNode.parentId);

            // our dictionary might not be complete, we fail building the full path and give up
            if (!currentParentNode) {
                return;
            }
            parentNode = currentParentNode;
            slugs.push(parentNode.slug);
        }

        return pathBuilder(slugs);
    }
}
