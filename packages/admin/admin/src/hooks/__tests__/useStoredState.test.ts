import { act, renderHook } from "test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useStoredState } from "../useStoredState";

function createMockStorage(initial: Record<string, string> = {}): Storage {
    const store: Record<string, string> = { ...initial };
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            Object.keys(store).forEach((k) => delete store[k]);
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (index: number) => Object.keys(store)[index] ?? null,
    };
}

afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe("useStoredState", () => {
    it("returns the initial value when no stored value exists", () => {
        const storage = createMockStorage();
        const { result } = renderHook(() => useStoredState("my-key", "hello", storage));
        expect(result.current[0]).toBe("hello");
    });

    it("returns the stored value when localStorage already has a value", () => {
        const storage = createMockStorage({ "my-key": JSON.stringify("stored") });
        const { result } = renderHook(() => useStoredState("my-key", "default", storage));
        expect(result.current[0]).toBe("stored");
    });

    it("persists state updates to storage", () => {
        const storage = createMockStorage();
        const { result } = renderHook(() => useStoredState<string>("my-key", "initial", storage));

        act(() => {
            result.current[1]("updated");
        });

        expect(result.current[0]).toBe("updated");
        expect(JSON.parse(storage.getItem("my-key") as string)).toBe("updated");
    });

    it("skips storage when key is false", () => {
        const storage = createMockStorage();
        const { result } = renderHook(() => useStoredState<string>(false, "default-value", storage));

        expect(result.current[0]).toBe("default-value");

        act(() => {
            result.current[1]("changed");
        });

        expect(result.current[0]).toBe("changed");
        expect(storage.length).toBe(0);
    });

    it("falls back to initial value when stored JSON is malformed", () => {
        const storage = createMockStorage({ "bad-key": "{ not valid json" });
        const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

        const { result } = renderHook(() => useStoredState("bad-key", 42, storage));

        expect(result.current[0]).toBe(42);
        expect(consoleSpy).toHaveBeenCalled();
    });

    it("accepts an initializer function instead of a plain value", () => {
        const storage = createMockStorage();
        const init = vi.fn(() => "computed");
        const { result } = renderHook(() => useStoredState("fn-key", init, storage));

        expect(result.current[0]).toBe("computed");
        expect(init).toHaveBeenCalledOnce();
    });

    it("does NOT call the initializer function when a stored value exists", () => {
        const storage = createMockStorage({ "fn-key": JSON.stringify("from-storage") });
        const init = vi.fn(() => "computed");
        const { result } = renderHook(() => useStoredState("fn-key", init, storage));

        expect(result.current[0]).toBe("from-storage");
        expect(init).not.toHaveBeenCalled();
    });

    it("correctly returns stored boolean false (truthy string 'false' parses to false)", () => {
        const storage = createMockStorage({ "bool-key": JSON.stringify(false) });
        const { result } = renderHook(() => useStoredState("bool-key", true, storage));
        expect(result.current[0]).toBe(false);
    });

    it("works with complex object values", () => {
        const storage = createMockStorage();
        const initial = { count: 0, labels: ["a", "b"] };
        const { result } = renderHook(() => useStoredState("obj-key", initial, storage));

        const updated = { count: 1, labels: ["a", "b", "c"] };
        act(() => {
            result.current[1](updated);
        });

        expect(result.current[0]).toEqual(updated);
        expect(JSON.parse(storage.getItem("obj-key") as string)).toEqual(updated);
    });
});
