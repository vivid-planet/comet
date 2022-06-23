import { rewriteInternalLinks } from "./rewriteInternalLinks";

describe("rewriteInternalLinks", () => {
    it("rewrites links to known internal pages", () => {
        const idsMap = new Map<string, string>([
            ["old-1", "new-1"],
            ["old-2", "new-2"],
            ["old-3", "new-3"],
        ]);

        const output = {
            blocks: [
                { type: "internal", props: { targetPageId: "old-1" } },
                { type: "internal", props: { targetPageId: "old-2" } },
                { type: "internal", props: { targetPageId: "old-3" } },
            ],
        };

        expect(rewriteInternalLinks(output, idsMap)).toEqual({
            blocks: [
                { type: "internal", props: { targetPageId: "new-1" } },
                { type: "internal", props: { targetPageId: "new-2" } },
                { type: "internal", props: { targetPageId: "new-3" } },
            ],
        });
    });

    it("ignores links to unknown internal pages", () => {
        const idsMap = new Map<string, string>([
            ["old-1", "new-1"],
            ["old-2", "new-2"],
            ["old-3", "new-3"],
        ]);

        const output = {
            blocks: [
                { type: "internal", props: { targetPageId: "old-1" } },
                { type: "internal", props: { targetPageId: "old-2" } },
                { type: "internal", props: { targetPageId: "unknown" } },
            ],
        };

        expect(rewriteInternalLinks(output, idsMap)).toEqual({
            blocks: [
                { type: "internal", props: { targetPageId: "new-1" } },
                { type: "internal", props: { targetPageId: "new-2" } },
                { type: "internal", props: { targetPageId: "unknown" } },
            ],
        });
    });
});
