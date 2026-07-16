import { subMinutes } from "date-fns";

export type BlockIndexRefreshStrategy = "skip" | "concurrent" | "synchronous";

// A refresh completed less than this many minutes ago is fresh enough to skip.
export const FRESH_THRESHOLD_IN_MINUTES = 5;
// A refresh completed less than this many minutes ago (but not fresh) is refreshed in the
// background; anything older is refreshed synchronously so the caller gets fresh data.
export const STALE_THRESHOLD_IN_MINUTES = 15;

/**
 * Decides how the block index materialized view should be refreshed based on the age of the last
 * completed refresh:
 * - No prior refresh: `synchronous` (first-time initialization)
 * - Fresh (< 5 minutes): `skip`
 * - Moderately stale (5–15 minutes): `concurrent` (background refresh)
 * - Very stale (> 15 minutes): `synchronous` (caller waits for fresh data)
 */
export function getBlockIndexRefreshStrategy({ lastFinishedAt, now }: { lastFinishedAt: Date | null; now: Date }): BlockIndexRefreshStrategy {
    if (!lastFinishedAt) {
        return "synchronous";
    }
    if (lastFinishedAt > subMinutes(now, FRESH_THRESHOLD_IN_MINUTES)) {
        return "skip";
    }
    if (lastFinishedAt > subMinutes(now, STALE_THRESHOLD_IN_MINUTES)) {
        return "concurrent";
    }
    return "synchronous";
}
