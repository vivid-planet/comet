import { describe, expect, it } from "vitest";

import { sampleTree } from "../../pageTree/treemap/__tests__/treemap.test";
import { areAllSubTreesFullSelected } from "../areAllSubTreesFullSelected";

describe("areAllSubTreesFullSelected", () => {
    it("nothing selected", () => {
        expect(areAllSubTreesFullSelected([], sampleTree())).toBeTruthy();
    });

    it("everything selected", () => {
        expect(areAllSubTreesFullSelected(["1", "11", "12", "13", "2", "21", "22", "3", "31", "32", "321", "322", "33"], sampleTree())).toBeTruthy();
    });

    it("sub tree selected", () => {
        expect(areAllSubTreesFullSelected(["2", "21", "22"], sampleTree())).toBeTruthy();
        expect(areAllSubTreesFullSelected(["31", "321", "321"], sampleTree())).toBeTruthy();
    });

    it("nested leaf selected", () => {
        expect(areAllSubTreesFullSelected(["322"], sampleTree())).toBeTruthy();
        expect(areAllSubTreesFullSelected(["322", "321"], sampleTree())).toBeTruthy();
    });

    it("nested not selected", () => {
        expect(areAllSubTreesFullSelected(["1", "12"], sampleTree())).toBeFalsy();
        expect(areAllSubTreesFullSelected(["32", "321"], sampleTree())).toBeFalsy();
        expect(areAllSubTreesFullSelected(["1", "11", "12", "13", "2", "21", "22", "3", "31", "32", "322", "33"], sampleTree())).toBeFalsy();
    });
});
