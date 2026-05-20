import { MockedProvider } from "@apollo/client/testing";
import { cleanup, fireEvent, render, screen } from "test-utils";
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
let mockAllowPageDelete: boolean | undefined;

vi.mock("../pageTreeConfig", () => ({
    usePageTreeConfig: () => ({
        documentTypes: mockDocumentTypes,
        allowPageDelete: mockAllowPageDelete,
    }),
}));

vi.mock("./usePageTreeContext", () => ({
    usePageTreeContext: () => ({
        tree: new Map(),
    }),
}));

vi.mock("@comet/admin", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@comet/admin")>();
    return {
        ...actual,
        useStackSwitchApi: () => ({
            activatePage: mockActivatePage,
        }),
    };
});

vi.mock("../../preview/openSitePreviewWindow", () => ({
    openSitePreviewWindow: (...args: unknown[]) => mockOpenSitePreviewWindow(...args),
}));

vi.mock("./MovePageMenuItem", () => ({
    MovePageMenuItem: () => null,
}));

vi.mock("./CopyPasteMenuItem", () => ({
    CopyPasteMenuItem: () => null,
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

    describe("allowPageDelete", () => {
        beforeEach(() => {
            mockDocumentTypes = { Page: baseDocumentType };
        });

        function openSubmenu() {
            const buttons = screen.getAllByRole("button");
            // The last button is the submenu trigger (MoreVertical icon)
            fireEvent.click(buttons[buttons.length - 1]);
        }

        it("shows the delete menu item when allowPageDelete is true", async () => {
            mockAllowPageDelete = true;

            renderPageActions();
            openSubmenu();

            expect(await screen.findByText("Delete")).toBeTruthy();
        });

        it("shows the delete menu item when allowPageDelete is undefined (default)", async () => {
            mockAllowPageDelete = undefined;

            renderPageActions();
            openSubmenu();

            expect(await screen.findByText("Delete")).toBeTruthy();
        });

        it("hides the delete menu item when allowPageDelete is false", async () => {
            mockAllowPageDelete = false;

            renderPageActions();
            openSubmenu();

            // Wait for the menu to open by checking another menu item
            await screen.findByText("Page properties");
            expect(screen.queryByText("Delete")).toBeNull();
        });
    });
});
