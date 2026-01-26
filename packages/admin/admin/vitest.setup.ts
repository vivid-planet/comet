import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

const ResizeObserverMock = vi.fn(
    class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
    },
);

vi.stubGlobal("ResizeObserver", ResizeObserverMock);
