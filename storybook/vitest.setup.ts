import "@testing-library/jest-dom/vitest";

import { setProjectAnnotations } from "@storybook/react-webpack5";
import { vi } from "vitest";

// Mock the MSW browser worker since it's not available in jsdom
vi.mock("./.storybook/mocks/browser", () => ({
    worker: {
        start: vi.fn(),
        stop: vi.fn(),
        use: vi.fn(),
        resetHandlers: vi.fn(),
    },
}));

// Mock @fontsource-variable/roboto-flex/full.css since CSS imports are not supported in jsdom
vi.mock("@fontsource-variable/roboto-flex/full.css", () => ({}));

const ResizeObserverMock = vi.fn(
    class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
    },
);

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// Storybook's enhanceContext loader needs navigator.clipboard to be defined
// in order to set up userEvent on the play function context.
if (!navigator.clipboard) {
    Object.defineProperty(navigator, "clipboard", {
        value: {
            writeText: vi.fn(),
            readText: vi.fn(),
        },
        configurable: true,
    });
}

// Apply Storybook project annotations (decorators, parameters) so that
// composeStories picks them up automatically.
// Import preview *after* mocks are in place.
const preview = await import("./.storybook/preview");
setProjectAnnotations(preview);
