import { Stack, StackPage, StackSwitch, SubRoute } from "@dextinity/admin";
import { createMemoryHistory } from "history";
import type { ReactNode } from "react";
import { Route, Router } from "react-router";
import { cleanup, fireEvent, render, screen } from "test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HoverPreviewComponent } from "./HoverPreviewComponent";
import { IFrameBridgeContext } from "./IFrameBridge";

const sendHoverComponent = vi.fn();
const iFrameBridge = { iFrameReady: true, hoveredSiteRoute: null, sendHoverComponent } as unknown as IFrameBridgeContext;

function renderOnEditPage(children: ReactNode) {
    render(
        <Router history={createMemoryHistory({ initialEntries: ["/page/edit"] })}>
            <Route path="/page/edit">
                <IFrameBridgeContext.Provider value={iFrameBridge}>
                    <Stack topLevelTitle="Page">{children}</Stack>
                </IFrameBridgeContext.Provider>
            </Route>
        </Router>,
    );
}

function BlockList({ blockKey }: { blockKey: string }) {
    return (
        <StackSwitch>
            <StackPage name="list">
                <HoverPreviewComponent componentSlug={`${blockKey}/blocks`}>Block list entry</HoverPreviewComponent>
            </StackPage>
            <StackPage name="blocks">Block form</StackPage>
        </StackSwitch>
    );
}

describe("HoverPreviewComponent", () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it("sends the route of a block list entry", () => {
        renderOnEditPage(<BlockList blockKey="block-key" />);

        fireEvent.mouseOver(screen.getByText("Block list entry"));

        expect(sendHoverComponent).toHaveBeenCalledWith("/page/edit/block-key/blocks");
    });

    it("sends the route of a block list entry below a sub-route", () => {
        renderOnEditPage(
            <SubRoute path="/page/edit/save">
                <BlockList blockKey="block-key" />
            </SubRoute>,
        );

        fireEvent.mouseOver(screen.getByText("Block list entry"));

        expect(sendHoverComponent).toHaveBeenCalledWith("/page/edit/save/block-key/blocks");
    });

    it("sends the route of an anchor without the sub-route of a composite block's child block", () => {
        renderOnEditPage(
            <SubRoute path="/page/edit/link">
                <HoverPreviewComponent componentSlug="#external">Link form</HoverPreviewComponent>
            </SubRoute>,
        );

        fireEvent.mouseOver(screen.getByText("Link form"));

        expect(sendHoverComponent).toHaveBeenCalledWith("/page/edit#external");
    });
});
