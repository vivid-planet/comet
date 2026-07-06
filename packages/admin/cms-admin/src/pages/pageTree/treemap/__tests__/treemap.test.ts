import { describe, expect, it } from "vitest";

import { subTreeFromNodes, TreeMap, type TreeMapNode } from "../TreeMapUtils";

export const sampleTree = (): TreeMap<TreeMapNode> => {
    /*
     * Sample Tree
     *    - 1
     *        - 11
     *        - 12
     *        - 13
     *    - 2
     *        - 21
     *        - 22
     *    - 3
     *        - 31
     *        - 32
     *            - 321
     *            - 322
     *        - 33
     * */

    const treemap = new TreeMap<TreeMapNode>();
    treemap.set("root", [
        { id: "1", parentId: "root" },
        { id: "2", parentId: "root" },
        { id: "3", parentId: "root" },
    ]);

    treemap.set("1", [
        { id: "11", parentId: "1" },
        { id: "12", parentId: "1" },
        { id: "13", parentId: "1" },
    ]);
    treemap.set("2", [
        { id: "21", parentId: "2" },
        { id: "22", parentId: "2" },
    ]);

    treemap.set("3", [
        { id: "31", parentId: "3" },
        { id: "32", parentId: "3" },
        { id: "33", parentId: "3" },
    ]);

    treemap.set("32", [
        { id: "321", parentId: "32" },
        { id: "322", parentId: "32" },
    ]);

    return treemap;
};

describe("TreeMapUtils", () => {
    it("subTreeFromNodes  - empty", () => {
        const tree = sampleTree();
        const subtree = subTreeFromNodes([], tree);

        expect(subtree.size).toEqual(0);
    });

    it("subTreeFromNodes  - first level", () => {
        /* expect subtree:
                  - 1
                  - 2
        */
        const tree = sampleTree();
        const subtree = subTreeFromNodes(["1", "2"], tree);

        expect(subtree.size).toEqual(1);
        const root = subtree.get("root");
        expect(root).toBeDefined();
        expect(root?.length).toEqual(2);

        expect(root?.[0]).toEqual({ id: "1", parentId: "root" });
        expect(root?.[1]).toEqual({ id: "2", parentId: "root" });
    });

    it("subTreeFromNodes - nested levels", () => {
        /* expect subtree:
                    - 11
                    - 2
                        - 21
                    - 3
                        - 321
        */

        const tree = sampleTree();
        const subtree = subTreeFromNodes(["11", "2", "21", "3", "321"], tree);

        expect(subtree.size).toEqual(3);
        const root = subtree.get("root");
        expect(root).toBeDefined();
        expect(root?.length).toEqual(3);
        expect(root?.[0]).toEqual({ id: "11", parentId: "root" });
        expect(root?.[1]).toEqual({ id: "2", parentId: "root" });
        expect(root?.[2]).toEqual({ id: "3", parentId: "root" });

        const node2 = subtree.get("2");
        expect(node2).toBeDefined();
        expect(node2?.length).toEqual(1);
        expect(node2?.[0]).toEqual({ id: "21", parentId: "2" });

        const node3 = subtree.get("3");
        expect(node3).toBeDefined();
        expect(node3?.length).toEqual(1);
        expect(node3?.[0]).toEqual({ id: "321", parentId: "3" });
    });
});
