import { traverse, type TreeMapNode } from "../TreeMapUtils";
import { sampleTree } from "./treemap.test";

describe("TreeMap traverse", () => {
    it("pre order", () => {
        const tree = sampleTree();

        let visitedItems = "";
        traverse<TreeMapNode>(
            tree,
            (element) => {
                if (visitedItems !== "") {
                    visitedItems += " -> ";
                }
                visitedItems += element.id;
            },
            "pre-order",
        );

        expect(visitedItems).toEqual("1 -> 11 -> 12 -> 13 -> 2 -> 21 -> 22 -> 3 -> 31 -> 32 -> 321 -> 322 -> 33");
    });

    it("post order", () => {
        const tree = sampleTree();

        let visitedItems = "";
        traverse<TreeMapNode>(
            tree,
            (element) => {
                if (visitedItems !== "") {
                    visitedItems += " -> ";
                }
                visitedItems += element.id;
            },
            "post-order",
        );

        expect(visitedItems).toEqual("11 -> 12 -> 13 -> 1 -> 21 -> 22 -> 2 -> 31 -> 321 -> 322 -> 32 -> 33 -> 3");
    });
});
