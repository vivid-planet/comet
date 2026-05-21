import { MockedProvider } from "@apollo/client/testing";
import type { ReactNode } from "react";
import { cleanup, render, screen } from "test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { DocumentInterface } from "../../documents/types";
import PageActions from "./PageActions";
import type { PageTreePage } from "./usePageTree";

const mockActivatePage = vi.fn();
const mockOpenSitePreviewWindow = vi.fn();

vi.mock("../../contentScope/Provider", () => ({
    useContentScope: () => ({
        match: { url: "http://localhost:3000" },
    }),
}));

let mockDocumentTypes: Record<string, DocumentInterface>;
let mockIsAllowed: (permission: string) => boolean;

vi.mock("../pageTreeConfig", () => ({
    usePageTreeConfig: () => ({
        documentTypes: mockDocumentTypes,
    }),
}));

vi.mock("../../userPermissions/hooks/currentUser", () => ({
    useUserPermissionCheck: () => mockIsAllowed,
}));

vi.mock("./usePageTreeContext", () => ({
    usePageTreeContext: () => ({
        tree: new Map(),
    }),
}));

vi.mock("./MovePageMenuItem", () => ({
    MovePageMenuItem: () => null,
}));

vi.mock("./CopyPasteMenuItem", () => ({
    CopyPasteMenuItem: () => null,
}));

vi.mock("@comet/admin", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@comet/admin")>();
    return {
        ...actual,
        useStackSwitchApi: () => ({
            activatePage: mockActivatePage,
        }),
        RowActionsMenu: ({ children }: { children: ReactNode }) => <>{children}</>,
        RowActionsItem: ({ children }: { children: ReactNode }) => <>{children}</>,
    };
});

vi.mock("../../preview/openSitePreviewWindow", () => ({
    openSitePreviewWindow: (...args: unknown[]) => mockOpenSitePreviewWindow(...args),
}));

const basePage: PageTreePage = {
    id: "page-1",
    name: "Test Page",
    parentId: null,
    documentType: "Page",
    pos: 0,
    path: "/test-page",
    category: "MainNavigation",
    hideInMenu: false,
    visibility: "Published",
    slug: "test-page",
    selected: false,
    expanded: false,
    ancestorIds: [],
    level: 0,
    matches: [],
};

const baseDocumentType: DocumentInterface = {
    displayName: "Page",
    menuIcon: () => null,
    anchors: () => [],
    dependencies: () => [],
    replaceDependenciesInOutput: (output) => output,
};

const mockEditDialog = {
    openEditDialog: vi.fn(),
    openAddDialog: vi.fn(),
} as never;

function renderPageActions(page: PageTreePage = basePage) {
    return render(
        <MockedProvider>
            <PageActions page={page} editDialog={mockEditDialog} siteUrl="http://localhost:3000" />
        </MockedProvider>,
    );
}

describe("PageActions", () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    beforeEach(() => {
        mockIsAllowed = () => true;
    });

    describe("SitePreviewAction", () => {
        it("renders the custom SitePreviewAction component when provided", () => {
            const CustomPreviewAction = ({ pageTreeNode }: { pageTreeNode: PageTreePage }) => <button>Custom preview for {pageTreeNode.name}</button>;

            mockDocumentTypes = {
                Page: {
                    ...baseDocumentType,
                    SitePreviewAction: CustomPreviewAction,
                },
            };

            renderPageActions();

            expect(screen.getByText("Custom preview for Test Page")).toBeTruthy();
        });

        it("does not render the custom SitePreviewAction when not provided", () => {
            mockDocumentTypes = { Page: baseDocumentType };

            renderPageActions();

            expect(screen.queryByText("Custom preview for Test Page")).toBeNull();
        });

        it("passes the pageTreeNode prop to SitePreviewAction", () => {
            const sitePreviewActionFn = vi.fn(() => <button>Custom action</button>);

            mockDocumentTypes = {
                Page: {
                    ...baseDocumentType,
                    SitePreviewAction: sitePreviewActionFn,
                },
            };

            renderPageActions();

            expect(sitePreviewActionFn).toHaveBeenCalledWith(expect.objectContaining({ pageTreeNode: basePage }), undefined);
        });
    });

    describe("delete action permission", () => {
        it("renders delete action when user can delete page tree nodes", () => {
            mockDocumentTypes = { Page: baseDocumentType };
            mockIsAllowed = (permission) => permission === "pageTreeDeleteNode";

            renderPageActions();

            expect(screen.getByText(/Delete/)).toBeTruthy();
        });

        it("hides delete action when user cannot delete page tree nodes", () => {
            mockDocumentTypes = { Page: baseDocumentType };
            mockIsAllowed = () => false;

            renderPageActions();

            expect(screen.queryByText(/Delete/)).toBeNull();
        });
    });
});
