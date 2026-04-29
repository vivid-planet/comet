import { MockedProvider } from "@apollo/client/testing";
import type { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cleanup, fireEvent, render, screen } from "test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FileField } from "../FileField";
import type { GQLDamMultiFileFieldFileFragment } from "../FileField.gql.generated";

vi.mock("../chooseFile/ChooseFileDialog", () => ({
    ChooseFileDialog: () => null,
}));
vi.mock("../chooseFile/ChooseFilesDialog", () => ({
    ChooseFilesDialog: () => null,
}));
vi.mock("../DamPathLazy", () => ({ DamPathLazy: () => null }));
vi.mock("../../../dependencies/dependenciesConfig", () => ({ useDependenciesConfig: () => ({ entityDependencyMap: {} }) }));
vi.mock("../../../contentScope/Provider", () => ({ useContentScope: () => ({ match: { url: "" } }) }));

// Replace FileFieldRow with a minimal stub that exposes `onMove` so the reorder
// callback can be invoked synchronously from the test, simulating the rapid
// react-dnd `hover` events that motivated the `filesRef` fix.
vi.mock("../FileFieldRow", () => ({
    FileFieldRow: ({
        file,
        index,
        onMove,
    }: {
        file: GQLDamMultiFileFieldFileFragment;
        index: number;
        onMove: (drag: number, hover: number) => void;
        onRemove: () => void;
    }) => (
        <div data-testid={`row-${file.id}`}>
            <span>{file.name}</span>
            <button data-testid={`move-${file.id}`} data-index={index} onClick={() => onMove(index, index + 1)}>
                move
            </button>
        </div>
    ),
}));

const Wrap = ({ children }: { children: ReactNode }) => (
    <MockedProvider>
        <DndProvider backend={HTML5Backend}>{children}</DndProvider>
    </MockedProvider>
);

const makeFile = (id: string, name: string): GQLDamMultiFileFieldFileFragment =>
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
    }) as unknown as GQLDamMultiFileFieldFileFragment;

const makeMultiInput = (value: GQLDamMultiFileFieldFileFragment[] | undefined, onChange = vi.fn()) =>
    ({
        input: { value, onChange, name: "files", onBlur: vi.fn(), onFocus: vi.fn() },
        meta: {},
        multiple: true as const,
    }) as unknown as Parameters<typeof FileField>[0];

describe("FileField multi mode — reorder stale-state guard", () => {
    afterEach(() => {
        cleanup();
    });

    it("two synchronous onMove calls produce the correct final order", () => {
        const onChange = vi.fn();
        const files = [makeFile("1", "a.png"), makeFile("2", "b.png"), makeFile("3", "c.png")];
        render(
            <Wrap>
                <FileField {...makeMultiInput(files, onChange)} />
            </Wrap>,
        );

        // Click two move buttons synchronously in the same tick. React batches the renders,
        // so the second handler sees the same `files` snapshot as the first — without the
        // synchronous `filesRef.current = next` write inside `commitChange`, the second
        // call clobbers the first.
        // Buttons capture their index at render time. Both call `onMove(index, index + 1)`:
        //   - "move-1" was rendered with index=0 → onMove(0, 1)
        //   - "move-2" was rendered with index=1 → onMove(1, 2)
        // With filesRef:
        //   click 1: handleMove(0,1) on ["1","2","3"] → ["2","1","3"]
        //   click 2: handleMove(1,2) on ["2","1","3"] → ["2","3","1"]
        // Without filesRef (stale `files`):
        //   click 1: ["2","1","3"]
        //   click 2: handleMove(1,2) on stale ["1","2","3"] → ["1","3","2"]   ← regression
        fireEvent.click(screen.getByTestId("move-1"));
        fireEvent.click(screen.getByTestId("move-2"));

        expect(onChange).toHaveBeenCalledTimes(2);
        const firstCall = onChange.mock.calls[0]?.[0] as GQLDamMultiFileFieldFileFragment[];
        const finalCall = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0] as GQLDamMultiFileFieldFileFragment[];

        expect(firstCall.map((f) => f.id)).toEqual(["2", "1", "3"]);
        expect(finalCall.map((f) => f.id)).toEqual(["2", "3", "1"]);
    });

    it("a single onMove commits the expected new order", () => {
        const onChange = vi.fn();
        const files = [makeFile("1", "a.png"), makeFile("2", "b.png"), makeFile("3", "c.png")];
        render(
            <Wrap>
                <FileField {...makeMultiInput(files, onChange)} />
            </Wrap>,
        );

        fireEvent.click(screen.getByTestId("move-1")); // 0 → 1, expected ["2","1","3"]
        expect(onChange).toHaveBeenCalledTimes(1);
        expect((onChange.mock.calls[0]?.[0] as GQLDamMultiFileFieldFileFragment[]).map((f) => f.id)).toEqual(["2", "1", "3"]);
    });
});
