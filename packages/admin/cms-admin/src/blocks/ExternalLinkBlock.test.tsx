import type { Dispatch, SetStateAction } from "react";
import { MemoryRouter } from "react-router";
import { cleanup, fireEvent, render, screen, waitFor } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { type BlocksConfig, BlocksConfigProvider } from "./config/BlocksConfigContext";
import { ExternalLinkBlock } from "./ExternalLinkBlock";

type State = ReturnType<typeof ExternalLinkBlock.defaultValues>;

function renderAdminComponent({
    blocksConfig = {},
    state = ExternalLinkBlock.defaultValues(),
    updateState = () => undefined,
}: { blocksConfig?: BlocksConfig; state?: State; updateState?: Dispatch<SetStateAction<State>> } = {}) {
    return render(
        <MemoryRouter>
            <BlocksConfigProvider {...blocksConfig}>
                <ExternalLinkBlock.AdminComponent state={state} updateState={updateState} />
            </BlocksConfigProvider>
        </MemoryRouter>,
    );
}

describe("ExternalLinkBlock", () => {
    afterEach(() => {
        cleanup();
    });

    it("shows the open in new window and no follow options by default", () => {
        renderAdminComponent();

        expect(screen.queryByText("Open in new window")).not.toBeNull();
        expect(screen.queryByText("No follow")).not.toBeNull();
    });

    it("hides the options disabled in the blocks config", () => {
        renderAdminComponent({ blocksConfig: { externalLink: { showOpenInNewWindow: false, showNoFollow: false } } });

        expect(screen.queryByRole("textbox")).not.toBeNull();
        expect(screen.queryByText("Open in new window")).toBeNull();
        expect(screen.queryByText("No follow")).toBeNull();
    });

    it("keeps the values of hidden options", async () => {
        let updatedState: State | undefined;
        renderAdminComponent({
            blocksConfig: { externalLink: { showOpenInNewWindow: false, showNoFollow: false } },
            state: { targetUrl: undefined, openInNewWindow: true, noFollow: true },
            updateState: (state) => {
                updatedState = typeof state === "function" ? state(updatedState as State) : state;
            },
        });

        fireEvent.change(screen.getByRole("textbox"), { target: { value: "https://example.com" } });

        await waitFor(() => {
            expect(updatedState).toEqual({ targetUrl: "https://example.com", openInNewWindow: true, noFollow: true });
        });
    });
});
