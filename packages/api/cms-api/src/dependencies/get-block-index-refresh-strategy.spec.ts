import { subMinutes } from "date-fns";
import { describe, expect, it } from "vitest";

import { getBlockIndexRefreshStrategy } from "./get-block-index-refresh-strategy";

const now = new Date("2026-07-16T12:00:00.000Z");

describe("getBlockIndexRefreshStrategy", () => {
    it("refreshes synchronously when there is no prior refresh (first-time initialization)", () => {
        expect(getBlockIndexRefreshStrategy({ lastFinishedAt: null, now })).toBe("synchronous");
    });

    it("skips when the last refresh is fresh (< 5 minutes)", () => {
        expect(getBlockIndexRefreshStrategy({ lastFinishedAt: subMinutes(now, 2), now })).toBe("skip");
    });

    it("refreshes concurrently when moderately stale (5–15 minutes)", () => {
        expect(getBlockIndexRefreshStrategy({ lastFinishedAt: subMinutes(now, 10), now })).toBe("concurrent");
    });

    it("refreshes synchronously when very stale (> 15 minutes)", () => {
        expect(getBlockIndexRefreshStrategy({ lastFinishedAt: subMinutes(now, 30), now })).toBe("synchronous");
    });

    it("treats exactly 5 minutes as no longer fresh (concurrent)", () => {
        expect(getBlockIndexRefreshStrategy({ lastFinishedAt: subMinutes(now, 5), now })).toBe("concurrent");
    });

    it("treats exactly 15 minutes as very stale (synchronous)", () => {
        expect(getBlockIndexRefreshStrategy({ lastFinishedAt: subMinutes(now, 15), now })).toBe("synchronous");
    });
});
