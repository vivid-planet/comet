import { render } from "test-utils";
import { describe, expect, it } from "vitest";

import { createBlockSkeleton } from "../../helpers/createBlockSkeleton";
import type { BlockInterface, ReadOnlyRenderableAdminComponent } from "../../types";
import { CellValue } from "../CellValue";
import { TableBlockContextProvider } from "../TableBlockContext";

describe("CellValue", () => {
    it("renders the cell value read-only through the injected block's AdminComponent, independent of the editor", () => {
        const editorAgnosticBlock: Omit<BlockInterface, "AdminComponent"> & ReadOnlyRenderableAdminComponent<{ label: string }> = {
            ...createBlockSkeleton(),
            name: "Mock",
            defaultValues: () => ({ label: "" }),
            AdminComponent: ({ state, readOnly }) => (readOnly ? <span>{state.label}</span> : <input defaultValue={state.label} />),
        };

        const rendered = render(
            <TableBlockContextProvider RichTextBlock={editorAgnosticBlock}>
                <CellValue value={{ label: "cell content" }} highlighted={false} recentlyPasted={false} />
            </TableBlockContextProvider>,
        );

        expect(rendered.getByText("cell content")).toBeTruthy();
        expect(rendered.queryByRole("textbox")).toBeNull();
    });
});
