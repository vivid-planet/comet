import { describe, expect, it, vi } from "vitest";

import { decomposeUpdateStateAction } from "./decomposeUpdateStateAction";

type State = { foo: number; bar: string };

describe("decomposeUpdateStateAction", () => {
    it("should update the allowed key and keep the rest when dispatching an object", () => {
        const dispatch = vi.fn();
        decomposeUpdateStateAction(dispatch, ["bar"] as const)({ bar: "new" });

        const [updater] = dispatch.mock.lastCall ?? [];
        expect(updater({ foo: 1, bar: "old" })).toEqual({ foo: 1, bar: "new" });
    });

    it("should not change keys outside the allowlist", () => {
        const dispatch = vi.fn();
        decomposeUpdateStateAction(dispatch, ["bar"] as const)({ bar: "new" });

        const [updater] = dispatch.mock.lastCall ?? [];
        expect(updater({ foo: 42, bar: "old" }).foo).toBe(42);
    });

    it("should only expose allowed keys to a function action as previous state", () => {
        const dispatch = vi.fn();
        let capturedPrev: unknown;
        decomposeUpdateStateAction(dispatch, ["bar"] as const)((prev) => {
            capturedPrev = { ...prev };
            return { bar: "new" };
        });

        (dispatch.mock.lastCall ?? [])[0]({ foo: 99, bar: "original" });
        expect(capturedPrev).toEqual({ bar: "original" });
    });

    it("should allow a function action to derive the next value from the previous allowed state", () => {
        const dispatch = vi.fn();
        decomposeUpdateStateAction(dispatch, ["bar"] as const)((prev: Pick<State, "bar">) => ({ bar: `${prev.bar}!` }));

        const [updater] = dispatch.mock.lastCall ?? [];
        expect(updater({ foo: 1, bar: "hello" })).toEqual({ foo: 1, bar: "hello!" });
    });

    it("should give a function action an empty previous state when no keys are in the allowlist", () => {
        const dispatch = vi.fn();
        let capturedPrev: unknown;
        decomposeUpdateStateAction(
            dispatch,
            [],
        )((prev) => {
            capturedPrev = { ...prev };
            return {};
        });

        (dispatch.mock.lastCall ?? [])[0]({ foo: 1, bar: "old" });
        expect(capturedPrev).toEqual({});
    });

    it("should give a function action the full previous state when all keys are in the allowlist", () => {
        const dispatch = vi.fn();
        let capturedPrev: unknown;
        decomposeUpdateStateAction(dispatch, ["foo", "bar"] as const)((prev) => {
            capturedPrev = { ...prev };
            return prev as Pick<State, "foo" | "bar">;
        });

        (dispatch.mock.lastCall ?? [])[0]({ foo: 1, bar: "old" });
        expect(capturedPrev).toEqual({ foo: 1, bar: "old" });
    });
});
