import { cleanup, fireEvent, render, screen } from "test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { GQLDamFileFieldFileFragment } from "../FileField.gql.generated";
import { FileFieldRow } from "../FileFieldRow";

vi.mock("../DamPathLazy", () => ({ DamPathLazy: () => <span data-testid="dam-path" /> }));
vi.mock("../../../dependencies/dependenciesConfig", () => ({ useDependenciesConfig: () => ({ entityDependencyMap: {} }) }));
vi.mock("../../../contentScope/Provider", () => ({ useContentScope: () => ({ match: { url: "" } }) }));
vi.mock("@apollo/client", async () => {
    const actual = await vi.importActual<typeof import("@apollo/client")>("@apollo/client");
    return { ...actual, useApolloClient: () => ({}) };
});

const makeFile = (id = "1", name = "test.png"): GQLDamFileFieldFileFragment =>
    ({
        id,
        name,
        size: 0,
        mimetype: "image/png",
        contentHash: "",
        title: "",
        altText: "",
        archived: false,
        image: null,
        fileUrl: "",
    }) as unknown as GQLDamFileFieldFileFragment;

describe("FileFieldRow", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders the file name", () => {
        render(<FileFieldRow file={makeFile("1", "invoice.pdf")} onRemove={vi.fn()} />);
        expect(screen.getByText("invoice.pdf")).toBeDefined();
    });

    it("calls onRemove when the Remove icon button is clicked", () => {
        const onRemove = vi.fn();
        render(<FileFieldRow file={makeFile()} onRemove={onRemove} />);
        fireEvent.click(screen.getByRole("button", { name: /remove/i }));
        expect(onRemove).toHaveBeenCalledOnce();
    });

    it("renders preview via render function", () => {
        render(<FileFieldRow file={makeFile("abc")} onRemove={vi.fn()} preview={(file) => <span data-testid="preview">{file.id}</span>} />);
        expect(screen.getByTestId("preview").textContent).toBe("abc");
    });
});
