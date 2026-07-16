import type { EntityManager } from "@mikro-orm/postgresql";
import { subMinutes } from "date-fns";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DependenciesService } from "./dependencies.service";

// The refresh coordination is split into small private methods so the decision logic can be tested
// without a real database. These tests spy on those methods; the raw SQL they contain is left to
// integration testing.
type RefreshInternals = {
    refresh: (options?: { concurrently?: boolean; waitForRunningRefresh?: boolean }) => Promise<void>;
    tryClaimRefresh: () => Promise<string | null>;
    getRunningRefresh: () => Promise<{ id: string } | undefined>;
    runRefresh: (args: { id: string; concurrently: boolean }) => Promise<void>;
    waitForRunningRefreshToComplete: () => Promise<boolean>;
    getLastFinishedRefresh: () => Promise<{ finishedAt: Date } | undefined>;
    forceRefresh: () => Promise<void>;
};

const internals = (service: DependenciesService) => service as unknown as RefreshInternals;

function createService(knex?: unknown) {
    const entityManager = {
        getConnection: vi.fn().mockReturnValue({}),
        getKnex: vi.fn().mockReturnValue(knex),
    } as unknown as EntityManager;

    return new DependenciesService(null as never, null as never, entityManager);
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe("DependenciesService.refreshViews", () => {
    it("force-refreshes and skips the staleness strategy path", async () => {
        const service = createService();
        const forceRefresh = vi.spyOn(internals(service), "forceRefresh").mockResolvedValue(undefined);
        const refresh = vi.spyOn(internals(service), "refresh").mockResolvedValue(undefined);
        const getLastFinishedRefresh = vi.spyOn(internals(service), "getLastFinishedRefresh").mockResolvedValue(undefined);

        await service.refreshViews({ force: true });

        expect(forceRefresh).toHaveBeenCalledOnce();
        expect(refresh).not.toHaveBeenCalled();
        expect(getLastFinishedRefresh).not.toHaveBeenCalled();
    });

    it("skips refreshing when the last refresh is fresh", async () => {
        const service = createService();
        vi.spyOn(internals(service), "getLastFinishedRefresh").mockResolvedValue({ finishedAt: subMinutes(new Date(), 1) });
        const refresh = vi.spyOn(internals(service), "refresh").mockResolvedValue(undefined);

        await service.refreshViews();

        expect(refresh).not.toHaveBeenCalled();
    });

    it("refreshes concurrently in the background when moderately stale", async () => {
        const service = createService();
        vi.spyOn(internals(service), "getLastFinishedRefresh").mockResolvedValue({ finishedAt: subMinutes(new Date(), 10) });
        const refresh = vi.spyOn(internals(service), "refresh").mockResolvedValue(undefined);

        await service.refreshViews();

        expect(refresh).toHaveBeenCalledWith({ concurrently: true });
    });

    it("awaits the background refresh when awaitRefresh is set", async () => {
        const service = createService();
        vi.spyOn(internals(service), "getLastFinishedRefresh").mockResolvedValue({ finishedAt: subMinutes(new Date(), 10) });
        const refresh = vi.spyOn(internals(service), "refresh").mockRejectedValue(new Error("boom"));

        await expect(service.refreshViews({ awaitRefresh: true })).rejects.toThrow("boom");
        expect(refresh).toHaveBeenCalledWith({ concurrently: true });
    });

    it("refreshes synchronously and waits when very stale", async () => {
        const service = createService();
        vi.spyOn(internals(service), "getLastFinishedRefresh").mockResolvedValue({ finishedAt: subMinutes(new Date(), 30) });
        const refresh = vi.spyOn(internals(service), "refresh").mockResolvedValue(undefined);

        await service.refreshViews();

        expect(refresh).toHaveBeenCalledWith({ waitForRunningRefresh: true });
    });

    it("refreshes synchronously and waits on first-time initialization", async () => {
        const service = createService();
        vi.spyOn(internals(service), "getLastFinishedRefresh").mockResolvedValue(undefined);
        const refresh = vi.spyOn(internals(service), "refresh").mockResolvedValue(undefined);

        await service.refreshViews();

        expect(refresh).toHaveBeenCalledWith({ waitForRunningRefresh: true });
    });
});

describe("DependenciesService refresh coordination", () => {
    it("claims and runs the refresh when none is in progress", async () => {
        const service = createService();
        vi.spyOn(internals(service), "tryClaimRefresh").mockResolvedValue("refresh-1");
        const runRefresh = vi.spyOn(internals(service), "runRefresh").mockResolvedValue(undefined);
        const wait = vi.spyOn(internals(service), "waitForRunningRefreshToComplete").mockResolvedValue(false);

        await internals(service).refresh({ waitForRunningRefresh: true });

        expect(runRefresh).toHaveBeenCalledWith({ id: "refresh-1", concurrently: false });
        expect(wait).not.toHaveBeenCalled();
    });

    it("passes the concurrently flag through to runRefresh", async () => {
        const service = createService();
        vi.spyOn(internals(service), "tryClaimRefresh").mockResolvedValue("refresh-1");
        const runRefresh = vi.spyOn(internals(service), "runRefresh").mockResolvedValue(undefined);

        await internals(service).refresh({ concurrently: true });

        expect(runRefresh).toHaveBeenCalledWith({ id: "refresh-1", concurrently: true });
    });

    it("skips immediately without waiting when a refresh is running and waiting is disabled", async () => {
        const service = createService();
        const tryClaim = vi.spyOn(internals(service), "tryClaimRefresh").mockResolvedValue(null);
        const runRefresh = vi.spyOn(internals(service), "runRefresh").mockResolvedValue(undefined);
        const wait = vi.spyOn(internals(service), "waitForRunningRefreshToComplete").mockResolvedValue(true);

        await internals(service).refresh({ concurrently: true });

        expect(tryClaim).toHaveBeenCalledOnce();
        expect(runRefresh).not.toHaveBeenCalled();
        expect(wait).not.toHaveBeenCalled();
    });

    it("waits for the in-progress refresh and returns fresh data without starting a duplicate", async () => {
        const service = createService();
        const tryClaim = vi
            .spyOn(internals(service), "tryClaimRefresh")
            .mockResolvedValueOnce(null) // a refresh is already running
            .mockResolvedValueOnce(null); // after waiting, the completed refresh is fresh -> claim skips on recency
        const runRefresh = vi.spyOn(internals(service), "runRefresh").mockResolvedValue(undefined);
        const wait = vi
            .spyOn(internals(service), "waitForRunningRefreshToComplete")
            .mockResolvedValueOnce(true) // the in-progress refresh was running; wait for it
            .mockResolvedValueOnce(false); // it finished with fresh data; nothing left to wait for

        await internals(service).refresh({ waitForRunningRefresh: true });

        expect(tryClaim).toHaveBeenCalledTimes(2);
        expect(wait).toHaveBeenCalledTimes(2);
        expect(runRefresh).not.toHaveBeenCalled();
    });

    it("takes over the refresh when the awaited refresh failed to produce fresh data", async () => {
        const service = createService();
        const tryClaim = vi
            .spyOn(internals(service), "tryClaimRefresh")
            .mockResolvedValueOnce(null) // a refresh is already running
            .mockResolvedValueOnce("refresh-2"); // the running refresh failed, leaving no fresh row -> we claim it
        const runRefresh = vi.spyOn(internals(service), "runRefresh").mockResolvedValue(undefined);
        const wait = vi.spyOn(internals(service), "waitForRunningRefreshToComplete").mockResolvedValue(true);

        await internals(service).refresh({ waitForRunningRefresh: true });

        expect(tryClaim).toHaveBeenCalledTimes(2);
        expect(wait).toHaveBeenCalledOnce();
        expect(runRefresh).toHaveBeenCalledWith({ id: "refresh-2", concurrently: false });
    });

    it("returns immediately when the claim fails only because data is already fresh", async () => {
        const service = createService();
        const tryClaim = vi.spyOn(internals(service), "tryClaimRefresh").mockResolvedValue(null);
        const runRefresh = vi.spyOn(internals(service), "runRefresh").mockResolvedValue(undefined);
        const wait = vi.spyOn(internals(service), "waitForRunningRefreshToComplete").mockResolvedValue(false); // nothing running

        await internals(service).refresh({ waitForRunningRefresh: true });

        expect(tryClaim).toHaveBeenCalledOnce();
        expect(wait).toHaveBeenCalledOnce();
        expect(runRefresh).not.toHaveBeenCalled();
    });
});

describe("DependenciesService.waitForRunningRefreshToComplete", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns false without polling when no refresh is running", async () => {
        const service = createService();
        const getRunning = vi.spyOn(internals(service), "getRunningRefresh").mockResolvedValue(undefined);

        const result = await internals(service).waitForRunningRefreshToComplete();

        expect(result).toBe(false);
        expect(getRunning).toHaveBeenCalledOnce();
    });

    it("polls until the running refresh disappears, then returns true", async () => {
        const service = createService();
        const getRunning = vi
            .spyOn(internals(service), "getRunningRefresh")
            .mockResolvedValueOnce({ id: "refresh-1" })
            .mockResolvedValueOnce({ id: "refresh-1" })
            .mockResolvedValue(undefined);

        const promise = internals(service).waitForRunningRefreshToComplete();
        await vi.runAllTimersAsync();

        await expect(promise).resolves.toBe(true);
        expect(getRunning).toHaveBeenCalledTimes(3);
    });
});

describe("DependenciesService.tryClaimRefresh", () => {
    it("returns an id when the conditional insert claims the refresh", async () => {
        const raw = vi.fn().mockResolvedValue({ rows: [{ id: "inserted" }] });
        const knex = Object.assign(vi.fn(), { raw });
        const service = createService(knex);

        const result = await internals(service).tryClaimRefresh();

        expect(result).toBeTypeOf("string");
        expect(raw).toHaveBeenCalledOnce();
    });

    it("returns null when another caller already holds the claim", async () => {
        const raw = vi.fn().mockResolvedValue({ rows: [] });
        const knex = Object.assign(vi.fn(), { raw });
        const service = createService(knex);

        expect(await internals(service).tryClaimRefresh()).toBeNull();
    });
});

describe("DependenciesService.runRefresh", () => {
    function createKnexMock({ rawResult }: { rawResult: Promise<unknown> }) {
        const update = vi.fn().mockResolvedValue(undefined);
        const del = vi.fn().mockResolvedValue(undefined);
        const where = vi.fn().mockReturnValue({ update, delete: del });
        const raw = vi.fn().mockReturnValue(rawResult);
        const knex = Object.assign(vi.fn().mockReturnValue({ where }), { raw });
        return { knex, raw, where, update, del };
    }

    it("marks the refresh finished on success and does not delete the marker", async () => {
        const { knex, where, update, del } = createKnexMock({ rawResult: Promise.resolve(undefined) });
        const service = createService(knex);

        await internals(service).runRefresh({ id: "refresh-1", concurrently: false });

        expect(where).toHaveBeenCalledWith({ id: "refresh-1" });
        expect(update).toHaveBeenCalledOnce();
        expect(del).not.toHaveBeenCalled();
    });

    it("removes the in-progress marker and rethrows when the refresh fails", async () => {
        const { knex, update, del } = createKnexMock({ rawResult: Promise.reject(new Error("refresh failed")) });
        const service = createService(knex);

        await expect(internals(service).runRefresh({ id: "refresh-1", concurrently: false })).rejects.toThrow("refresh failed");

        expect(del).toHaveBeenCalledOnce();
        expect(update).not.toHaveBeenCalled();
    });

    it("refreshes the view CONCURRENTLY when requested", async () => {
        const { knex, raw } = createKnexMock({ rawResult: Promise.resolve(undefined) });
        const service = createService(knex);

        await internals(service).runRefresh({ id: "refresh-1", concurrently: true });

        expect(raw).toHaveBeenCalledWith(expect.stringContaining("CONCURRENTLY"));
    });
});
