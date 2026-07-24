import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { PropDescription } from "./componentDescription";
import { describeComponentProps } from "./propDescription";
import { createTsMorphProject } from "./tsMorphProject";

const fixturesDirectory = join(dirname(fileURLToPath(import.meta.url)), "__fixtures__");

function describeFixtureProps(propsInterfaceName: string): Record<string, PropDescription> {
    return describeComponentProps({
        project: createTsMorphProject(),
        componentFilePath: join(fixturesDirectory, "Widget.tsx"),
        propsInterfaceName,
    });
}

describe("describeComponentProps", () => {
    it("describes every kind of prop a component declares", () => {
        expect(describeFixtureProps("WidgetProps")).toStrictEqual({
            children: { type: "node" },
            count: { type: "other" },
            disabled: { type: "boolean", default: false },
            element: { type: "enum", options: ["article", "section"] },
            label: { type: "string" },
            labelPlacement: { type: "enum", options: ["top", "bottom"], default: "top" },
            loading: { type: "boolean" },
            startIcon: { type: "node" },
            variant: { type: "enum", options: ["primary", "secondary"], default: "primary" },
        });
    });

    it("reports source_incomplete instead of describing a component without props", () => {
        expect(() => describeFixtureProps("MissingProps")).toThrow(expect.objectContaining({ code: "source_incomplete" }));
    });
});
