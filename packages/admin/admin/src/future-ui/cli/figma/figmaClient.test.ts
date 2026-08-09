import { afterEach, describe, expect, it, vi } from "vitest";

import { FigmaRestClient } from "./figmaClient";

afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe("FigmaRestClient", () => {
    it("retries a rate-limited request once, after the Retry-After delay, then returns the file", async () => {
        vi.useFakeTimers();
        const fetchMock = vi
            .fn<typeof fetch>()
            .mockResolvedValueOnce(new Response("", { status: 429, headers: { "Retry-After": "2" } }))
            .mockResolvedValueOnce(new Response('{"version":"42"}', { status: 200 }));
        vi.stubGlobal("fetch", fetchMock);

        const file = new FigmaRestClient({ token: "test-token", fileKey: "ABC123" }).getFile();

        // One millisecond short of the delay: without this step, an immediate retry would pass too.
        await vi.advanceTimersByTimeAsync(1999);
        expect(fetchMock).toHaveBeenCalledOnce();

        await vi.advanceTimersByTimeAsync(1);
        expect(await file).toEqual({ version: "42" });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
