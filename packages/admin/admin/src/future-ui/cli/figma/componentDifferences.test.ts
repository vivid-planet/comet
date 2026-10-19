import { describe, expect, it } from "vitest";

import { compareProps, findImplementedComponentDifferences } from "./componentDifferences";

describe("compareProps", () => {
    it("accepts a ReactNode prop for a Figma text property, but not a string prop for a Figma node property", () => {
        const differences = compareProps(
            { children: { type: "string" }, startIcon: { type: "node" } },
            { children: { type: "node" }, startIcon: { type: "string" } },
        );

        expect(differences).toStrictEqual([{ kind: "CHANGED_TYPE", prop: "startIcon", figmaType: "node", codeType: "string" }]);
    });
});

describe("findImplementedComponentDifferences", () => {
    it("reports a component whose story has no node id as UNLINKED_COMPONENT when a Figma component has the same name, ignoring spaces", () => {
        const differences = findImplementedComponentDifferences({
            implemented: { component: "IconButton", props: {} },
            inventory: [{ name: "Icon Button", nodeId: "702:2354" }],
            targetsByNodeId: new Map(),
        });

        expect(differences).toStrictEqual([{ kind: "UNLINKED_COMPONENT", figmaName: "Icon Button", nodeId: "702:2354" }]);
    });
});
