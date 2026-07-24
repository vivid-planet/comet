import { describe, expect, it } from "vitest";

import { describeFigmaTarget } from "./figmaTargetDescription";

function nodesResponse(document: Record<string, unknown>): unknown {
    return { nodes: { "1:1": { document } } };
}

function buttonNodesResponse(componentPropertyDefinitions: Record<string, unknown>): unknown {
    return nodesResponse({ name: "Button", componentPropertyDefinitions });
}

describe("describeFigmaTarget", () => {
    it("describes every kind of Figma property", () => {
        const nodes = buttonNodesResponse({
            Variant: { type: "VARIANT", defaultValue: "Contained", variantOptions: ["Contained", "Outlined", "Text"] },
            Purpose: { type: "VARIANT", defaultValue: "Secondary Action", variantOptions: ["Primary Action", "Secondary Action"] },
            Disabled: { type: "VARIANT", defaultValue: "No", variantOptions: ["No", "Yes"] },
            Loading: { type: "VARIANT", defaultValue: "yes", variantOptions: ["yes", "no"] },
            "Children#25:38": { type: "TEXT", defaultValue: "Button" },
            "Start Icon#39:0": { type: "INSTANCE_SWAP", defaultValue: "542:4235" },
            "Content#829:11": { type: "SLOT", defaultValue: { guid: { sessionID: -1, localID: -1 } } },
            "_Show Start Icon#25:0": { type: "BOOLEAN", defaultValue: false },
            _State: { type: "VARIANT", defaultValue: "Default", variantOptions: ["Default", "Hover"] },
        });

        expect(describeFigmaTarget(nodes, "1:1")).toStrictEqual({
            component: "Button",
            nodeId: "1:1",
            props: {
                children: { type: "string" },
                content: { type: "node" },
                disabled: { type: "boolean", default: false },
                loading: { type: "boolean", default: true },
                purpose: { type: "enum", options: ["primaryAction", "secondaryAction"], default: "secondaryAction" },
                startIcon: { type: "node" },
                variant: { type: "enum", options: ["contained", "outlined", "text"], default: "contained" },
            },
        });
    });

    it("reports figma_error when two Figma properties produce one prop name", () => {
        const nodes = buttonNodesResponse({
            "Start Icon#39:0": { type: "INSTANCE_SWAP", defaultValue: "542:4235" },
            "start icon#39:1": { type: "INSTANCE_SWAP", defaultValue: "542:4236" },
        });

        expect(() => describeFigmaTarget(nodes, "1:1")).toThrow(
            expect.objectContaining({ code: "figma_error", message: expect.stringContaining("startIcon") }),
        );
    });

    it("reports figma_error for a property type the conventions cannot map", () => {
        const nodes = buttonNodesResponse({ "Overlay#1:1": { type: "UNKNOWN_TYPE", defaultValue: "x" } });

        expect(() => describeFigmaTarget(nodes, "1:1")).toThrow(expect.objectContaining({ code: "figma_error" }));
    });

    it("reports a missing node apart from a malformed response", () => {
        expect(() => describeFigmaTarget({ nodes: {} }, "1:1")).toThrow(expect.objectContaining({ code: "node_missing" }));
        expect(() => describeFigmaTarget({ nodes: { "1:1": null } }, "1:1")).toThrow(expect.objectContaining({ code: "node_missing" }));
        expect(() => describeFigmaTarget({ nodes: { "1:1": {} } }, "1:1")).toThrow(expect.objectContaining({ code: "figma_error" }));
    });
});
