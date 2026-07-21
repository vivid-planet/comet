import { render } from "test-utils";
import { describe, expect, it } from "vitest";

import { createBlockSkeleton } from "../../helpers/createBlockSkeleton";
import type { BlockInterface, ReadOnlyBlockRenderInterface } from "../../types";
import { CellValue } from "../CellValue";
import { TableBlockContextProvider } from "../TableBlockContext";

describe("CellValue", () => {
    it("renders the cell value through the injected block's RenderReadOnly, independent of the editor", () => {
        const editorAgnosticBlock: BlockInterface & ReadOnlyBlockRenderInterface = {
            ...createBlockSkeleton(),
            name: "Mock",
            defaultValues: () => ({ label: "" }),
            RenderReadOnly: ({ state }) => <span>{state.label}</span>,
        };

        const rendered = render(
            <TableBlockContextProvider RichTextBlock={editorAgnosticBlock}>
                <CellValue value={{ label: "cell content" }} highlighted={false} recentlyPasted={false} />
            </TableBlockContextProvider>,
        );

        expect(rendered.getByText("cell content")).toBeTruthy();
    });
});
