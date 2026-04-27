import { MockedProvider } from "@apollo/client/testing";
import type { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cleanup, fireEvent, render, screen } from "test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FileField } from "../FileField";
import type { GQLDamFileFieldFileFragment } from "../FileField.gql.generated";

vi.mock("../chooseFile/ChooseFileDialog", () => ({
    ChooseFileDialog: ({ open }: { open: boolean }) => (open ? <div data-testid="choose-file-dialog" /> : null),
}));
vi.mock("../chooseFile/ChooseFilesDialog", () => ({
    ChooseFilesDialog: ({ open }: { open: boolean }) => (open ? <div data-testid="choose-files-dialog" /> : null),
}));
vi.mock("../DamPathLazy", () => ({ DamPathLazy: () => <span data-testid="dam-path" /> }));
vi.mock("../../../dependencies/dependenciesConfig", () => ({ useDependenciesConfig: () => ({ entityDependencyMap: {} }) }));
vi.mock("../../../contentScope/Provider", () => ({ useContentScope: () => ({ match: { url: "" } }) }));

const Wrap = ({ children }: { children: ReactNode }) => (
    <MockedProvider>
        <DndProvider backend={HTML5Backend}>{children}</DndProvider>
    </MockedProvider>
);

const makeFile = (id: string, name: string): GQLDamFileFieldFileFragment =>
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

const makeSingleInput = (value: GQLDamFileFieldFileFragment | undefined, onChange = vi.fn()) =>
    ({
        input: { value, onChange, name: "file", onBlur: vi.fn(), onFocus: vi.fn() },
        meta: {},
    }) as unknown as Parameters<typeof FileField>[0];

const makeMultiInput = (value: GQLDamFileFieldFileFragment[] | undefined, onChange = vi.fn()) =>
    ({
        input: { value, onChange, name: "files", onBlur: vi.fn(), onFocus: vi.fn() },
        meta: {},
        multiple: true as const,
    }) as unknown as Parameters<typeof FileField>[0];

describe("FileField single mode (backwards compatible)", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders the choose-file button when value is undefined", () => {
        render(
            <Wrap>
                <FileField {...makeSingleInput(undefined)} />
            </Wrap>,
        );
        expect(screen.getByRole("button", { name: /choose file/i })).toBeDefined();
    });

    it("renders the file name when value is a single fragment", () => {
        render(
            <Wrap>
                <FileField {...makeSingleInput(makeFile("1", "single.png"))} />
            </Wrap>,
        );
        expect(screen.getByText("single.png")).toBeDefined();
    });

    it("clears the value when Empty is clicked", () => {
        const onChange = vi.fn();
        render(
            <Wrap>
                <FileField {...makeSingleInput(makeFile("1", "single.png"), onChange)} />
            </Wrap>,
        );
        fireEvent.click(screen.getByRole("button", { name: /empty/i }));
        expect(onChange).toHaveBeenCalledWith(undefined);
    });
});

describe("FileField multi mode", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders the choose-files button when value is undefined", () => {
        render(
            <Wrap>
                <FileField {...makeMultiInput(undefined)} />
            </Wrap>,
        );
        expect(screen.getByRole("button", { name: /choose files/i })).toBeDefined();
    });

    it("renders a row per file and a Change-selected-files button", () => {
        render(
            <Wrap>
                <FileField {...makeMultiInput([makeFile("1", "a.png"), makeFile("2", "b.png")])} />
            </Wrap>,
        );
        expect(screen.getByText("a.png")).toBeDefined();
        expect(screen.getByText("b.png")).toBeDefined();
        expect(screen.getByRole("button", { name: /change selected files/i })).toBeDefined();
    });

    it("removes a file and keeps the rest", () => {
        const onChange = vi.fn();
        render(
            <Wrap>
                <FileField {...makeMultiInput([makeFile("1", "a.png"), makeFile("2", "b.png")], onChange)} />
            </Wrap>,
        );
        const removeButtons = screen.getAllByRole("button", { name: /remove/i });
        fireEvent.click(removeButtons[0]);
        expect(onChange).toHaveBeenCalledWith([expect.objectContaining({ id: "2", name: "b.png" })]);
    });

    it("removing the last file yields undefined", () => {
        const onChange = vi.fn();
        render(
            <Wrap>
                <FileField {...makeMultiInput([makeFile("1", "a.png")], onChange)} />
            </Wrap>,
        );
        fireEvent.click(screen.getByRole("button", { name: /remove/i }));
        expect(onChange).toHaveBeenCalledWith(undefined);
    });
});
