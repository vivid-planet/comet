/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFetchWithDefaultNextRevalidate } from "./graphQLFetch";

describe("createFetchWithDefaultNextRevalidate", () => {
    it("applies default revalidate when cache is not set", async () => {
        const mockFetch = jest.fn(async (_input, init) => {
            return { ok: true, status: 200, init } as Response & { init: RequestInit };
        });
        const fetch = createFetchWithDefaultNextRevalidate(mockFetch, 42);
        await fetch("/test");
        expect(mockFetch).toHaveBeenCalledWith(
            "/test",
            expect.objectContaining({
                next: expect.objectContaining({ revalidate: 42 }),
            }),
        );
    });

    it("applies default revalidate when cache is not disallowed and next.revalidate is undefined", async () => {
        const mockFetch = jest.fn(async (_input, init) => {
            // Minimal Response-like mock
            return { ok: true, status: 200, init } as Response & { init: any };
        });
        const fetch = createFetchWithDefaultNextRevalidate(mockFetch, 42);
        await fetch("/test", { cache: "default" });
        expect(mockFetch).toHaveBeenCalledWith(
            "/test",
            expect.objectContaining({
                next: expect.objectContaining({ revalidate: 42 }),
            }),
        );
    });

    it("does not apply revalidate if cache is disallowed", async () => {
        const mockFetch = jest.fn(async (_input, init) => {
            return { ok: true, status: 200, init } as Response & { init: any };
        });
        const fetch = createFetchWithDefaultNextRevalidate(mockFetch, 42);
        for (const cache of ["no-store", "no-cache", "only-if-cached", "reload"]) {
            await fetch("/test", { cache: cache as RequestCache });
            expect(mockFetch).toHaveBeenCalledWith(
                "/test",
                expect.objectContaining({
                    next: expect.not.objectContaining({ revalidate: 42 }),
                }),
            );
        }
    });

    it("does not override next.revalidate if already set", async () => {
        const mockFetch = jest.fn(async (_input, init) => {
            return { ok: true, status: 200, init } as Response & { init: any };
        });
        const fetch = createFetchWithDefaultNextRevalidate(mockFetch, 42);
        await fetch("/test", { cache: "default", next: { revalidate: 99 } });
        expect(mockFetch).toHaveBeenCalledWith(
            "/test",
            expect.objectContaining({
                next: expect.objectContaining({ revalidate: 99 }),
            }),
        );
    });
});
