import { describe, expect, it, vi } from "vitest";

import { type FigmaFetch, type FigmaResponse, FigmaRestClient } from "./figmaClient";

function figmaResponse({ status, body, headers = {} }: { status: number; body: string; headers?: Record<string, string> }): FigmaResponse {
    return {
        ok: status >= 200 && status < 300,
        status,
        headers: { get: (name) => headers[name] ?? null },
        text: async () => body,
    };
}

/** A fetch stub that returns the queued responses in order and records each call. */
function queuedFetch(responses: FigmaResponse[]): { fetch: FigmaFetch; urls: string[] } {
    const urls: string[] = [];
    const remaining = [...responses];
    const fetch: FigmaFetch = async (url) => {
        urls.push(url);
        const next = remaining.shift();
        if (!next) {
            throw new Error("fetch called more times than expected");
        }
        return next;
    };
    return { fetch, urls };
}

describe("FigmaRestClient", () => {
    it("retries once honoring Retry-After after a 429, then succeeds", async () => {
        const { fetch, urls } = queuedFetch([
            figmaResponse({ status: 429, body: "", headers: { "Retry-After": "2" } }),
            figmaResponse({ status: 200, body: '{"version":"42"}' }),
        ]);
        const wait = vi.fn(async () => {});
        const client = new FigmaRestClient({ token: "test-token", fileKey: "ABC123", fetch, wait });

        expect(await client.getFile()).toEqual({ version: "42" });
        expect(urls).toHaveLength(2);
        expect(wait).toHaveBeenCalledWith(2000);
    });
});
