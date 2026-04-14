import { MockedProvider } from "@apollo/client/testing";
import { cleanup, render, screen } from "test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import PageActions from "./PageActions";
import { type PageTreePage } from "./usePageTree";

vi.mock("../../contentScope/Provider", () => ({
    useContentScope: () => ({
        match: { url: "/test" },
    }),
}));

vi.mock("../pageTreeConfig", () => ({
    usePageTreeConfig: () => ({
        documentTypes: {
            Page: {
                displayName: "Page",
                editComponent: () => null,
                hasNoSitePreview: false,
                menuIcon: () => null,
            },
        },
    }),
}));

vi.mock("./usePageTreeContext", () => ({
    usePageTreeContext: () => ({
        tree: new Map(),
    }),
}));

const page: PageTreePage = {
    id: "1",
    name: "Test Page",
    parentId: null,
    documentType: "Page",
    pos: 0,
    path: "/test-page",
    category: "main",
    hideInMenu: false,
    visibility: "Published",
    slug: "test-page",
    selected: false,
    expanded: null,
    ancestorIds: [],
    level: 0,
    matches: [],
};

const editDialogApi = {
    openAddDialog: vi.fn(),
    openEditDialog: vi.fn(),
    closeDialog: vi.fn(),
};

function renderPageActions({ hidePreviewAction }: { hidePreviewAction?: boolean } = {}) {
    return render(
        <MockedProvider>
            <PageActions page={page} editDialog={editDialogApi} siteUrl="https://example.com" hidePreviewAction={hidePreviewAction} />
        </MockedProvider>,
    );
}

describe("PageActions", () => {
    afterEach(() => {
        cleanup();
    });

    it("should show the preview action by default", () => {
        renderPageActions();

        const buttons = screen.getAllByRole("button");
        // edit, preview, more menu
        expect(buttons).toHaveLength(3);
    });

    it("should hide the preview action when hidePreviewAction is true", () => {
        renderPageActions({ hidePreviewAction: true });

        const buttons = screen.getAllByRole("button");
        // edit, more menu
        expect(buttons).toHaveLength(2);
    });
});
